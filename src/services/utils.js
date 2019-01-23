import axios from 'axios';

// Import Settings
import settings from 'config/settings.js';
import store from '../store';

// Import Logout action
import { logout } from './auth/authActions';
import queryString from 'query-string';

export const wrapRequest = func => {
  return async (...args) => {
    const res = await func(...args);
    if (
      res.status &&
      res.status !== 200 &&
      res.status !== 201 &&
      res.status !== 204
    ) {
      throw res;
    } else {
      return res.data;
    }
  };
};

export const xapi = () => {
  let token = null;
  let tokenType = null;
  if (store.getState().default.services.auth.token) {
    token = store.getState().default.services.auth.token.access_token;
    tokenType = store.getState().default.services.auth.token.token_type;
  }

  let headers = {
    'X-Requested-With': 'XMLHttpRequest',
    Accept: 'application/json',
    charset: 'UTF-8'
  };

  if (token) {
    headers = {
      ...headers,
      Authorization: `${tokenType} ${token}`
    };
  }

  let xapi = axios.create({
    baseURL: settings.BASE_URL,
    headers: headers
  });

  // Check expired token
  xapi.interceptors.response.use(undefined, function(err) {
    if (err.response.status === 401) {
      store.dispatch(logout());
    }

    if (err.response.status !== 200) {
      throw err.response;
    }
  });

  return xapi;
};

export const errorMsg = error => {
  let errorMsg = {
    title: null,
    message: ''
  };

  if (typeof error === 'object' && error !== null) {
    if (error.data && error.data.message) {
      errorMsg.title = error.data.message;
      let errors = error.data.errors;
      if (errors) {
        for (let key in errors) {
          /* eslint-disable-next-line  */
          if (errors[key]) {
            /* eslint-disable-next-line  */
            errors[key].map(msg => {
              errorMsg.message += msg + '\n';
            });
          }
        }
      }
    }
  } else {
    errorMsg.title = error;
  }

  return errorMsg;
};

export const getBase64 = file => {
  return new Promise(function(resolve, reject) {
    var reader = new FileReader();
    reader.onload = function() {
      resolve(reader.result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const updateSearchQueryInUrl = instance => {
  let values = queryString.parse(instance.props.location.search);
  values = {
    ...values,
    ...instance.filter,
    page: 1
  };
  const searchQuery = queryString.stringify(values);
  instance.props.history.push({
    pathname: instance.props.location.pathname,
    search: `?${searchQuery}`
  });
};
