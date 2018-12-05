import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toastr } from 'react-redux-toastr';
import Swal from 'sweetalert2';

// Import Components
import { Button, Form, FormGroup, Label, Input } from 'components';

// Import Actions
import { updateCategory, updateCurrentCategory, getCategory } from 'services/category/categoryActions';
import { getCities } from 'services/city/cityActions';

// Import Utility functions
import { errorMsg } from 'services/utils';

class Edit extends React.Component {
  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.props.categoryActions.getCategory(this.props.match.params.id);
    this.props.cityActions.getCities();
  }

  componentDidUpdate(prevProps) {
    if (this.props.category.error !== prevProps.category.error && this.props.category.error !== null) {
      let msg = errorMsg(this.props.category.error);     
      toastr.error('Error', msg);
    }

    if (this.props.city.error !== prevProps.city.error && this.props.city.error !== null) {
      let msg = errorMsg(this.props.city.error);     
      toastr.error('Error', msg);
    }

    if (this.props.category.success !== prevProps.category.success && this.props.category.success === true) {
      toastr.success('Success', this.props.category.message);
    }
  }

  onChange(e) {
    let category = this.props.category.currentCategory;

    switch(e.target.name) {
      case 'city':
        const cities = this.props.city.cities.data;
        const city = cities.find(function(element){
          return element.id == e.target.value
        });
        category = {
          ...category,
          city
        }
        break;
      default:
        category = {
          ...category,
          [e.target.name] : e.target.value
        };
        break;
    }
    this.props.categoryActions.updateCurrentCategory(category);
  }

  handleSubmit() {
    if (this.props.category.currentCategory) {
      if(this.props.category.currentCategory.name === '') {
        toastr.error('Error', 'Category name can not be an empty value');
        return;  
      }
    } else {
      toastr.error('Error', 'Something went wrong');
    }

    const category = {
      name: this.props.category.currentCategory.name,
      id: this.props.category.currentCategory.id,
      city_id: this.props.category.currentCategory.city.id
    }
    let params = {
      id: this.props.match.params.id,
      category
    }

    this.props.categoryActions.updateCategory({...params});
  }

  renderCityOptions(cities, currentCategory) {
    if (cities !== null) {
      return cities.data.map((city, index) => {
        if ( currentCategory ) {
          return (
            <option 
              key={index}
              value={city.id}
            >
              {city.name}
            </option>)
        }
        else {
          return (
            <option key={index}>
              {city.name}
            </option>
          )
        }
      })
    }
    else {
      return 
    }
  }

  render() {
    const { categoryLoading, categoryMessage} = this.props.category;
    const { cityLoading, cityMessage } = this.props.city;

    if (categoryLoading || cityLoading ) {
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
        <strong>Category update</strong>
        <Form className="mt-3">
          <FormGroup>
            <Label for="name">Name</Label>
            <Input 
              type="text" 
              name="name" 
              id="name" 
              placeholder="Category name here" 
              value={this.props.category.currentCategory?this.props.category.currentCategory.name:''}
              onChange={ this.onChange }
            />
          </FormGroup>
          <Label for="city">City</Label>
          <Input 
            type="select" 
            name="city" 
            id="city"
            value={this.props.category.currentCategory?this.props.category.currentCategory.city.id:''}
            onChange={ this.onChange }
          >
            {this.renderCityOptions(this.props.city.cities, this.props.category.currentCategory)}
          </Input>
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
    category: {
      ...state.default.services.category
    },
    city: {
      ...state.default.services.city
    }
  }),
  (dispatch) => ({
    cityActions: bindActionCreators({ getCities }, dispatch),
    categoryActions: bindActionCreators({ updateCategory, updateCurrentCategory, getCategory }, dispatch)
  })
)(Edit);