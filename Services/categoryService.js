const ModelFactory = require("../Model/ModelFactory");
const validator    = require("../services/validations");
const Promise      = require("bluebird");
const codes        = require("../config/codes.json");
const config       = require("../config/serverconfig.json");
const utils        = require("../services/utils");
const request      = Promise.promisify(require("request"));

class CategoryService {
    constructor() {
        this.model = ModelFactory.category();
    }

    addCategory(category) {
        if(!category) return Promise.reject("MISSING_RESOURCE");
        return this.model.createCategory(category);
    }

    updateCategoryById(categoryId, category) {
        if(!category) return Promise.reject("MISSING_RESOURCE");
        if(!categoryId) return Promise.reject("MISSING_REQ_FIELDS_IN_QUERY_PARAMS");
        return this.model.updateCategoryById(categoryId, category);
    }

    getCategoryById(categoryId) {
        if(!categoryId) return Promise.reject("MISSING_REQ_FIELDS_IN_QUERY_PARAMS");
        return this.model.getCategoryById(categoryId);
    }

    getCategories() {
        return this.model.getCategories();
    }

    deleteCategoryById(categoryId) {
        if(!categoryId) return Promise.reject("MISSING_REQ_FIELDS_IN_QUERY_PARAMS");
        return this.model.deleteCategoryById(categoryId);
    }
};

CategoryService.prototype.getSubCategories = (categoryId) => {
    if(!categoryId) return Promise.reject("MISSING_REQ_FIELDS_IN_QUERY_PARAMS");
    return this.model.getSubCategories(categoryId);
}

module.exports = {
    getInst: () => new CategoryService(),
};