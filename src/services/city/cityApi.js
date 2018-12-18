import { wrapRequest, xapi, getBase64 } from '../utils';

const getCities = wrapRequest(async (page, perPage) => {
  let params = {
    page,
    perPage
  };

  return xapi().get('/api/cities', {
    params
  });

  /*
    if (perPage) {
      return xapi().get(`/api/cities?page=${page}&perPage=${perPage}`);
    } else {
      return xapi().get(`/api/cities?page=${page}`);
    }
    */
});

const addCity = wrapRequest(async city => {
  let file = null;

  if (city.file) {
    file = await getBase64(city.file);
  }

  return xapi().post('/api/cities/', {
    ...city,
    file
  });
});

const deleteCity = wrapRequest(async id => xapi().delete(`/api/cities/${id}`));

const updateCity = wrapRequest(async (id, city) => {
  let file = null;

  if (city.file) {
    file = await getBase64(city.file);
  }

  return xapi().put(`/api/cities/${id}`, {
    ...city,
    file
  });
});

const getCityWithId = wrapRequest(async id => xapi().get(`/api/cities/${id}`));

export { getCities, addCity, deleteCity, updateCity, getCityWithId };
