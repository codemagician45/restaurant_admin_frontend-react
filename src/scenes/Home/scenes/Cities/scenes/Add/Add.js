import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toastr } from 'react-redux-toastr';
import Swal from 'sweetalert2';

// Import Components
import { Button, Form, FormGroup, Label, Input } from 'components';

// Import Actions
import { addCity } from 'services/city/cityActions';

// Import Utility functions
import { errorMsg } from 'services/utils';

class Add extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      name: ''
    }

    this.onChange = this.onChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleSubmit() {
    if (this.state.name === '') {
      toastr.error('Error', 'City name can not be an empty value...');
      return;
    }
    this.props.cityActions.addCity(this.state.name);
  }

  

  render() {
    const { loading, message } = this.props;
    
    if (loading) {
      Swal({
        title: 'Please wait...',
        text:message,
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
        <strong>City Add</strong>
        <Form className="mt-3">
          <FormGroup>
            <Label for="name">City</Label>
            <Input 
              type="text" 
              name="name" 
              id="name" 
              placeholder="City name here" 
              onChange={ this.onChange }
            />
          </FormGroup>
          <Button 
            color="primary"
            onClick={this.handleSubmit}
            className="float-right"
          >
            Submit
          </Button>
        </Form>
      </div>
    )
  }
};

export default connect(
  (state)=>({
    loading: state.default.services.city.loading,
    message: state.default.services.city.message,
    error: state.default.services.city.error,
    success: state.default.services.city.success
  }),
  (dispatch) => ({
    cityActions: bindActionCreators({ addCity }, dispatch)
  })
)(Add);