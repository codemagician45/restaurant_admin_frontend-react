import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

/** Import service reducers */
import authReducer from './auth/authReducer';
import cityReducer from './city/cityReducer';
import categoryReducer from './category/categoryReducer';
import restaurantReducer from './restaurant/restaurantReducer';
// const scenesReducer = combineReducers({
// })

const servicesReducer = combineReducers({
  auth: authReducer,
  city: cityReducer,
  category: categoryReducer,
  restaurant: restaurantReducer
})

export default combineReducers({
  routing: routerReducer,
  services: servicesReducer,
});
