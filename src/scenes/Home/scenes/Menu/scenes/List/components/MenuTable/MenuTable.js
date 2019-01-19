import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Table, Button, UncontrolledCollapse, Input } from 'reactstrap';
import Swal from 'sweetalert2';
import { withRouter } from 'react-router-dom';
// Import components
import ImageUploader from './../ImageUploader';

// Import Actions
import { deleteMenu } from 'services/menu/menuActions';
import { addItem, deleteItem, addItems } from 'services/item/itemActions';

// Import Settings
import settings from 'config/settings';
import queryString from 'query-string';

class MenuTable extends React.Component {
  constructor(props) {
    super(props);
    this.submitData = [];

    this.renderMenuTable = this.renderMenuTable.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleOnLoad = this.handleOnLoad.bind(this);
    this.handleEditMenuItem = this.handleEditMenuItem.bind(this);
    this.handleDeleteMenuItem = this.handleDeleteMenuItem.bind(this);
    this.renderSubmitItems = this.renderSubmitItems.bind(this);
    this.addMenuItemInput = this.addMenuItemInput.bind(this);
  }
  handleEdit(id) {
    this.props.history.push(`/menus/${id}/edit`);
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
    }).then(result => {
      if (result.value) {
        this.props.menuActions.deleteMenu(id);
      }
    });
  }

  handleOnLoad(file, file_type, file_name, menuId, inputItemIndex) {
    this.submitData[menuId][inputItemIndex] = {
      ...this.submitData[menuId][inputItemIndex],
      file,
      file_name,
      file_type
    };
  }

  handleMenuItemSubmit(id) {
    const items = this.submitData[id];

    const params = queryString.parse(this.props.location.search);

    this.props.itemActions.addItems(items, params);
  }

  /// Handle edit button click event
  handleEditMenuItem(id, e) {
    e.stopPropagation();
    console.log('handle edit item');
    this.props.history.push(`/items/${id}/edit`);
  }

  /// Handle delete button click event
  handleDeleteMenuItem(id, e) {
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
        this.props.itemActions.deleteItem(id);
      }
    });
  }

  renderMenuItems(item) {
    return (
      <div className="row p-3 border-bottom" key={item.id}>
        <div className="col-md-4">{item.name}</div>
        <div className="col-md-4">
          {item.price / settings.INTEGER_PRECISION}
        </div>
        <div className="col-md-4">
          <Button
            size="sm"
            color="warning"
            onClick={e => {
              this.handleEditMenuItem(item.id, e);
            }}
          >
            <i className="fa fa-edit" />
          </Button>
          <Button
            size="sm"
            color="danger"
            onClick={e => {
              this.handleDeleteMenuItem(item.id, e);
            }}
          >
            <i className="fa fa-trash" />
          </Button>
        </div>
      </div>
    );
  }

  addMenuItemInput(menuId) {
    if (this.submitData[menuId]) {
    } else {
      this.submitData[menuId] = [];
    }

    let defaultItem = {
      order: 1,
      menu_id: menuId
    };

    this.submitData[menuId].push(defaultItem);
    this.forceUpdate();
  }

  renderSubmitItems(menu) {
    const imageUploaderStyle = {
      position: 'relative',
      height: '50px',
      minHeight: '50px',
      maxHeight: '50px',
      borderWidth: '2px',
      borderColor: 'rgb(102, 102, 102)',
      borderStyle: 'dashed',
      borderRadius: '5px'
    };

    if (this.submitData[menu.id] && this.submitData[menu.id].length > 0) {
      // eslint-disable-next-line
      return this.submitData[menu.id].map((item, index) => (
        <div className="row p-3" key={index}>
          <div className="col-md-3">
            <Input
              type="text"
              onChange={evt => {
                this.submitData[menu.id][index] = {
                  ...this.submitData[menu.id][index],
                  name: evt.target.value
                };
              }}
              placeholder="Name"
            />
          </div>
          <div className="col-md-3">
            <Input
              type="text"
              placeholder="Price"
              onChange={evt => {
                this.submitData[menu.id][index] = {
                  ...this.submitData[menu.id][index],
                  price:
                    parseFloat(evt.target.value) * settings.INTEGER_PRECISION
                };
              }}
            />
          </div>
          <div className="col-md-3">
            <Input
              type="text"
              onChange={evt => {
                this.submitData[menu.id][index] = {
                  ...this.submitData[menu.id][index],
                  order: evt.target.value
                };
              }}
              defaultValue={1}
              placeholder="Name"
            />
          </div>
          <div className="col-md-3">
            <ImageUploader
              menuId={menu.id}
              inputItemIndex={index}
              style={imageUploaderStyle}
              handleOnLoad={this.handleOnLoad}
            />
          </div>
        </div>
      ));
    }
  }

  renderMenuTable() {
    const { data } = this.props;

    if (data && data.length > 0) {
      return data.map((menu, index) => (
        <React.Fragment key={index}>
          <tr id={`toggle_menu_${index}`} key={menu.id}>
            <th scope="row"> {index + 1} </th>
            <th>{menu.name}</th>
            <th>{menu.restaurant.name}</th>
            <th>{menu.order}</th>
            <th>
              <Button
                color="warning"
                onClick={e => {
                  this.handleEdit(menu.id, e);
                }}
              >
                <i className="fa fa-edit" />
              </Button>
              <Button
                color="danger"
                onClick={e => {
                  this.handleDelete(menu.id, e);
                }}
              >
                <i className="fa fa-trash" />
              </Button>
            </th>
          </tr>
          <tr>
            <th colSpan={4} style={{ padding: 0 }}>
              <UncontrolledCollapse
                toggler={`toggle_menu_${index}`}
                className="p-3"
              >
                <Button
                  color="default"
                  onClick={() => {
                    this.addMenuItemInput(menu.id);
                  }}
                >
                  <i className="fa fa-plus"> Item</i>
                </Button>
                <Button
                  color="primary"
                  onClick={e => this.handleMenuItemSubmit(menu.id, e)}
                >
                  <i className="fa fa-check"> Submit</i>
                </Button>
                {this.renderSubmitItems(menu)}
                {menu.items.map(item => this.renderMenuItems(item))}
              </UncontrolledCollapse>
            </th>
          </tr>
        </React.Fragment>
      ));
    }
  }

  render() {
    const { loading, message } = this.props;

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

    if (this.props.data && this.props.data.length > 0) {
      return (
        <Table striped bordered responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Restaurant</th>
              <th>Order</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>{this.renderMenuTable()}</tbody>
        </Table>
      );
    } else {
      return <div />;
    }
  }
}

export default connect(
  state => ({
    ...state.default.services.item
  }),
  dispatch => ({
    itemActions: bindActionCreators(
      { addItem, deleteItem, addItems },
      dispatch
    ),
    menuActions: bindActionCreators({ deleteMenu }, dispatch)
  })
)(withRouter(MenuTable));
