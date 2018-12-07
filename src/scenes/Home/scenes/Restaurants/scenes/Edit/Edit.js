import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toastr } from 'react-redux-toastr';
import Swal from 'sweetalert2';
import Select from 'react-select';
// Import Components
import { Button, Form, FormGroup, Label, Input, ImageUploader } from 'components';

// Import Actions
import { updateRestaurant, getRestaurant, updateCurrentRestaurant} from "services/restaurant/restaurantActions";
import { getCategories } from 'services/category/categoryActions';
// Import Utility functions
import { errorMsg } from "services/utils";

// Import settings
import settings from 'config/settings';

class Edit extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      file: null,
      file_type: '',
      file_name: ''
    };

    this.onChange = this.onChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleOnLoad = this.handleOnLoad.bind(this);
    this.onCategoryChange = this.onCategoryChange.bind(this);
  }

  componentDidMount() {
    this.props.categoryActions.getCategories();
    this.props.restaurantActions.getRestaurant(this.props.match.params.id);
  }

  componentDidUpdate(prevProps) {
    if (this.props.category.error !== prevProps.category.error && this.props.category.error !== null) {
      let msg = errorMsg(this.props.category.error);
      toastr.error('Error', msg);
    }

    if (this.props.restaurant.error !== prevProps.restaurant.error && this.props.restaurant.error !== null) {
      let msg = errorMsg(this.props.restaurant.error);
      toastr.error('Error', msg);
    }

    if (this.props.restaurant.success !== prevProps.restaurant.success && this.props.restaurant.success === true) {
      toastr.success('Success', this.props.category.message);
    }
  }

  onChange(e) {
    let restaurant = this.props.restaurant.currentRestaurant;

    restaurant = {
      ...restaurant,
      [e.target.name]: e.target.value
    };
    this.props.restaurantActions.updateCurrentRestaurant(restaurant);
  }

  onCategoryChange(options) {
    let restaurant = this.props.restaurant.currentRestaurant;

    const categories = options.map((item) => {
      return {
        id: item.value,
        name: item.label
      }
    });

    restaurant = {
      ...restaurant,
      categories
    };

    this.props.restaurantActions.updateCurrentRestaurant(restaurant);
  }

  handleSubmit() {
    if (this.props.restaurant.currentRestaurant) {
      if(this.props.restaurant.currentRestaurant.name === '') {
        toastr.error('Error', 'Restaurant name can not be an empty value');
        return;
      }
    } else {
      toastr.error('Error', 'Something went wrong');
    }

    const category = this.props.restaurant.currentRestaurant.categories.map((item) => {
      return item.id
    });

    const restaurant = {
      name: this.props.restaurant.currentRestaurant.name,
      id: this.props.restaurant.currentRestaurant.id,
      file: this.state.file,
      file_type: this.state.file_type,
      file_name: this.state.file_name,
      category
    };

    this.props.restaurantActions.updateRestaurant(
      this.props.match.params.id,
      restaurant
    )
  }

  renderCategoryOptions(categories) {
    if (categories && categories.data) {
      const options = categories.data.map((category) => {
        return {
          value: category.id,
          label: category.name
        };
      });
      let optionValue = [];
      if (this.props.restaurant.currentRestaurant && this.props.restaurant.currentRestaurant.categories) {
        optionValue = this.props.restaurant.currentRestaurant.categories.map((item) => {
          return {
            value: item.id,
            label: item.name
          }
        })
      }

      return (
        <Select
          options={options}
          isMulti
          onChange={this.onCategoryChange}
          value = {optionValue}
        />
      )
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
      minHeight:'300px',
      borderWidth: '2px',
      borderColor:'rgb(102, 102, 102)',
      borderStyle: 'dashed',
      borderRadius: '5px'
    };

    if ( categoryLoading || restaurantLoading ) {
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
        <strong>Restaurant update</strong>
        <Form className="mt-3">
          <FormGroup>
            <Label for="name">Name</Label>
            <Input
              type="text"
              name="name"
              id="name"
              placeholder="Restaurant name here"
              onChange={ this.onChange }
              value={this.props.restaurant.currentRestaurant? this.props.restaurant.currentRestaurant.name:''}
            />
          </FormGroup>
          <Label for="category">Category</Label>

          {/* Category Select form*/}
          {this.renderCategoryOptions(this.props.category.categories)}

          {/* Image Upload form*/}
          <ImageUploader
            style = {imageUploaderStyle}
            handleOnLoad={this.handleOnLoad}
            image={this.props.restaurant.currentRestaurant?settings.BASE_URL + this.props.restaurant.currentRestaurant.image_url:''}
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
    )
  }
}

export default connect(
  (state) => ({
    restaurant: {
      ...state.default.services.restaurant
    },
    category: {
      ...state.default.services.category
    }
  }),
  (dispatch) => ({
    restaurantActions: bindActionCreators({
        updateRestaurant,
        getRestaurant,
        updateCurrentRestaurant
      }, dispatch),
      categoryActions: bindActionCreators({ getCategories }, dispatch)
    })
)(Edit);