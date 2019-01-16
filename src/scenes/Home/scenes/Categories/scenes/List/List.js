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
  UncontrolledCollapse,
  Card,
  CardImg,
  CardTitle,
  CardImgOverlay
} from 'reactstrap';

// Import Components
import CategoryTable from './components/CategoryTable';
import { Pagination } from 'components';

// Import actions
import {
  getCategories,
  deleteCategory
} from 'services/category/categoryActions';

// Import Utility functions
import { errorMsg, updateSearchQueryInUrl } from 'services/utils';

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

    this.filter = {};

    this.renderCategoriesTable = this.renderCategoriesTable.bind(this);
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

  handleViewModeChange(viewMode) {
    this.setState({
      viewMode
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

  /// Handle edit button click event
  handleEdit(id) {
    this.props.history.push(`/categories/${id}/edit`);
  }

  /// Handle delete button click event
  handleDelete(id) {
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
        this.props.categoryActions.deleteCategory(id);
      }
    });
  }

  renderCategoriesTable() {
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

  renderCategoriesTile() {
    if (this.props.categories) {
      const { data } = this.props.categories;

      if (data && data.length > 0) {
        return data.map((category, index) => (
          <div
            key={index}
            className="col-sm-3 col-xs-12 mb-3 d-flex align-items-stretch"
            onClick={() => {
              this.props.history.push(`/restaurants?category=${category.id}`);
            }}
          >
            <Card className="text-center">
              <CardImg
                top
                width="100%"
                className="h-100"
                src={settings.BASE_URL + category.image_url}
                alt={category.name}
              />
              <CardImgOverlay>
                <CardTitle className="tile-view-card-title">
                  {category.name}
                </CardTitle>
                <div className="card-buttons-hover-show">
                  <Button
                    size="sm"
                    color="warning"
                    onClick={() => {
                      this.handleEdit(category.id);
                    }}
                  >
                    <i className="fa fa-edit" />
                  </Button>
                  <Button
                    size="sm"
                    color="danger"
                    onClick={() => {
                      this.handleDelete(category.id);
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

  renderFilter() {
    return (
      <div>
        {/* Action button */}
        <Button color="default" onClick={this.handleAddClick}>
          <i className="fa fa-plus" />
          &nbsp;Add category
        </Button>
        <Button id="toggle_category" color="warning">
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
          toggler="#toggle_category"
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
        <h1 className="text-center mb-5">Categories</h1>
        <div className="mb-3">
          {/* Render category filter section */}
          {this.renderFilter()}
        </div>

        {/* Table */}
        <div className="d-flex flex-column">
          {/* Render categories table */}
          {this.state.viewMode === VIEW_MODE_TABLE ? (
            this.renderCategoriesTable()
          ) : (
            <div className="row">{this.renderCategoriesTile()}</div>
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
    ...state.default.services.category
  }),
  dispatch => ({
    categoryActions: bindActionCreators(
      { getCategories, deleteCategory },
      dispatch
    )
  })
)(List);
