import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toastr } from 'react-redux-toastr';
import Swal from 'sweetalert2';
import { Button } from 'reactstrap';
import PaginationComponent from 'react-reactstrap-pagination/dist/PaginationComponent';

// Import Components
import CityTable from './components/CityTable';

// Import actions
import { getCities } from 'services/city/cityActions';

// Import Utility functions
import { errorMsg } from 'services/utils';

class List extends React.Component {
  constructor(props) {
    super(props);

    this.renderCities = this.renderCities.bind(this);
    this.handleAddClick = this.handleAddClick.bind(this);
    this.handleSelected = this.handleSelected.bind(this);
    this.renderPagination = this.renderPagination.bind(this);
  }

  componentWillMount() {
    // Dispatch GET_CITIES action to generate cities list
    this.props.cityActions.getCities(1, 5);
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
    this.props.history.push('/cities/add');
  }

  handleSelected(selectedPage) {
    this.props.cityActions.getCities(selectedPage, 5);
  }

  renderCities() {
    if (this.props.cities) {
      const { data } = this.props.cities;

      if (data && data.length > 0) {
        return (
          <div>
            <CityTable
              data={data}
              from={this.props.cities.meta ? this.props.cities.meta.from : ''}
            />
          </div>
        );
      } else {
        return <div>No City Data to list</div>;
      }
    }
  }

  renderPagination() {
    if (this.props.cities && this.props.cities.meta) {
      return (
        <PaginationComponent
          totalItems={this.props.cities.meta.total}
          pageSize={parseInt(this.props.cities.meta.per_page)}
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
        {/* Render city table */}
        {this.renderCities()}
        {/* Render table pagination */}
        {this.renderPagination()}
      </div>
    );
  }
}

export default connect(
  state => ({
    ...state.default.services.city
  }),
  dispatch => ({
    cityActions: bindActionCreators({ getCities }, dispatch)
  })
)(List);
