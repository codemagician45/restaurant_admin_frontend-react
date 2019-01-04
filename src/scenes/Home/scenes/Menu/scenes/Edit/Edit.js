import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toastr } from 'react-redux-toastr';
import Swal from 'sweetalert2';

// Import Components
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';

import { ImageUploader } from 'components';

// Import Actions
import {
  updateMenu,
  getMenu,
  updateCurrentMenu
} from 'services/menu/menuActions';
import { getRestaurants } from 'services/restaurant/restaurantActions';

// Import Utility functions
import { errorMsg, getBase64 } from 'services/utils';

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
  }

  componentDidMount() {
    this.props.menuActions.getMenu(this.props.match.params.id);
    this.props.restaurantActions.getRestaurants();
  }

  componentDidUpdate(prevProps) {
    if (this.props.error !== prevProps.error && this.props.error !== null) {
      let msg = errorMsg(this.props.error);
      toastr.error('Error', msg);
    }

    if (
      this.props.success !== prevProps.success &&
      this.props.success === true
    ) {
      toastr.success('Success', this.props.message);
    }
  }

  onChange(e) {
    let menu = this.props.currentMenu;

    switch (e.target.name) {
      case 'restaurant':
        const restaurants = this.props.restaurant.restaurants.data;
        console.log(restaurants);
        const restaurant = restaurants.find(function(element) {
          return element.id == e.target.value;
        });

        menu = {
          ...menu,
          restaurant
        };
        break;
      default:
        menu = {
          ...menu,
          [e.target.name]: e.target.value
        };
        break;
    }
    this.props.menuActions.updateCurrentMenu(menu);
  }

  handleOnLoad(file, file_type, file_name) {
    this.setState({
      file,
      file_type,
      file_name
    });
  }

  handleSubmit() {
    if (this.props.currentMenu) {
      if (this.props.currentMenu.name === '') {
        toastr.error('Error', 'Menu name can not be an empty value');
        return;
      }
    } else {
      toastr.error('Error', 'Something went wrong');
    }

    let menu = {
      name: this.props.currentMenu.name,
      id: this.props.currentMenu.id,
      restaurant_id: this.props.currentMenu.restaurant.id,
      order: this.props.currentMenu.order,
      file: this.state.file,
      file_type: this.state.file_type,
      file_name: this.state.file_name
    };

    this.props.menuActions.updateMenu(this.props.match.params.id, menu);
  }

  renderRestaurantOptions(restaurants) {
    if (restaurants !== null) {
      return restaurants.data.map((restaurant, index) => (
        <option key={index} value={restaurant.id}>
          {restaurant.name}
        </option>
      ));
    }
  }

  render() {
    const { loading, message } = this.props;

    const imageUploaderStyle = {
      position: 'relative',
      width: '60%',
      height: 'auto',
      minHeight: '300px',
      borderWidth: '2px',
      borderColor: 'rgb(102, 102, 102)',
      borderStyle: 'dashed',
      borderRadius: '5px'
    };

    if (loading) {
      Swal({
        title: 'Please wait...',
        text: message,
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
        <strong>Menu update</strong>
        <Form className="mt-3">
          <FormGroup>
            <Label for="name">City</Label>
            <Input
              type="text"
              name="name"
              id="name"
              placeholder="Menu name here"
              value={this.props.currentMenu ? this.props.currentMenu.name : ''}
              onChange={this.onChange}
            />
          </FormGroup>
          <FormGroup>
            <Label for="restaurant">Restaurant</Label>
            <Input
              type="select"
              name="restaurant"
              id="restaurant"
              value={
                this.props.currentMenu
                  ? this.props.currentMenu.restaurant.id
                  : ''
              }
              onChange={this.onChange}
            >
              {this.renderRestaurantOptions(this.props.restaurant.restaurants)}
            </Input>
          </FormGroup>
          <FormGroup>
            <Label for="order">Order</Label>
            <Input
              type="text"
              name="order"
              id="order"
              placeholder="Order"
              value={this.props.currentMenu ? this.props.currentMenu.order : ''}
              onChange={this.onChange}
            />
          </FormGroup>
          <FormGroup>
            {/*
            <Label>Image</Label>
            <ImageUploader
              style={imageUploaderStyle}
              handleOnLoad={this.handleOnLoad}
              image={
                this.props.currentMenu
                  ? settings.BASE_URL + this.props.currentMenu.image_url
                  : ''
              }
            />
            */}
          </FormGroup>
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
    ...state.default.services.menu,
    restaurant: state.default.services.restaurant
  }),
  dispatch => ({
    menuActions: bindActionCreators(
      { getMenu, updateMenu, updateCurrentMenu },
      dispatch
    ),
    restaurantActions: bindActionCreators({ getRestaurants }, dispatch)
  })
)(Edit);
