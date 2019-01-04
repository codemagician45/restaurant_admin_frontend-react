import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Table, Button, UncontrolledCollapse, Input } from 'reactstrap';
import Swal from 'sweetalert2';
import { withRouter, Link } from 'react-router-dom';
// Import components
import ImageUploader from './../ImageUploader';

// Import Actions
import { deleteMenu } from 'services/menu/menuActions';
import { addItem } from 'services/item/itemActions';
import { getMenus } from 'services/menu/menuActions';

// Import Utility functions
import { errorMsg } from 'services/utils';

// Import Settings
import settings from 'config/settings';

class MenuTable extends React.Component {
  constructor(props) {
    super(props);
    this.submitData = [];

    this.renderMenuTable = this.renderMenuTable.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleOnLoad = this.handleOnLoad.bind(this);
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

  handleOnLoad(file, file_type, file_name, menuId) {
    console.log('menuID here');
    console.log(menuId);
    this.submitData[menuId] = {
      ...this.submitData[menuId],
      file,
      file_name,
      file_type
    };
  }

  handleAddItem(id) {
    const item = {
      ...this.submitData[id],
      menu_id: id
    };

    this.props.itemActions.addItem(item);
  }

  renderMenuItems(item) {
    return (
      <div className="row p-3" key={item.id}>
        <div className="col-md-4">{item.name}</div>
        <div className="col-md-4">
          {item.price / settings.INTEGER_PRECISION}
        </div>
      </div>
    );
  }

  renderMenuTable() {
    const { data, from } = this.props;

    const imageUploaderStyle = {
      position: 'relative',
      height: 'auto',
      minHeight: '50px',
      borderWidth: '2px',
      borderColor: 'rgb(102, 102, 102)',
      borderStyle: 'dashed',
      borderRadius: '5px'
    };

    if (data && data.length > 0) {
      return data.map((menu, index) => (
        <React.Fragment key={index}>
          <tr id={`toggle${index}`} key={menu.id}>
            <th scope="row"> {index + 1} </th>
            <th>
              <Link
                to={{
                  pathname: '/items',
                  search: `?menu=${menu.id}&page=1`
                }}
              >
                {menu.name}
              </Link>
            </th>
            <th>{menu.restaurant.name}</th>
            <th>{menu.order}</th>
            <th>
              <Button
                color="warning"
                onClick={() => {
                  this.handleEdit(menu.id);
                }}
              >
                <i className="fa fa-edit" />
              </Button>
              <Button
                color="danger"
                onClick={() => {
                  this.handleDelete(menu.id);
                }}
              >
                <i className="fa fa-trash" />
              </Button>
            </th>
          </tr>
          <tr>
            <th colSpan={4} style={{ padding: 0 }}>
              <UncontrolledCollapse toggler={`toggle${index}`} className="p-3">
                <Button
                  color="default"
                  onClick={() => this.handleAddItem(menu.id)}
                >
                  <i className="fa fa-plus"> Item</i>
                </Button>
                <div className="row p-3">
                  <div className="col-md-4">
                    <Input
                      type="text"
                      onChange={evt => {
                        this.submitData[menu.id] = {
                          ...this.submitData[menu.id],
                          name: evt.target.value
                        };
                      }}
                      placeholder="Name"
                    />
                  </div>
                  <div className="col-md-4">
                    <Input
                      type="text"
                      placeholder="Price"
                      onChange={evt => {
                        this.submitData[menu.id] = {
                          ...this.submitData[menu.id],
                          price:
                            parseFloat(evt.target.value) *
                            settings.INTEGER_PRECISION
                        };
                      }}
                    />
                  </div>
                  <div className="col-md-4">
                    <ImageUploader
                      menuId={menu.id}
                      style={imageUploaderStyle}
                      handleOnLoad={this.handleOnLoad}
                    />
                  </div>
                </div>
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
    itemActions: bindActionCreators({ addItem }, dispatch),
    menuActions: bindActionCreators({ deleteMenu }, dispatch)
  })
)(withRouter(MenuTable));
