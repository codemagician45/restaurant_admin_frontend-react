import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

/** Import service reducers */
import authReducer from './auth/authReducer';

// const scenesReducer = combineReducers({
// })

const servicesReducer = combineReducers({
  auth: authReducer
})

export default combineReducers({
  routing: routerReducer,
  services: servicesReducer,
});
