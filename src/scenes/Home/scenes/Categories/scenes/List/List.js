import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toastr } from 'react-redux-toastr';
import Swal from 'sweetalert2';
import PaginationComponent from 'react-reactstrap-pagination/dist/PaginationComponent';

// Import Components
import CategoryTable from './components/CategoryTable';
import { Button } from 'reactstrap';

// Import actions
import { getCategories } from 'services/category/categoryActions';

// Import Utility functions
import { errorMsg } from 'services/utils';

class List extends React.Component {
  constructor(props) {
    super(props);

    this.renderCategories = this.renderCategories.bind(this);
    this.handleAddClick = this.handleAddClick.bind(this);
    this.handleSelected = this.handleSelected.bind(this);
    this.renderPagination = this.renderPagination.bind(this);
  }

  componentDidMount() {
    this.props.categoryActions.getCategories(1, 5);
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
    this.props.history.push('/categories/add');
  }

  handleSelected(selectedPage) {
    this.props.categoryActions.getCategories(selectedPage, 5);
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
    if (this.props.categories && this.props.categories.meta) {
      return (
        <PaginationComponent
          totalItems={this.props.categories.meta.total}
          pageSize={parseInt(this.props.categories.meta.per_page)}
          onSelect={this.handleSelected}
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
      <div className="d-flex flex-column">
        <Button
          color="primary"
          className="ml-auto mb-3"
          onClick={this.handleAddClick}
        >
          <i className="fa fa-plus" />
          Add
        </Button>
        {/* Render categories table */}
        {this.renderCategories()}
        {/* Render pagination */}
        {this.renderPagination()}
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
