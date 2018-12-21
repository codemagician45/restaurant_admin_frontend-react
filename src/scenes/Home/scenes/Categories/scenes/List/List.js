import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toastr } from 'react-redux-toastr';
import Swal from 'sweetalert2';
import queryString from 'query-string';
import {
  Button,
  FormGroup,
  Label,
  Input,
  UncontrolledCollapse
} from 'reactstrap';

// Import Components
import CategoryTable from './components/CategoryTable';
import { Pagination } from 'components';

// Import actions
import { getCategories } from 'services/category/categoryActions';

// Import Utility functions
import { errorMsg, updateSearchQueryInUrl } from 'services/utils';

class List extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activePage: 1
    };

    this.filter = {};

    this.renderCategories = this.renderCategories.bind(this);
    this.handleAddClick = this.handleAddClick.bind(this);
    this.handleSelected = this.handleSelected.bind(this);
    this.renderPagination = this.renderPagination.bind(this);
    this.onFilterChange = this.onFilterChange.bind(this);
    this.handleSearchClick = this.handleSearchClick.bind(this);
  }

  componentDidMount() {
    // Parse query string and send async api call
    const params = queryString.parse(this.props.location.search);
    if (params.page) {
      this.setState({
        activePage: params.page
      });
    }
    this.props.categoryActions.getCategories(params);
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
      this.props.categoryActions.getCategories(params);
    }
  }

  onFilterChange(e) {
    this.filter = {
      ...this.filter,
      [e.target.name]: e.target.value
    };
  }

  handleAddClick() {
    this.props.history.push('/categories/add');
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

  renderCategories() {
    if (this.props.categories) {
      const { data } = this.props.categories;

      if (data && data.length > 0) {
        return (
          <CategoryTable
            data={data}
            from={
              this.props.categories.meta ? this.props.categories.meta.from : ''
            }
          />
        );
      } else {
        return <div>No Categories Data to list</div>;
      }
    }
  }

  renderPagination() {
    if (
      this.props.categories &&
      this.props.categories.meta &&
      this.props.categories.data &&
      this.props.categories.data.length > 0
    ) {
      return (
        <Pagination
          totalItems={this.props.categories.meta.total}
          pageSize={parseInt(this.props.categories.meta.per_page)}
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
        <h1 className="text-center mb-5">Categories</h1>
        <div className="mb-3">
          {/* Action button */}
          <Button color="default" onClick={this.handleAddClick}>
            <i className="fa fa-plus" />
            &nbsp;Add category
          </Button>
          <Button id="toggler" color="warning">
            Open filter&nbsp;
            <i className="fa fa-filter" />
          </Button>
        </div>
        {/* Filter Box */}
        <UncontrolledCollapse
          toggler="#toggler"
          className="col-md-8 col-sm-12 mt-5 mb-5"
        >
          <FormGroup>
            <Label>Category name</Label>
            <Input
              type="text"
              name="category_name"
              onChange={this.onFilterChange}
            />
          </FormGroup>
          <Button onClick={this.handleSearchClick}>
            <i className="fa fa-search" />
            Search
          </Button>
        </UncontrolledCollapse>
        {/* Table */}
        <div className="d-flex flex-column">
          {/* Render categories table */}
          {this.renderCategories()}
          {/* Render pagination */}
          {this.renderPagination()}
        </div>
      </div>
    );
  }
}

export default connect(
  state => ({
    ...state.default.services.category
  }),
  dispatch => ({
    categoryActions: bindActionCreators({ getCategories }, dispatch)
  })
)(List);
