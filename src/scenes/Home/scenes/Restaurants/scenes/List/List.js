import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toastr } from 'react-redux-toastr';
import Swal from 'sweetalert2';

// Import Components
import RestaurantTable from './components/RestaurantTable';
import { Button } from 'components';

// Import actions
import { getRestaurants } from 'services/restaurant/restaurantActions';

// Import utility functions
import { errorMsg } from 'services/utils';

class List extends React.Component {
  constructor(props) {
    super(props);
    this.renderRestaurants = this.renderRestaurants.bind(this);
    this.handleAddClick = this.handleAddClick.bind(this);
  }

  componentDidMount() {
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

  handleAddClick() {
    this.props.history.push('/restaurants/add');
  }

  renderRestaurants() {
    if (this.props.restaurants) {
      const { data } = this.props.restaurants;

      if (data && data.length > 0) {
        return <RestaurantTable data={data} />;
      } else {
        return <div>No restaurant data to list</div>;
      }
    }
  }

  render() {
    const { loading, message } = this.props;

    // if loading status show sweet alert
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
      <div className="d-flex flex-column">
        <Button
          color="primary"
          className="ml-auto mb-3"
          onClick={this.handleAddClick}
        >
          <i className="fa fa-plus" />
          Add
        </Button>
        {this.renderRestaurants()}
      </div>
    );
  }
}

export default connect(
  state => ({
    ...state.default.services.restaurant
  }),
  dispatch => ({
    restaurantActions: bindActionCreators(
      {
        getRestaurants
      },
      dispatch
    )
  })
)(List);
