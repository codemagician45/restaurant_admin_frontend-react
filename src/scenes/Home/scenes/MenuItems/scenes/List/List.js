import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toastr } from 'react-redux-toastr';
import Swal from 'sweetalert2';
import PaginationComponent from 'react-reactstrap-pagination/dist/PaginationComponent';

// Import Components
import MenuItemTable from './components/MenuItemTable';
import { Button } from 'reactstrap';

// Import Actions
import { getItems } from 'services/item/itemActions';

// Import Utility functions
import { errorMsg } from 'services/utils';

class List extends React.Component {
  constructor(props) {
    super(props);

    this.handleAddClick = this.handleAddClick.bind(this);
    this.renderItems = this.renderItems.bind(this);
    this.handleSelected = this.handleSelected.bind(this);
    this.renderPagination = this.renderPagination.bind(this);
  }
  componentWillMount() {
    this.props.itemActions.getItems(1, 5);
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
    this.props.history.push('/items/add');
  }

  handleSelected(selectedPage) {
    this.props.itemActions.getItems(selectedPage, 5);
  }

  renderItems() {
    if (this.props.items) {
      const { data } = this.props.items;

      if (data && data.length > 0) {
        return (
          <MenuItemTable
            data={data}
            from={this.props.items.meta ? this.props.items.meta.from : ''}
          />
        );
      } else {
        return <div>No Menu data to list</div>;
      }
    }
  }

  renderPagination() {
    if (
      this.props.items &&
      this.props.items.meta &&
      this.props.items.data &&
      this.props.items.data.length > 0
    ) {
      return (
        <PaginationComponent
          totalItems={this.props.items.meta.total}
          pageSize={parseInt(this.props.items.meta.per_page)}
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
        {/* Render Menu items table*/}
        {this.renderItems()}
        {/* Render pagination */}
        {this.renderPagination()}
      </div>
    );
  }
}

export default connect(
  state => ({
    ...state.default.services.item
  }),
  dispatch => ({
    itemActions: bindActionCreators({ getItems }, dispatch)
  })
)(List);
