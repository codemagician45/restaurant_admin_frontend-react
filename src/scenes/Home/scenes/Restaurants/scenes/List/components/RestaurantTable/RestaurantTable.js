import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Table, Button } from 'components';
import Swal from 'sweetalert2';
import { withRouter } from 'react-router-dom';

// Import Actions
import {deleteRestaurant} from "services/restaurant/restaurantActions";

class RestaurantTable extends React.Component {
  constructor(props) {
    super(props);

    this.renderRestaurantTable = this.renderRestaurantTable.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  handleEdit(id) {
    this.props.history.push(`/restaurants/${id}/edit`);
  }

  handleDelete(id) {
    Swal({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {
        this.props.restaurantActions.deleteRestaurant(id);
      }
    })
  }
  
  renderRestaurantTable() {
    const { data } = this.props;
    
    if (data && data.length > 0) {
      return data.map((restaurant, index) => {
        let categoryNameArray = [];
        if (restaurant.categories) {
          categoryNameArray = restaurant.categories.map((item) => {
            return item.name;
          })
        }

        const categories = categoryNameArray.join(', ');
        return (
        <tr key={restaurant.id}>
          <th scope="row"> {index + 1} </th>
          <th>{restaurant.name}</th>
          <th>{categories} </th>
          <th>
            <Button
              color="warning"
              onClick={() => {this.handleEdit(restaurant.id)}}
            >
              <i className="fa fa-edit"></i>
            </Button>
            <Button
              color="danger"
              onClick={() => {this.handleDelete(restaurant.id)}}
            >
              <i className="fa fa-trash"></i>
            </Button>
          </th>
        </tr>
      )});
    }
  }

  render() {
    if (this.props.data && this.props.data.length > 0) {
      return(
        <Table striped bordered responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>City</th>
              <th>Categories</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
          {this.renderRestaurantTable()}
          </tbody>
        </Table>
      )
    } else {
      return (
        <div></div>
      )
    }
  }
}

export default connect(
  null,
  (dispatch) => ({
    restaurantActions: bindActionCreators({ deleteRestaurant }, dispatch)
  })
)(withRouter(RestaurantTable));