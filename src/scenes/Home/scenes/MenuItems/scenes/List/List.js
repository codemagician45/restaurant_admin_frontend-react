import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toastr } from 'react-redux-toastr';
import Swal from 'sweetalert2';

// Import Components
import MenuItemTable from './components/MenuItemTable';
import { Button } from 'components';

// Import Actions
import { getItems } from 'services/item/itemActions';

// Import Utility functions
import { errorMsg } from 'services/utils';

class List extends React.Component {
  constructor(props) {
    super(props);

    this.handleAddClick = this.handleAddClick.bind(this);
    this.renderItems = this.renderItems.bind(this);
  }
  componentWillMount() {
    this.props.itemActions.getItems();
  }

  componentDidUpdate(prevProps) {
    if (this.props.error !== prevProps.error && this.props.error !== null) {
      let msg = errorMsg(this.props.error);
      toastr.error('Error', msg);
    }

    if (this.props.success !== prevProps.success && this.props.success === true) {
      toastr.success('Success', this.props.message);
    }
  }

  handleAddClick() {
    this.props.history.push('/items/add');
  }

  renderItems() {
    if (this.props.items) {
      const { data } = this.props.items;

      if (data && data.length > 0) {
        return (
          <MenuItemTable data={data}/>
        )
      } else {
        return (
          <div>
            No Menu data to list
          </div>
        )
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
        {this.renderItems()}
      </div>
    )
  }
}

export default connect(
  (state) => ({
    ...state.default.services.item
  }),
  (dispatch) => ({
    itemActions: bindActionCreators({ getItems }, dispatch)
  })
)(List);