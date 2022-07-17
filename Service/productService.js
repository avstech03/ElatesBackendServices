const ModelFactory = require("../Model/ModelFactory");
const validator = require("../Services/validations");
const Promise = require("bluebird");
const codes = require("../config/codes.json");
const config = require("../config/serverconfig.json");
const utils = require("../Services/utils");
const request = Promise.promisify(require("request"));
const _ = require("lodash");

const valildateCategoryInProduct = (categoryId) => {
  const categoryModel = ModelFactory.category();
  return categoryModel.getCategoryById(categoryId).then((res) => {
    if (!res) return Promise.reject("INVALID_CATEGORY");
    return res;
  });
};

class ProductService {
  constructor() {
    this.model = ModelFactory.product();
  }

  addProduct(product) {
    if (!product) return Promise.reject("MISSING_RESOURCE");
    let valildateCategoryP = Promise.resolve();
    if (product.category)
      valildateCategoryP = valildateCategoryInProduct(product.category);
    return valildateCategoryP.then(() => this.model.createProduct(product));
  }

  editProduct(product, productId) {
    if (!product) return Promise.reject(code["MISSING_RESOURCE"]);
    if (!productId) return Promise.reject("MISSING_REQ_FIELDS_IN_QUERY_PARAMS");
    let valildateCategoryP = Promise.resolve();
    if (product.category)
      valildateCategoryP = valildateCategoryInProduct(product.category);
    return valildateCategoryP.then(() =>
      this.model.updateProductById(productId, product)
    );
  }

  getProductsByIds(productIds) {
    if (!productIds || productIds.length === 0) return Promise.resolve([]);
    return this.model.getProductsByIds(productIds);
  }

  getProductById(productId) {
    if (!productId) return Promise.reject("MISSING_REQ_FIELDS_IN_QUERY_PARAMS");
    return this.model.getProductById(productId);
  }

  getProductsByName(productName) {
    if (!productName)
      return Promise.reject("MISSING_REQ_FIELDS_IN_QUERY_PARAMS");
    return this.model.getProductByName(productName);
  }

  getAllProducts(searchString) {
    return this.model.getProducts(searchString).then((res) => {
      return res;
    });
  }

  deleteProductById(productId) {
    return this.model.deleteProductById(productId);
  }

  getProductsByCategoryId(categoryId) {
    return this.model.getProductsByCategory(categoryId);
  }

  getProductNames(productIds) {
    if (!productIds) return Promise.reject("MISSING_RESOURCE");
    return this.model.getProductsByIds(productIds).then((products) => {
      let mapper = {};
      if (products) {
        _.forEach(products, (product) => {
          mapper[product._id] = product.name;
        });
      }
      return mapper;
    });
  }
}

module.exports = {
  getInst: () => new ProductService(),
};
