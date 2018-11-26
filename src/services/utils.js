import axios from 'axios';

//Import Settings
import settings from 'config/settings.js';
import store from '../store';

export const wrapRequest = func => {
  return async (...args) => {
    const res = await func(...args);
    if (res.status && res.status !== 200) {
      throw res;
    } else {
      return res.data;
    }
  };
};

export const xapi = () => {
  const token = store.getState().default.services.auth.token.access_token;
  const tokenType = store.getState().default.services.auth.token.token_type;
  
  let headers = {
    'X-Requested-With': 'XMLHttpRequest',
    Accept: 'application/json',
    'charset': 'UTF-8'
  }

  if (token) {
    headers = {
      ...headers,
      Authorization: `${tokenType} ${token}`
    }
  }
  
  return axios.create({
    baseURL: settings.BASE_URL,
    headers: headers
  });
};

export const errorMsg = (error) => {
  let message = '';
  if (typeof error === 'object' && error !== null) {
    if (error.response) {
      message = error.response.data.message? error.response.data.message : 'Something went wrong';  
    } else {
      message = error.message ? error.message : 'Something went wrong';
    }
  } else {
    message = error;
  }

  return message; 
}