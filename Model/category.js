const BaseModel = require("./BaseModel");

class CategoryModel extends BaseModel {
  constructor() {
    super();
  }

  createCategory(data) {
    let category = {};

    if (data._id) category._id = data._id;
    if (data.name) category.name = data.name;
    if (data.category) category.category = data.category;
    if (data.pic) category.pic = data.pic;
    if (data.description) category.description = data.description;
    if (data.isMainCategory) category.isMainCategory = data.isMainCategory;

    return this.create(category);
  }

  getCategoriesByIds(ids) {
    const matchCnd = {
      _id: {
        $in: ids,
      },
    };

    return this.find(matchCnd);
  }

  updateCategoryById(id, data) {
    let category = {},
      query = { _id: id };

    if (data.name) category.name = data.name;
    if (data.category) category.category = data.category;
    if (data.pic) category.pic = data.pic;
    if (data.description) category.description = data.description;
    if (data.isMainCategory) category.isMainCategory = data.isMainCategory;

    return this.findOneAndUpdate(query, category);
  }

  udpateCategory(query, update, unset) {
    let updateSet = {};

    if (updateSet.name) category.name = updateSet.name;
    if (updateSet.category) category.category = updateSet.category;
    if (updateSet.pic) category.pic = updateSet.pic;
    if (updateSet.description) category.description = updateSet.description;
    if (data.isMainCategory) category.isMainCategory = data.isMainCategory;

    return this.findOneAndUpdate(query, updateSet, unset);
  }

  getCategoryById(id) {
    let query = { _id: id };
    return this.findOne(query);
  }

  getCategoryByName(name) {
    let query = { name: name };
    return this.findOne(query);
  }

  getCategoriesByCategory(category) {
    let query = { category: category };
    return this.find(query);
  }

  deleteCategory(id) {
    return this.delete(id);
  }

  getCategories(query) {
    let matchCnd = {};
    if (query) {
      if (query.isMainCategory) matchCnd.isMainCategory = query.isMainCategory;
    }
    return this.find(matchCnd);
  }
}

module.exports = { getInst: () => new CategoryModel() };
