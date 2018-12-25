import { put, takeEvery, call, all } from 'redux-saga/effects';

import {
  getItemsFailed,
  getItemsSucceed,
  getItemFailed,
  getItemSucceed,
  addItemFailed,
  addItemSucceed,
  deleteItemFailed,
  deleteItemSucceed,
  getItems as getItemsAction,
  updateItemFailed,
  updateItemSucceed
} from './itemActions';

// Import API
import * as itemApi from './itemApi';

export function* itemSubscriber() {
  yield all([takeEvery('GET_ITEMS', getItems)]);
  yield all([takeEvery('ADD_ITEM', addItem)]);
  yield all([takeEvery('DELETE_ITEM', deleteItem)]);
  yield all([takeEvery('UPDATE_ITEM', updateItem)]);
  yield all([takeEvery('GET_ITEM', getItem)]);
}

export function* getItems({ payload: { params } }) {
  try {
    const items = yield call(itemApi.getItems, params);
    yield put(getItemsSucceed(items));
  } catch (error) {
    console.error(error);
    yield put(getItemsFailed({ error }));
  }
}

export function* addItem({ payload: { item } }) {
  try {
    yield call(itemApi.addItem, item);
    yield put(addItemSucceed());
  } catch (error) {
    console.error(error);
    yield put(addItemFailed({ error }));
  }
}

export function* deleteItem({ payload: { id } }) {
  try {
    yield call(itemApi.deleteItem, id);
    yield put(deleteItemSucceed());
    yield put(getItemsAction({ page: 1 }));
  } catch (error) {
    console.error(error);
    yield put(deleteItemFailed({ error }));
  }
}

export function* updateItem({ payload: { id, item } }) {
  try {
    console.log('update item saga');
    console.log(id);
    console.log(item);
    yield call(itemApi.updateItem, id, item);
    yield put(updateItemSucceed());
  } catch (error) {
    console.error(error);
    yield put(updateItemFailed({ error }));
  }
}

export function* getItem({ payload: { id } }) {
  try {
    const response = yield call(itemApi.getItem, id);
    const item = response.data;
    yield put(getItemSucceed(item));
  } catch (error) {
    console.error(error);
    yield put(getItemFailed({ error }));
  }
}
