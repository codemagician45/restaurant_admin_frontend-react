import { createActions } from 'redux-actions';

const {
  getCities,
  getCitiesSucceed,
  getCitiesFailed,
  deleteCity,
  deleteCitySucceed,
  deleteCityFailed,
  updateCity,
  updateCitySucceed,
  updateCityFailed,
  addCity,
  addCitySucceed,
  addCityFailed,
  getCity,
  getCitySucceed,
  getCityFailed,
  updateCurrentCity
} = createActions({
  GET_CITIES: params => ({ params }),
  GET_CITIES_SUCCEED: cities => ({ cities }),
  GET_CITIES_FAILED: error => ({ error }),
  DELETE_CITY: id => ({ id }),
  DELETE_CITY_SUCCEED: () => ({}),
  DELETE_CITY_FAILED: error => ({ error }),
  UPDATE_CITY: (id, city) => ({ id, city }),
  UPDATE_CITY_SUCCEED: () => ({}),
  UPDATE_CITY_FAILED: error => ({ error }),
  ADD_CITY: city => ({ city }),
  ADD_CITY_SUCCEED: () => ({}),
  ADD_CITY_FAILED: error => ({ error }),
  GET_CITY: id => ({ id }),
  GET_CITY_SUCCEED: city => ({ city }),
  GET_CITY_FAILED: error => ({ error }),
  UPDATE_CURRENT_CITY: city => ({ city })
});

export {
  getCities,
  getCitiesSucceed,
  getCitiesFailed,
  deleteCity,
  deleteCityFailed,
  deleteCitySucceed,
  updateCity,
  updateCityFailed,
  updateCitySucceed,
  addCity,
  addCityFailed,
  addCitySucceed,
  getCity,
  getCityFailed,
  getCitySucceed,
  updateCurrentCity
};
