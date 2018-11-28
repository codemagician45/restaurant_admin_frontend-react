import { put, takeEvery, call, all } from 'redux-saga/effects';

// Import Actions
import {
  getCitiesSucceed,
  getCitiesFailed,
  addCitySucceed,
  addCityFailed,
  deleteCitySucceed,
  deleteCityFailed,
  getCities as getCitiesAction,
  updateCitySucceed,
  updateCityFailed,
  getCityFailed,
  getCitySucceed
} from './cityActions';

// Import API

import * as cityApi from './cityApi';

export function* citySubscriber() {
  yield all([takeEvery('GET_CITIES', getCities)]);
  yield all([takeEvery('ADD_CITY', addCity)]);
  yield all([takeEvery('DELETE_CITY', deleteCity)]);
  yield all([takeEvery('UPDATE_CITY', updateCity)]);
  yield all([takeEvery('GET_CITY', getCity)]);
}

export function* getCities() {
  try {
    const cities = yield call(cityApi.getCities);
    yield put(getCitiesSucceed(cities));
  } catch (error) {
    console.error(error);
    yield put(getCitiesFailed({error}));
  }
}

export function* addCity({payload: {name}}) {
  try {
    const response = yield call(cityApi.addCity, name);
    yield put(addCitySucceed());
  } catch (error) {
    console.error(error);
    yield put(addCityFailed({ error }));
  }
}

export function* deleteCity({ payload: {id}}) {
  try {
    const response = yield call(cityApi.deleteCity, id);
    yield put(deleteCitySucceed());
    yield put(getCitiesAction());
  } catch (error) {
    console.error(error);
    yield put(deleteCityFailed({ error }));
  }
}

export function* updateCity({ payload: {id, name}}) {
  try {
    const response = yield call(cityApi.updateCity, id, name);
    yield put(updateCitySucceed());
  } catch (error) {
    console.error(error);
    yield put(updateCityFailed({ error }));
  }
}

export function* getCity({ payload: {id} }) {
  try {
    const response = yield call(cityApi.getCityWithId, id);
    const city = response.data;
    yield put(getCitySucceed(city))
  } catch (error) {
    console.error(error);
    yield put(getCityFailed({ error }));
  }
}