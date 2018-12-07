import { createActions } from 'redux-actions';

const {
  getRestaurants,
  getRestaurantsSucceed,
  getRestaurantsFailed,
  deleteRestaurant,
  deleteRestaurantSucceed,
  deleteRestaurantFailed,
  updateRestaurant,
  updateRestaurantSucceed,
  updateRestaurantFailed,
  addRestaurant,
  addRestaurantSucceed,
  addRestaurantFailed,
  getRestaurant,
  getRestaurantSucceed,
  getRestaurantFailed,
  updateCurrentRestaurant
} = createActions({
  GET_RESTAURANTS: () => ({}),
  GET_RESTAURANTS_SUCCEED: (restaurants) => ({ restaurants }),
  GET_RESTAURANTS_FAILED: (error) => ({ error }),
  DELETE_RESTAURANT: (id) => ({ id }),
  DELETE_RESTAURANT_SUCCEED: () => ({}),
  DELETE_RESTAURANT_FAILED: () => ({}),
  UPDATE_RESTAURANT: (id, restaurant ) => ({ id, restaurant }),
  UPDATE_RESTAURANT_SUCCEED: () => ({}),
  UPDATE_RESTAURANT_FAILED: (error) => ({ error }),
  ADD_RESTAURANT: (restaurant) => ({ restaurant }),
  ADD_RESTAURANT_SUCCEED: () => ({}),
  ADD_RESTAURANT_FAILED: (error) => ({ error }),
  GET_RESTAURANT: (id) => ({ id }),
  GET_RESTAURANT_SUCCEED: (restaurant) => ({ restaurant }),
  GET_RESTAURANT_FAILED: (error) => ({ error }),
  UPDATE_CURRENT_RESTAURANT: (restaurant) => ({ restaurant })
});

export {
  getRestaurants,
  getRestaurantsSucceed,
  getRestaurantsFailed,
  deleteRestaurant,
  deleteRestaurantSucceed,
  deleteRestaurantFailed,
  updateRestaurant,
  updateRestaurantSucceed,
  updateRestaurantFailed,
  addRestaurant,
  addRestaurantSucceed,
  addRestaurantFailed,
  getRestaurant,
  getRestaurantSucceed,
  getRestaurantFailed,
  updateCurrentRestaurant
}