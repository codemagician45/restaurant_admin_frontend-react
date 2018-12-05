import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

/** Import service reducers */
import authReducer from './auth/authReducer';
import cityReducer from './city/cityReducer';
import categoryReducer from './category/categoryReducer';
// const scenesReducer = combineReducers({
// })

const servicesReducer = combineReducers({
  auth: authReducer,
  city: cityReducer,
  category: categoryReducer
})

export default combineReducers({
  routing: routerReducer,
  services: servicesReducer,
});
