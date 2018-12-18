import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toastr } from 'react-redux-toastr';
import Swal from 'sweetalert2';
import PaginationComponent from 'react-reactstrap-pagination/dist/PaginationComponent';

// Import Components
import MenuTable from './components/MenuTable';
import { Button } from 'reactstrap';

// Import Actions
import { getMenus } from 'services/menu/menuActions';

// Import Utility functions
import { errorMsg } from 'services/utils';

class List extends React.Component {
  constructor(props) {
    super(props);
    this.renderMenus = this.renderMenus.bind(this);
    this.handleAddClick = this.handleAddClick.bind(this);
    this.handleSelected = this.handleSelected.bind(this);
    this.renderPagination = this.renderPagination.bind(this);
  }

  componentWillMount() {
    // Dispatch GET_CITIES action to generate cities list
    this.props.menuActions.getMenus(1, 5);
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
    this.props.history.push('/menus/add');
  }

  handleSelected(selectedPage) {
    this.props.menuActions.getMenus(selectedPage, 5);
  }

  renderMenus() {
    if (this.props.menus) {
      const { data } = this.props.menus;

      if (data && data.length > 0) {
        return (
          <MenuTable
            data={data}
            from={this.props.menus.meta ? this.props.menus.meta.from : ''}
          />
        );
      } else {
        return <div>No Menu data to list</div>;
      }
    }
  }

  renderPagination() {
    if (
      this.props.menus &&
      this.props.menus.meta &&
      this.props.menus.data &&
      this.props.menus.data.length > 0
    ) {
      return (
        <PaginationComponent
          totalItems={this.props.menus.meta.total}
          pageSize={parseInt(this.props.menus.meta.per_page)}
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
        {/* Render menu table */}
        {this.renderMenus()}
        {/* Render pagination */}
        {this.renderPagination()}
      </div>
    );
  }
}

export default connect(
  state => ({
    ...state.default.services.menu
  }),
  dispatch => ({
    menuActions: bindActionCreators({ getMenus }, dispatch)
  })
)(List);
