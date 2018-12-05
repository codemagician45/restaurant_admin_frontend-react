import { wrapRequest, xapi } from '../utils';

const getCategories = wrapRequest(
  async() =>
    xapi().get('/api/categories')
)

const addCategory = wrapRequest(
  async (category) =>
    xapi().post('/api/categories/', {
      ...category
    })
)

const deleteCategory = wrapRequest(
  async (id) =>
    xapi().delete(`/api/categories/${id}`)
)

const updateCategory = wrapRequest(
  async (id, category) => 
    xapi().put(`/api/categories/${id}`, {
      ...category
    })
)

const getCategory = wrapRequest(
  async (id) =>
    xapi().get(`/api/categories/${id}`)
)

export {
  getCategories,
  addCategory,
  deleteCategory,
  updateCategory,
  getCategory
}