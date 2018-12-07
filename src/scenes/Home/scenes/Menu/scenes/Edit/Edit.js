import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toastr } from 'react-redux-toastr';
import Swal from 'sweetalert2';

// Import Components
import { Button, Form, FormGroup, Label, Input } from 'components';

// Import Actions
import { updateMenu, getMenu, updateCurrentMenu } from 'services/menu/menuActions';

// Import Utility functions
import { errorMsg, getBase64 } from 'services/utils';

class Edit extends React.Component {
  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.props.menuActions.getMenu(this.props.match.params.id);
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
    let menu = this.props.currentMenu;
    menu = {
      ...menu,
      [e.target.name]: e.target.value
    };
    this.props.menuActions.updateCurrentMenu(menu);
  }

  handleSubmit() {
    if (this.props.currentMenu) {
      if(this.props.currentMenu.name === '') {
        toastr.error('Error', 'Menu name can not be an empty value');
        return;
      }
    } else {
      toastr.error('Error', 'Something went wrong');
    }

    let menu = {
      name: this.props.currentMenu?this.props.currentMenu.name: '',
    };

    this.props.menuActions.updateMenu(
      this.props.match.params.id,
      menu
    );
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
        <strong>Menu update</strong>
        <Form className="mt-3">
          <FormGroup>
            <Label for="name">City</Label>
            <Input
              type="text"
              name="name"
              id="name"
              placeholder="Menu name here"
              value={this.props.currentMenu?this.props.currentMenu.name:''}
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
}

export default connect(
  (state) => ({
    ...state.default.services.menu
  }),
  (dispatch) => ({
    menuActions: bindActionCreators({ getMenu, updateMenu, updateCurrentMenu }, dispatch)
  })
)(Edit);