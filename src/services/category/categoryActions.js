import { createActions } from 'redux-actions';

const {
  getCategories,
  getCategoriesSucceed,
  getCategoriesFailed,
  deleteCategory,
  deleteCategorySucceed,
  deleteCategoryFailed,
  updateCategory,
  updateCategorySucceed,
  updateCategoryFailed,
  addCategory,
  addCategorySucceed,
  addCategoryFailed,
  getCategory,
  getCategorySucceed,
  getCategoryFailed,
  updateCurrentCategory
} = createActions({
  GET_CATEGORIES: (page, perPage) => ({ page, perPage }),
  GET_CATEGORIES_SUCCEED: categories => ({ categories }),
  GET_CATEGORIES_FAILED: error => ({ error }),
  DELETE_CATEGORY: id => ({ id }),
  DELETE_CATEGORY_SUCCEED: () => ({}),
  DELETE_CATEGORY_FAILED: error => ({ error }),
  UPDATE_CATEGORY: ({ id, category }) => ({ id, category }),
  UPDATE_CATEGORY_SUCCEED: () => ({}),
  UPDATE_CATEGORY_FAILED: error => ({ error }),
  ADD_CATEGORY: category => ({ category }),
  ADD_CATEGORY_SUCCEED: () => ({}),
  ADD_CATEGORY_FAILED: error => ({ error }),
  GET_CATEGORY: id => ({ id }),
  GET_CATEGORY_SUCCEED: category => ({ category }),
  GET_CATEGORY_FAILED: error => ({ error }),
  UPDATE_CURRENT_CATEGORY: category => ({ category })
});

export {
  getCategories,
  getCategoriesSucceed,
  getCategoriesFailed,
  deleteCategory,
  deleteCategoryFailed,
  deleteCategorySucceed,
  updateCategory,
  updateCategoryFailed,
  updateCategorySucceed,
  addCategory,
  addCategoryFailed,
  addCategorySucceed,
  getCategory,
  getCategoryFailed,
  getCategorySucceed,
  updateCurrentCategory
};
