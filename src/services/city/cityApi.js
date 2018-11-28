import { wrapRequest, xapi } from '../utils';

const getCities = wrapRequest(
  async () => 
    xapi().get('/api/cities')
)

const addCity = wrapRequest(
  async (name) =>
    xapi().post('/api/cities/', {
      name
    })
)

const deleteCity = wrapRequest(
  async (id) =>
    xapi().delete(`/api/cities/${id}`)
)

const updateCity = wrapRequest(
  async (id, city) =>
    xapi().put(`/api/cities/${id}`, {
    name:city
  })
)

const getCityWithId = wrapRequest(
  async (id) => 
    xapi().get(`/api/cities/${id}`)
);

export {
  getCities,
  addCity,
  deleteCity,
  updateCity,
  getCityWithId
}