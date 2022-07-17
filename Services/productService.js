const ModelFactory = require("../Model/ModelFactory");
const validator    = require("../services/validations");
const Promise      = require("bluebird");
const codes        = require("../config/codes.json");
const config       = require("../config/serverconfig.json");
const utils        = require("../services/utils");
const request      = Promise.promisify(require("request"));

const valildateCategoryInProduct = categoryId => {
    const categoryModel = ModelFactory.category();
    return categoryModel.getCategoryById(categoryId)
    .then(res => {
        if(!res) return Promise.reject("INVALID_CATEGORY");
        return res;
    });
}

class ProductService {
    constructor() {
        this.model = ModelFactory.product();
    }

    addProduct(product) {
        if(!product) return Promise.reject("MISSING_RESOURCE");
        let valildateCategoryP = Promise.resolve();
        if(product.category) valildateCategoryP = valildateCategoryInProduct(product.category);
        return valildateCategoryP
        .then(() => this.model.createProduct(product));
    }

    editProduct(product, productId) {
        if(!product) return Promise.reject(code["MISSING_RESOURCE"]);
        if(!productId) return Promise.reject("MISSING_REQ_FIELDS_IN_QUERY_PARAMS");
        let valildateCategoryP = Promise.resolve();
        if(product.category) valildateCategoryP = valildateCategoryInProduct(product.category);
        return valildateCategoryP
        .then(() => this.model.updateProductById(productId, product));
    }

    getProductById(productId) {
        if(!productId) return Promise.reject("MISSING_REQ_FIELDS_IN_QUERY_PARAMS");
        return this.model.getProductById(productId);
    }

    getProductsByName(productName) {
        if(!getProductsByName) return Promise.reject("MISSING_REQ_FIELDS_IN_QUERY_PARAMS");
        return this.model.getProductByName(productName);
    }

    getAllProducts() {
        return this.model.getProducts();
    }

    deleteProductById(productId) {
        return this.model.deleteProductById(productId);
    }

    getProductsByCategoryId(categoryId) {
        return this.model.getProductsByCategory(categoryId);
    }
}

module.exports = {
    getInst: () => new ProductService(),
}