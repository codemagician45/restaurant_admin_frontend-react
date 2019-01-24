import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import queryString from 'query-string';
import { withRouter } from 'react-router-dom';
import { Form, FormGroup, Label, Input } from 'reactstrap';
import Switch from 'react-toggle-switch';
import { ImageUploader } from 'components';
import Select from 'react-select';
import ModalWrapper from '../ModalWrapper';
import { addRestaurant } from 'services/restaurant/restaurantActions';
import { getCategories } from 'services/category/categoryActions';

class RestaurantAdd extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      is_open: 1,
      category: []
    };
    this.submit_data = { order: 1 };

    this.onChange = this.onChange.bind(this);
    this.onLoad = this.onLoad.bind(this);
    this.onCategoryChange = this.onCategoryChange.bind(this);
  }

  componentDidMount() {
    this.props.categoryActions.getCategories();
  }

  onChange(e) {
    this.submit_data = {
      ...this.submit_data,
      [e.target.name]: e.target.value
    };
  }

  onLoad(file, file_type, file_name) {
    this.submit_data = {
      ...this.submit_data,
      file,
      file_type,
      file_name
    };
  }

  onCategoryChange(category) {
    this.setState({
      category
    });
  }

  renderCategoryOptions(categories) {
    if (categories && categories.data) {
      const options = categories.data.map(category => {
        return {
          value: category.id,
          label: `${category.name} (${category.city.name})`
        };
      });
      return (
        <Select options={options} isMulti onChange={this.onCategoryChange} />
      );
    }
  }

  render() {
    return (
      <ModalWrapper
        title="Restaurant add"
        okText="Submit"
        onOk={() => {
          const category = this.state.category.map(item => {
            return item.value;
          });

          const params = queryString.parse(this.props.location.search);

          const restaurant = {
            name: this.submit_data.name,
            order: this.submit_data.order,
            file: this.submit_data.file,
            file_type: this.submit_data.file_type,
            file_name: this.submit_data.file_name,
            is_open: this.state.is_open,
            category
          };

          this.props.restaurantActions.addRestaurant(restaurant, params);
        }}
      >
        <Form className="mt-3">
          {/* Restaurant name here */}
          <FormGroup>
            <Label for="name"> Name </Label>
            <Input
              type="text"
              name="name"
              id="name"
              placeholder="Restaurant name here"
              onChange={this.onChange}
            />
          </FormGroup>

          {/* Category Select form */}
          <Label for="category">Category</Label>
          {this.renderCategoryOptions(this.props.category.categories)}

          {/* Order */}
          <FormGroup>
            <Label for="order">Order</Label>
            <Input
              type="text"
              name="order"
              id="order"
              placeholder="Order"
              defaultValue={1}
              onChange={this.onChange}
            />
          </FormGroup>

          {/* Switch on/off restaurant */}
          <FormGroup>
            <Label for="is_open">Open/Closed</Label>
            <div>
              <Switch
                id="is_open"
                onClick={() => {
                  this.setState({ is_open: ~~!this.state.is_open });
                }}
                on={!!this.state.is_open}
              />
            </div>
          </FormGroup>

          {/* Image Upload form*/}
          <ImageUploader
            style={{
              position: 'relative',
              width: '100%',
              height: 'auto',
              minHeight: '300px',
              borderWidth: '2px',
              borderColor: 'rgb(102, 102, 102)',
              borderStyle: 'dashed',
              borderRadius: '5px'
            }}
            handleOnLoad={this.onLoad}
          />
        </Form>
      </ModalWrapper>
    );
  }
}

RestaurantAdd = withRouter(RestaurantAdd);

export default connect(
  state => ({
    category: {
      ...state.default.services.category
    }
  }),
  dispatch => ({
    restaurantActions: bindActionCreators({ addRestaurant }, dispatch),
    categoryActions: bindActionCreators({ getCategories }, dispatch)
  })
)(RestaurantAdd);
