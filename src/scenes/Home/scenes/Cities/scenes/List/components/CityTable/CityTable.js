import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Table, Button } from 'reactstrap';
import Swal from 'sweetalert2';
import { withRouter, Link } from 'react-router-dom';

// Import Actions
import { deleteCity } from 'services/city/cityActions';

class CityTable extends React.Component {
  constructor(props) {
    super(props);

    this.renderCityTable = this.renderCityTable.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  handleEdit(id) {
    this.props.history.push(`/cities/${id}/edit`);
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
        this.props.cityActions.deleteCity(id);
      }
    });
  }

  renderCityTable() {
    const { data } = this.props;
    if (data && data.length > 0) {
      return data.map((city, index) => (
        <tr key={city.id}>
          <th scope="row"> {index + 1} </th>
          <th>
            <Link
              to={{
                pathname: '/restaurants',
                search: `?city=${city.id}`
              }}
            >
              {city.name}
            </Link>
          </th>
          <th>{city.is_open ? 'Opened' : 'Closed'}</th>
          <th>{city.order}</th>
          <th>
            <Button
              color="warning"
              onClick={() => {
                this.handleEdit(city.id);
              }}
            >
              <i className="fa fa-edit" />
            </Button>
            <Button
              color="danger"
              onClick={() => {
                this.handleDelete(city.id);
              }}
            >
              <i className="fa fa-trash" />
            </Button>
          </th>
        </tr>
      ));
    }
  }

  render() {
    if (this.props.data && this.props.data.length > 0) {
      return (
        <Table striped bordered responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>City</th>
              <th>Open</th>
              <th>Order</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>{this.renderCityTable()}</tbody>
        </Table>
      );
    } else {
      return <div />;
    }
  }
}

export default connect(
  null,
  dispatch => ({
    cityActions: bindActionCreators({ deleteCity }, dispatch)
  })
)(withRouter(CityTable));
