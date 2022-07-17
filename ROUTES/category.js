const serviceHandler = require("../Services/servicehandler").serviceHandler;
const BuilderService = require("../Service/BuilderService");
const Promise = require("bluebird");
const _ = require("lodash");
const codes = require("../config/codes.json");
const config = require("../config/serverconfig.json");

const addCategory = (req, res) => {
  const serviceInst = BuilderService["categoryService"];
  let body = req.body;
  req.ApiId = "addcategory";
  return serviceHandler(req, res, serviceInst.addCategory(body));
};

const editCategory = (req, res) => {
  const serviceInst = BuilderService["categoryService"];
  let body = req.body;
  const categoryId = req.params.categoryId;
  req.ApiId = "editcategory";
  if (!categoryId) return Promise.reject("MISSING_REQ_FIELDS_IN_QUERY_PARAMS");
  return serviceHandler(
    req,
    res,
    serviceInst.updateCategoryById(categoryId, body)
  );
};

const getCategoryById = (req, res) => {
  const serviceInst = BuilderService["categoryService"];
  const categoryId = req.params.categoryId;
  if (!categoryId) return Promise.reject("MISSING_REQ_FIELDS_IN_QUERY_PARAMS");
  return serviceHandler(req, res, serviceInst.getCategoryById(categoryId));
};

const getCategories = (req, res) => {
  const serviceInst = BuilderService["categoryService"];
  return serviceHandler(req, res, serviceInst.getCategories());
};

const getCategoriesForUser = (req, res) => {
  const serviceInst = BuilderService["categoryService"];
  return serviceHandler(req, res, serviceInst.getCategoriesForUser());
};

const deleteCategoryById = (req, res) => {
  const serviceInst = BuilderService["categoryService"];
  const categoryId = req.params.categoryId;
  if (!categoryId) return Promise.reject("MISSING_REQ_FIELDS_IN_QUERY_PARAMS");
  return serviceHandler(req, res, serviceInst.deleteCategoryById(categoryId));
};

const getSubCategories = (req, res) => {
  const serviceInst = BuilderService["categoryService"];
  const categoryId = req.params.categoryId;
  if (!categoryId) return Promise.reject("MISSING_REQ_FIELDS_IN_QUERY_PARAMS");
  return serviceHandler(req, res, serviceInst.getSubCategories(categoryId));
};

const getCategoriesByIds = (req, res) => {
  const serviceInst = BuilderService["categoryService"];
  const body = req.body;
  if (!body) return Promise.reject("MISSING_RESOURCE");
  let categoryIds = body.categoryIds;
  return serviceHandler(req, res, serviceInst.getCategoriesByIds(categoryIds));
};

module.exports = (app) => {
  /* USER APIS */
  app.get(`${config.api.user}/category`, (req, res) =>
    getCategoriesForUser(req, res)
  );
  app.get(`${config.api.user}/category/:categoryId`, (req, res) =>
    getCategoryById(req, res)
  );
  app.get(`${config.api.user}/category/:categoryId/subcategory`, (req, res) =>
    getSubCategories(req, res)
  );

  /* ADMIN APIS */
  app.post(`${config.api.admin}/category`, (req, res) => addCategory(req, res));
  app.put(`${config.api.admin}/category/:categoryId`, (req, res) =>
    editCategory(req, res)
  );
  app.get(`${config.api.admin}/category`, (req, res) =>
    getCategories(req, res)
  );
  app.get(`${config.api.admin}/category/:categoryId`, (req, res) =>
    getCategoryById(req, res)
  );
  app.delete(`${config.api.admin}/category/:categoryId`, (req, res) =>
    deleteCategoryById(req, res)
  );
  app.put(`${config.api.user}/category`, (req, res) =>
    getCategoriesByIds(req, res)
  );
};
