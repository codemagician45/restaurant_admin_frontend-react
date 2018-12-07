import { wrapRequest, xapi } from '../utils';

const getMenus = wrapRequest(
  async () =>
    xapi().get('/api/menus')
);

const addMenu = wrapRequest(
  async (menu) =>
    xapi().post('/api/menus/', {
    ...menu
  })
);

const deleteMenu = wrapRequest(
  async (id) =>
    xapi().delete(`/api/menus/${id}`)
);

const updateMenu = wrapRequest(
  async (id, menu) =>
    xapi().put(`/api/menus/${id}`, {
      ...menu
    })
);

const getMenuWithId = wrapRequest(
  async (id) =>
    xapi().get(`/api/menus/${id}`)
);

export {
  getMenus,
  addMenu,
  deleteMenu,
  updateMenu,
  getMenuWithId
}