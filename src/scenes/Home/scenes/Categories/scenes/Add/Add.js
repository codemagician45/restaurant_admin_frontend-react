import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toastr } from 'react-redux-toastr';
import Swal from 'sweetalert2';

// Import Components
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  ImageUploader
} from 'components';

// Import Actions
import { addCategory } from 'services/category/categoryActions';
import { getCities } from 'services/city/cityActions';

// Import Utility functions
import { errorMsg } from 'services/utils';

class Add extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      city_id: '',
      file: null,
      file_type: '',
      file_name: ''
    };

    this.onChange = this.onChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleOnLoad = this.handleOnLoad.bind(this);
  }

  componentDidMount() {
    this.props.cityActions.getCities();
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.category.error !== prevProps.category.error &&
      this.props.category.error !== null
    ) {
      let msg = errorMsg(this.props.category.error);
      toastr.error('Error', msg);
    }

    if (
      this.props.city.error !== prevProps.city.error &&
      this.props.city.error !== null
    ) {
      let msg = errorMsg(this.props.city.error);
      toastr.error('Error', msg);
    }

    if (
      this.props.category.success !== prevProps.category.success &&
      this.props.category.success === true
    ) {
      toastr.success('Success', this.props.category.message);
    }

    // Check if city props changed and if yes, update state value
    if (this.props.city !== prevProps.city && this.props.city.cities) {
      this.setState({
        city_id: this.props.city.cities.data[0].id
      });
    }
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleOnLoad(file, file_type, file_name) {
    this.setState({
      file,
      file_type,
      file_name
    });
  }

  handleSubmit() {
    if (this.state.name === '') {
      toastr.error('Error', 'Category name can not be an empty value');
      return;
    }

    const category = {
      name: this.state.name,
      city_id: this.state.city_id,
      file: this.state.file,
      file_type: this.state.file_type,
      file_name: this.state.file_name
    };

    this.props.categoryActions.addCategory(category);
  }

  renderCityOptions(cities) {
    if (cities !== null) {
      return cities.data.map((city, index) => (
        <option value={city.id} key={index}>
          {city.name}
        </option>
      ));
    }
  }

  render() {
    const { categoryLoading, categoryMessage } = this.props.category;
    const { cityLoading, cityMessage } = this.props.city;

    const imageUploaderStyle = {
      position: 'relative',
      width: '60%',
      height: 'auto',
      minHeight: '300px',
      borderWidth: '2px',
      borderColor: 'rgb(102, 102, 102)',
      borderStyle: 'dashed',
      borderRadius: '5px'
    };

    if (categoryLoading || cityLoading) {
      Swal({
        title: 'Please wait...',
        text: categoryMessage + '\n' + cityMessage,
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
        <strong>Category add</strong>
        <Form className="mt-3">
          <FormGroup>
            <Label for="name">Name</Label>
            <Input
              type="text"
              name="name"
              id="name"
              placeholder="Category name here"
              onChange={this.onChange}
            />
          </FormGroup>
          <Label for="city">City</Label>
          <Input
            type="select"
            name="city_id"
            id="city_id"
            onChange={this.onChange}
          >
            {this.renderCityOptions(this.props.city.cities)}
          </Input>
          <FormGroup>
            <Label>Image</Label>
            <ImageUploader
              style={imageUploaderStyle}
              handleOnLoad={this.handleOnLoad}
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
    );
  }
}

export default connect(
  state => ({
    category: {
      ...state.default.services.category
    },
    city: {
      ...state.default.services.city
    }
  }),
  dispatch => ({
    cityActions: bindActionCreators({ getCities }, dispatch),
    categoryActions: bindActionCreators(
      {
        addCategory
      },
      dispatch
    )
  })
)(Add);
