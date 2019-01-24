import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toastr } from 'react-redux-toastr';
import Swal from 'sweetalert2';

// Import Components
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';

// Import Actions
import { addMenu } from 'services/menu/menuActions';
import { getRestaurants } from 'services/restaurant/restaurantActions';

// Import Utility functions
import { errorMsg } from 'services/utils';

class Add extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      restaurant_id: '',
      order: 1,
      file: null,
      file_type: '',
      file_name: ''
    };

    this.onChange = this.onChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleOnLoad = this.handleOnLoad.bind(this);
  }

  componentDidMount() {
    this.props.restaurantActions.getRestaurants();
  }

  componentDidUpdate(prevProps) {
    if (this.props.error !== prevProps.error && this.props.error !== null) {
      let msg = errorMsg(this.props.error);
      toastr.error(msg.title, msg.message);
    }

    if (
      this.props.success !== prevProps.success &&
      this.props.success === true
    ) {
      toastr.success('Success', this.props.message);
    }

    if (
      this.props.restaurant !== prevProps.restaurant &&
      this.props.restaurant.restaurants
    ) {
      if (this.props.restaurant.restaurants.data) {
        this.setState({
          restaurant_id: this.props.restaurant.restaurants.data[0].id
        });
      }
    }
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleOnLoad(file, file_type, file_name) {
    this.setState({
      file,
      file_type,
      file_name
    });
  }

  handleSubmit() {
    if (this.state.name === '') {
      toastr.error('Error', 'City name can not be an empty value...');
      return;
    }

    let menu = {
      name: this.state.name,
      restaurant_id: this.state.restaurant_id,
      order: this.state.order,
      file: this.state.file,
      file_type: this.state.file_type,
      file_name: this.state.file_name
    };

    this.props.menuActions.addMenu(menu);
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
        <strong>Menu add</strong>
        <Form className="mt-3">
          <FormGroup>
            <Label for="name">Name</Label>
            <Input
              type="text"
              name="name"
              id="name"
              placeholder="Menu name here"
              onChange={this.onChange}
            />
          </FormGroup>
          <FormGroup>
            <Label for="Restaurant" />
            <Input
              type="select"
              name="restaurant_id"
              id="restaurant_id"
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
              onChange={this.onChange}
            />
          </FormGroup>
          <FormGroup>
            {/*<ImageUploader
              style={imageUploaderStyle}
              handleOnLoad={this.handleOnLoad}
            />*/}
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
    menuActions: bindActionCreators({ addMenu }, dispatch),
    restaurantActions: bindActionCreators({ getRestaurants }, dispatch)
  })
)(Add);
