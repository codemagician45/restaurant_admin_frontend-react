import React from 'react';
import { connect } from 'react-redux';

// Import Modals
import AddCity from './components/AddCity';
import EditCity from './components/EditCity';

const ModalConductor = props => {
  switch (props.modal.modalType) {
    case 'ADD_CITY_MODAL':
      return <AddCity {...props} />;
    case 'EDIT_CITY_MODAL':
      return <EditCity {...props} />;
    default:
      return null;
  }
};

export default connect(
  state => ({
    modal: {
      ...state.default.modal
    }
  }),
  null
)(ModalConductor);
