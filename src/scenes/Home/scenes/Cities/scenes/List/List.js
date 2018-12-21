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
  UncontrolledCollapse
} from 'reactstrap';
import queryString from 'query-string';

// Import Components
import CityTable from './components/CityTable';
import { Pagination } from 'components';

// Import actions
import { getCities } from 'services/city/cityActions';

// Import Utility functions
import { errorMsg, updateSearchQueryInUrl } from 'services/utils';

class List extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activePage: 1 // Handle pagination active
    };

    this.filter = {};

    this.renderCities = this.renderCities.bind(this);
    this.handleAddClick = this.handleAddClick.bind(this);
    this.handleSelected = this.handleSelected.bind(this);
    this.renderPagination = this.renderPagination.bind(this);
    this.onFilterChange = this.onFilterChange.bind(this);
    this.handleSearchClick = this.handleSearchClick.bind(this);
  }

  componentDidMount() {
    // Parse query string and send endpoint call
    const params = queryString.parse(this.props.location.search);
    if (params.page) {
      this.setState({
        activePage: params.page
      });
    }
    this.props.cityActions.getCities(params);
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

        this.props.cityActions.getCities(params);
      }
    }
  }

  onFilterChange(e) {
    this.filter = {
      ...this.filter,
      [e.target.name]: e.target.value
    };
  }

  handleAddClick() {
    this.props.history.push('/cities/add');
  }

  handleSearchClick() {
    updateSearchQueryInUrl(this);
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

  renderCities() {
    if (this.props.cities) {
      const { data } = this.props.cities;

      if (data && data.length > 0) {
        return (
          <div>
            <CityTable
              data={data}
              from={this.props.cities.meta ? this.props.cities.meta.from : ''}
            />
          </div>
        );
      } else {
        return <div>No City Data to list</div>;
      }
    }
  }

  renderPagination() {
    if (
      this.props.cities &&
      this.props.cities.meta &&
      this.props.cities.data &&
      this.props.cities.data.length > 0
    ) {
      return (
        <Pagination
          totalItems={this.props.cities.meta.total}
          pageSize={parseInt(this.props.cities.meta.per_page)}
          onSelect={this.handleSelected}
          activePage={parseInt(this.state.activePage)}
        />
      );
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
      <div>
        <h1 className="text-center mb-5">Cities</h1>
        <div className="mb-3">
          {/* Action button */}
          <Button color="default" onClick={this.handleAddClick}>
            <i className="fa fa-plus" />
            &nbsp;Add city
          </Button>
          <Button id="toggler" color="warning">
            Open filter&nbsp;
            <i className="fa fa-filter" />
          </Button>
        </div>
        {/* Filter Box*/}
        <UncontrolledCollapse
          toggler="#toggler"
          className="col-md-8 col-sm-12 mt-5 mb-5"
        >
          <FormGroup>
            <Label>City</Label>
            <Input
              type="text"
              name="city_name"
              onChange={this.onFilterChange}
            />
          </FormGroup>
          <Button onClick={this.handleSearchClick}>
            <i className="fa fa-search" />
            Search
          </Button>
        </UncontrolledCollapse>
        <div className="d-flex flex-column">
          {/* Render city table */}
          {this.renderCities()}
          {/* Render table pagination */}
          {this.renderPagination()}
        </div>
      </div>
    );
  }
}

export default connect(
  state => ({
    ...state.default.services.city
  }),
  dispatch => ({
    cityActions: bindActionCreators({ getCities }, dispatch)
  })
)(List);
