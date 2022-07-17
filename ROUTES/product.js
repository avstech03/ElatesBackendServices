const serviceHandler = require("../services/servicehandler").serviceHandler;
const BuilderService = require("../Service/BuilderService");
const Promise        = require("bluebird");
const _              = require("lodash");
const codes          = require("../config/codes.json");
const config         = require("../config/serverconfig.json");

const addProduct = (req, res) => {
    const serviceInst = BuilderService["productService"];
    let body = req.body;
    req.ApiId = "addproduct";
    return serviceHandler(req, res, serviceInst.addProduct(body));
};

const editProduct = (req, res) => {
    const serviceInst = BuilderService["productService"];
    let body = req.body;
    const productId = req.params.productId;
    if(!productId) return Promise.reject(codes["MISSING_REQ_FIELDS_IN_QUERY_PARAMS"]);
    return serviceHandler(req, res, serviceInst.editProduct(body, productId));
}

const getProductById = (req, res) => {
    const serviceInst = BuilderService["productService"];
    const productId = req.params.productId;
    if(!productId) return Promise.reject(codes["MISSING_REQ_FIELDS_IN_QUERY_PARAMS"]);
    return serviceHandler(req, res, serviceInst.getProductById(productId));
};

const getAllProducts = (req, res) => {
    const serviceInst = BuilderService["productService"];
    let searchString = req.query.search;
    if(searchString === "undefined") searchString = undefined;
    return serviceHandler(req, res, serviceInst.getAllProducts(searchString));
}

const deleteProductById = (req, res) => {
    const serviceInst = BuilderService["productService"];
    const productId = req.params.productId;
    if(!productId) return Promise.reject(codes["MISSING_REQ_FIELDS_IN_QUERY_PARAMS"]);
    return serviceHandler(req, res, serviceInst.deleteProductById(productId))
}

const getProductsByName = (req, res) => {
    const serviceInst = BuilderService["productService"];
    const productName = req.params.productName;
    if(!productName) return Promise.reject(codes["MISSING_REQ_FIELDS_IN_QUERY_PARAMS"]);
    return serviceHandler(req, res, serviceInst.getProductsByName(productName));
}

const getProductsByCategoryId = (req, res) => {
    const serviceInst = BuilderService["productService"];
    const categoryId = req.params.categoryId;
    if(!categoryId) return Promise.reject("MISSING_REQ_FIELDS_IN_QUERY_PARAMS");
    return serviceHandler(req, res, serviceInst.getProductsByCategoryId(categoryId));
}

const getProductsByIds = (req, res) => {
    const serviceInst = BuilderService["productService"];
    let body = req.body;
    if(!body) return Promise.reject("MISSING_RESOURCE");
    const productIds = body.productIds;
    return serviceHandler(req, res, serviceInst.getProductsByIds(productIds));
}

const getProductNames = (req, res) => {
    const serviceInst = BuilderService["productService"];
    let body = req.body;
    if(!body) return Promise.reject("MISSING_RESOURCE");
    const productIds = body.productIds;
    return serviceHandler(req, res, serviceInst.getProductNames(productIds));
}

module.exports = (app) => {
    /* ADMIN APIS */
    app.post(`${config.api.admin}/products`, (req, res) => addProduct(req, res));
    app.put(`${config.api.admin}/products/:productId`, (req, res) => editProduct(req, res));
    app.get(`${config.api.admin}/products`, (req, res) => getAllProducts(req, res));
    app.get(`${config.api.admin}/products/:productId`, (req, res) => getProductById(req, res));
    app.delete(`${config.api.admin}/products/:productId`, (req, res) => deleteProductById(req, res));
    app.put(`${config.api.admin}/productnames`, (req, res) => getProductNames(req, res));
    app.get(`${config.api.admin}/productname/:productName`, (req, res) => getProductsByName(req, res));

    /* USER APIS */
    app.get(`${config.api.user}/products`, (req, res) => getAllProducts(req, res));
    app.get(`${config.api.user}/products/:productId`, (req, res) => getProductById(req, res));
    app.get(`${config.api.user}/products/category/:categoryId`, (req, res) => getProductsByCategoryId(req, res));
    app.put(`${config.api.user}/products`, (req, res) => getProductsByIds(req, res));
    app.put(`${config.api.user}/products/name`, (req, res) => getProductNames(req, res));
}