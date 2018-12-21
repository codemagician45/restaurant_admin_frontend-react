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
  });

  return xapi;
};

export const errorMsg = error => {
  let message = '';
  if (typeof error === 'object' && error !== null) {
    if (error.response) {
      message = error.response.data.message
        ? error.response.data.message
        : 'Something went wrong';
    } else if (error.error !== undefined) {
      if (error.error.response) {
        message = error.error.response.data.message
          ? error.error.response.data.message
          : 'Something went wrong';
      } else {
        message = 'Something went wrong';
      }
    } else if (error.error) {
      message = error.error.message
        ? error.error.message
        : 'Something went wrong';
    } else {
      message = error.message ? error.message : 'Something went wrong';
    }
  } else {
    message = error;
  }

  return message;
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
