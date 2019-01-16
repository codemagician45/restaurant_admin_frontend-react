import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toastr } from 'react-redux-toastr';
import Swal from 'sweetalert2';
import {
  Button,
  FormGroup,
  Label,
  Input,
  UncontrolledCollapse,
  Card,
  CardImg,
  CardTitle,
  CardImgOverlay
} from 'reactstrap';

// Import Components
import RestaurantTable from './components/RestaurantTable';
import { Pagination } from 'components';

// Import actions
import {
  getRestaurants,
  deleteRestaurant
} from 'services/restaurant/restaurantActions';

// Import utility functions
import { errorMsg, updateSearchQueryInUrl } from 'services/utils';
import queryString from 'query-string';

// Import settings
import settings from 'config/settings';

const VIEW_MODE_TILE = 'VIEW_MODE_TILE';
const VIEW_MODE_TABLE = 'VIEW_MODE_TABLE';

class List extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activePage: 1,
      viewMode: VIEW_MODE_TILE
    };

    this.renderRestaurantsTable = this.renderRestaurantsTable.bind(this);
    this.handleAddClick = this.handleAddClick.bind(this);
    this.handleSelected = this.handleSelected.bind(this);
    this.renderPagination = this.renderPagination.bind(this);
    this.onFilterChange = this.onFilterChange.bind(this);
    this.handleSearchClick = this.handleSearchClick.bind(this);
    this.handleViewModeChange = this.handleViewModeChange.bind(this);
    this.renderFilter = this.renderFilter.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  componentDidMount() {
    // Parse query string and send async api call
    const params = queryString.parse(this.props.location.search);
    if (params.page) {
      this.setState({
        activePage: params.page
      });
    }
    this.props.restaurantActions.getRestaurants(params);
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

    // If query param is changed
    if (prevProps.location.search !== this.props.location.search) {
      const params = queryString.parse(this.props.location.search);
      if (params.page) {
        this.setState({
          activePage: params.page
        });
      }
      this.props.restaurantActions.getRestaurants(params);
    }
  }

  onFilterChange(e) {
    this.filter = {
      ...this.filter,
      [e.target.name]: e.target.value
    };
  }

  handleAddClick() {
    this.props.history.push('/restaurants/add');
  }

  handleSearchClick() {
    updateSearchQueryInUrl(this);
  }

  handleViewModeChange(viewMode) {
    this.setState({
      viewMode
    });
  }

  handleEdit(id, e) {
    e.stopPropagation();
    this.props.history.push(`/restaurants/${id}/edit`);
  }

  handleDelete(id, e) {
    e.stopPropagation();
    Swal({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(result => {
      if (result.value) {
        this.props.restaurantActions.deleteRestaurant(id);
      }
    });
  }

  handleSelected(selectedPage) {
    let values = queryString.parse(this.props.location.search);
    values = {
      ...values,
      page: selectedPage
    };

    const searchQuery = queryString.stringify(values);
    this.props.history.push({
      pathname: this.props.location.pathname,
      search: `?${searchQuery}`
    });
  }

  renderRestaurantsTable() {
    if (this.props.restaurants) {
      const { data } = this.props.restaurants;

      if (data && data.length > 0) {
        return (
          <RestaurantTable
            data={data}
            from={
              this.props.restaurants.meta
                ? this.props.restaurants.meta.from
                : ''
            }
          />
        );
      } else {
        return <div>No restaurant data to list</div>;
      }
    }
  }

  renderRestaurantsTile() {
    if (this.props.restaurants) {
      const { data } = this.props.restaurants;

      if (data && data.length > 0) {
        return data.map((restaurant, index) => (
          <div
            key={index}
            className="col-sm-3 col-xs-12 mb-3 d-flex align-items-stretch"
            onClick={() => {
              //this.props.history.push(`/menus?restaurant=${restaurant.id}`);
              window.location.href = `/menus?restaurant=${restaurant.id}`;
            }}
          >
            <Card className="text-center w-100">
              <CardImg
                top
                width="100%"
                className="h-100"
                src={settings.BASE_URL + restaurant.image_url}
                alt={restaurant.name}
              />
              <CardImgOverlay>
                <CardTitle className="tile-view-card-title">
                  {restaurant.name}
                </CardTitle>
                <div className="card-buttons-hover-show">
                  <Button
                    size="sm"
                    color="warning"
                    onClick={e => {
                      this.handleEdit(restaurant.id, e);
                    }}
                  >
                    <i className="fa fa-edit" />
                  </Button>
                  <Button
                    size="sm"
                    color="danger"
                    onClick={e => {
                      this.handleDelete(restaurant.id, e);
                    }}
                  >
                    <i className="fa fa-trash" />
                  </Button>
                </div>
              </CardImgOverlay>
            </Card>
          </div>
        ));
      } else {
        return <div>No restaurant data to list</div>;
      }
    }
  }

  renderPagination() {
    if (
      this.props.restaurants &&
      this.props.restaurants.meta &&
      this.props.restaurants.data &&
      this.props.restaurants.data.length > 0
    ) {
      return (
        <Pagination
          totalItems={this.props.restaurants.meta.total}
          pageSize={parseInt(this.props.restaurants.meta.per_page)}
          onSelect={this.handleSelected}
          activePage={parseInt(this.state.activePage)}
        />
      );
    }
  }

  renderFilter() {
    return (
      <div>
        {/* Action button */}
        <Button color="default" onClick={this.handleAddClick}>
          <i className="fa fa-plus" />
          &nbsp;Add restaurant
        </Button>
        <Button id="toggle_restaurant" color="warning">
          Open filter&nbsp;
          <i className="fa fa-filter" />
        </Button>
        <Button onClick={() => this.handleViewModeChange(VIEW_MODE_TILE)}>
          <i className="fa fa-th" />
        </Button>
        <Button onClick={() => this.handleViewModeChange(VIEW_MODE_TABLE)}>
          <i className="fa fa-th-list" />
        </Button>
        <UncontrolledCollapse
          toggler="#toggle_restaurant"
          className="col-md-8 col-sm-12 mt-5 mb-5"
        >
          <FormGroup>
            <Label>Restaurant</Label>
            <Input
              type="text"
              name="restaurant_name"
              onChange={this.onFilterChange}
            />
          </FormGroup>
          <Button onClick={this.handleSearchClick}>
            <i className="fa fa-search" />
            Search
          </Button>
        </UncontrolledCollapse>
      </div>
    );
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
      <div>
        <h1 className="text-center mb-5">Restaurants</h1>
        <div className="mb-3">{this.renderFilter()}</div>
        <div className="d-flex flex-column">
          {/* Render restaurants table */}
          {this.state.viewMode === VIEW_MODE_TABLE ? (
            this.renderRestaurantsTable()
          ) : (
            <div className="row">{this.renderRestaurantsTile()}</div>
          )}

          {/* Render pagination */}
          {this.renderPagination()}
        </div>
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
        getRestaurants,
        deleteRestaurant
      },
      dispatch
    )
  })
)(List);
