import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Table, Button } from 'components';
import Swal from 'sweetalert2';
import { withRouter } from 'react-router-dom';

// Import Actions
import { deleteCategory } from 'services/category/categoryActions';

class CategoryTable extends React.Component {
  constructor(props) {
    super(props);

    this.renderCategoryTable = this.renderCategoryTable.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  handleEdit(id) {
    this.props.history.push(`/categories/${id}/edit`);        
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
    }).then((result) => {
      if (result.value) {
        console.log(id);
        this.props.categoryActions.deleteCategory(id);
      }
    })
  }

  renderCategoryTable() {
    const {data} = this.props;
    if (data && data.length > 0) {
      return data.map((category, index) => (
        <tr key={category.id}>
          <th scope="row"> {index + 1} </th>
          <th>{category.name}</th>
          <th>{category.city.name}</th>
          <th>
            <Button
              color="warning"
              onClick={() => {this.handleEdit(category.id)}}
            >
              <i className="fa fa-edit"></i>
            </Button>
            <Button
              color="danger"
              onClick={() => {this.handleDelete(category.id)}}
            >
              <i className="fa fa-trash"></i>
            </Button>
          </th>
        </tr>
      ));
    }
  }

  render() {
    if (this.props.data && this.props.data.length > 0) {
      return(
        <Table striped bordered responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>City</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {this.renderCategoryTable()}
          </tbody>
        </Table>
      )
    } else {
      return (
        <div></div>
      )
    }
  }
}

export default connect(
  null,
  (dispatch) => ({
    categoryActions: bindActionCreators({ deleteCategory }, dispatch)
  })
)(withRouter(CategoryTable));