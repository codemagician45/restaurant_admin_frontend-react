import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toastr } from 'react-redux-toastr';
import Swal from 'sweetalert2';

// Import Components
import { Button, Form, FormGroup, Label, Input } from 'components';

// Import Actions
import { addItem } from 'services/item/itemActions';

// Import Utility functions
import { errorMsg } from 'services/utils';

class Add extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      price: 0
    }
  }
  render() {
    return (
      <div>
        Add scene here
      </div>
    )
  }
}

export default Add;