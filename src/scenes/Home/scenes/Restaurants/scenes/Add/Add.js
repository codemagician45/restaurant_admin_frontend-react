import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toastr } from 'react-redux-toastr';
import Swal from 'sweetalert2';
import Select from 'react-select';

// Import Components
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import Switch from 'react-toggle-switch';
import { ImageUploader } from 'components';

// Import Actions
import { addRestaurant } from 'services/restaurant/restaurantActions';
import { getCategories } from 'services/category/categoryActions';

// Import Utility functions
import { errorMsg } from 'services/utils';

class Add extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      file: null,
      order: 1,
      file_type: '',
      file_name: '',
      category: [],
      is_open: 1
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onCategoryChange = this.onCategoryChange.bind(this);
    this.handleOnLoad = this.handleOnLoad.bind(this);
  }

  componentDidMount() {
    this.props.categoryActions.getCategories();
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.category.error !== prevProps.category.error &&
      this.props.category.error !== null
    ) {
      let msg = errorMsg(this.props.category.error);
      toastr.error('Error', msg);
    }

    if (
      this.props.restaurant.error !== prevProps.restaurant.error &&
      this.props.restaurant.error !== null
    ) {
      let msg = errorMsg(this.props.restaurant.error);
      toastr.error('Error', msg);
    }

    if (
      this.props.restaurant.success !== prevProps.restaurant.success &&
      this.props.restaurant.success === true
    ) {
      toastr.success('Success', this.props.category.message);
    }
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  onCategoryChange(category) {
    this.setState({
      category
    });
  }

  handleSubmit() {
    if (this.state.name === '') {
      toastr.error('Error', 'Category name can not be an empty value');
      return;
    }

    const category = this.state.category.map(item => {
      return item.value;
    });

    const restaurant = {
      name: this.state.name,
      file: this.state.file,
      order: this.state.order,
      is_open: this.state.is_open,
      file_type: this.state.file_type,
      file_name: this.state.file_name,
      category
    };

    this.props.restaurantActions.addRestaurant(restaurant);
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

  handleOnLoad(file, file_type, file_name) {
    this.setState({
      file,
      file_type,
      file_name
    });
  }

  render() {
    const { categoryLoading, categoryMessage } = this.props.category;
    const { restaurantLoading, restaurantMessage } = this.props.restaurant;

    const imageUploaderStyle = {
      position: 'relative',
      marginTop: '1.0rem',
      width: '60%',
      height: 'auto',
      minHeight: '300px',
      borderWidth: '2px',
      borderColor: 'rgb(102, 102, 102)',
      borderStyle: 'dashed',
      borderRadius: '5px'
    };

    if (categoryLoading || restaurantLoading) {
      Swal({
        title: 'Please wait...',
        text: categoryMessage + '\n' + restaurantMessage,
        onOpen: () => {
          Swal.showLoading();
        },
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false
      });
    } else {
      Swal.close();
    }

    return (
      <div>
        <strong>Restaurant add</strong>
        <Form className="mt-3">
          <FormGroup>
            <Label for="name">Name</Label>
            <Input
              type="text"
              name="name"
              id="name"
              placeholder="Restaurant name here"
              onChange={this.onChange}
            />
          </FormGroup>
          <Label for="category">Category</Label>

          {/* Category Select form*/}
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

          {/* is_open */}
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
            style={imageUploaderStyle}
            handleOnLoad={this.handleOnLoad}
          />

          <Button
            color="primary"
            onClick={this.handleSubmit}
            className="float-right"
          >
            Submit
          </Button>
        </Form>
      </div>
    );
  }
}

export default connect(
  state => ({
    restaurant: {
      ...state.default.services.restaurant
    },
    category: {
      ...state.default.services.category
    }
  }),
  dispatch => ({
    restaurantActions: bindActionCreators({ addRestaurant }, dispatch),
    categoryActions: bindActionCreators({ getCategories }, dispatch)
  })
)(Add);
