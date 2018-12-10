import { createActions } from 'redux-actions';

const {
  getItems,
  getItemsSucceed,
  getItemsFailed,
  deleteItem,
  deleteItemSucceed,
  deleteItemFailed,
  updateItem,
  updateItemSucceed,
  updateItemFailed,
  addItem,
  addItemSucceed,
  addItemFailed,
  getItem,
  getItemSucceed,
  getItemFailed,
  updateCurrentItem
} = createActions({
  GET_ITEMS: () => ({}),
  GET_ITEMS_SUCCEED: items => ({ items }),
  GET_ITEMS_FAILED: error => ({ error }),
  DELETE_ITEM: id => ({ id }),
  DELETE_ITEM_SUCCEED: () => ({}),
  DELETE_ITEM_FAILED: error => ({ error }),
  UPDATE_ITEM: ({ id, item }) => ({ id, item }),
  UPDATE_ITEM_SUCCEED: () => ({}),
  UPDATE_ITEM_FAILED: error => ({ error }),
  ADD_ITEM: item => ({ item }),
  ADD_ITEM_SUCCEED: () => ({}),
  ADD_ITEM_FAILED: error => ({ error }),
  GET_ITEM: id => ({ id }),
  GET_ITEM_SUCCEED: item => ({ item }),
  GET_ITEM_FAILED: error => ({ error }),
  UPDATE_CURRENT_ITEM: item => ({ item })
});

export {
  getItems,
  getItemsSucceed,
  deleteItem,
  getItemsFailed,
  deleteItemSucceed,
  deleteItemFailed,
  updateItem,
  updateItemSucceed,
  updateItemFailed,
  addItem,
  addItemSucceed,
  addItemFailed,
  getItem,
  getItemSucceed,
  getItemFailed,
  updateCurrentItem
};
