const ModelFactory = require("../Model/ModelFactory");
const validator = require("../Services/validations");
const Promise = require("bluebird");
const codes = require("../config/codes.json");
const config = require("../config/serverconfig.json");
const utils = require("../Services/utils");
const request = Promise.promisify(require("request"));

class CategoryService {
  constructor() {
    this.model = ModelFactory.category();
  }

  addCategory(category) {
    if (!category) return Promise.reject("MISSING_RESOURCE");
    return this.model.createCategory(category);
  }

  updateCategoryById(categoryId, category) {
    if (!category) return Promise.reject("MISSING_RESOURCE");
    if (!categoryId)
      return Promise.reject("MISSING_REQ_FIELDS_IN_QUERY_PARAMS");
    return this.model.updateCategoryById(categoryId, category);
  }

  getCategoryById(categoryId) {
    if (!categoryId)
      return Promise.reject("MISSING_REQ_FIELDS_IN_QUERY_PARAMS");
    return this.model.getCategoryById(categoryId);
  }

  getCategoriesByIds(categoryIds) {
    if (!categoryIds || categoryIds.length < 1)
      return Promise.reject("MISSING_RESOURCE");
    return this.model.getCategoriesByIds(categoryIds);
  }

  getCategories() {
    return this.model.getCategories();
  }

  getCategoriesForUser() {
    let query = { isMainCategory: true };
    return this.model.getCategories(query);
  }

  deleteCategoryById(categoryId) {
    if (!categoryId)
      return Promise.reject("MISSING_REQ_FIELDS_IN_QUERY_PARAMS");
    return this.model.deleteCategory(categoryId);
  }

  getSubCategories(categoryId) {
    if (!categoryId)
      return Promise.reject("MISSING_REQ_FIELDS_IN_QUERY_PARAMS");
    return this.model.getCategoriesByCategory(categoryId);
  }
}

module.exports = {
  getInst: () => new CategoryService(),
};
