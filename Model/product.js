const BaseModel = require("./BaseModel");

class ProductModel extends BaseModel {
  constructor() {
    super();
  }

  createProduct(data) {
    let product = {};

    if (data.id) product._id = data._id;
    if (data.name) product.name = data.name;
    if (data.brand) product.brand = data.brand;
    if (data.category) product.category = data.category;
    if (data.quantity) product.quantity = data.quantity;
    if (data.pic) product.pic = data.pic;
    if (data.description) product.description = data.description;
    if (data.isMultipleDeliveryAvailable)
      product.isMultipleDeliveryAvailable = data.isMultipleDeliveryAvailable;
    if (data.maxQuantity) product.maxQuantity = data.maxQuantity;

    return this.create(product);
  }

  updateProductById(id, data) {
    let product = {},
      query = { _id: id };

    if (data.name) product.name = data.name;
    if (data.brand) product.brand = data.brand;
    if (data.category) product.category = data.category;
    if (data.quantity) product.quantity = data.quantity;
    if (data.pic) product.pic = data.pic;
    if (data.description) product.description = data.description;
    if (data.isMultipleDeliveryAvailable)
      product.isMultipleDeliveryAvailable = data.isMultipleDeliveryAvailable;
    if (data.maxQuantity) product.maxQuantity = data.maxQuantity;

    return this.findOneAndUpdate(query, product);
  }

  updateProduct(matchCond, data) {
    let product = {},
      query = {};

    if (matchCond) query = matchCond;

    if (data.name) product.name = data.name;
    if (data.brand) product.brand = data.brand;
    if (data.category) product.category = data.category;
    if (data.quantity) product.quantity = data.quantity;
    if (data.pic) product.pic = data.pic;
    if (data.description) product.description = data.description;
    if (data.isMultipleDeliveryAvailable)
      product.isMultipleDeliveryAvailable = data.isMultipleDeliveryAvailable;
    if (data.maxQuantity) product.maxQuantity = data.maxQuantity;

    return this.findOneAndUpdate(query, product);
  }

  getProductsByIds(ids) {
    const matchCnd = {
      _id: {
        $in: ids,
      },
    };
    return this.find(matchCnd);
  }

  getProductById(id) {
    const query = { _id: id };
    return this.findOne(query);
  }

  getProductByName(name) {
    const query = { name: name };
    return this.findOne(query);
  }

  getProductsByCategory(category) {
    const query = { category: category };
    return this.find(query);
  }

  getProductsByBrand(brand) {
    const query = { brand: brand };
    return this.find(query);
  }

  getProducts(searchString) {
    let query = {};
    if (searchString) {
      const lowerSearchString = searchString.toLowerCase();
      const upperSearchString = searchString.toUpperCase();
      query = {
        $or: [
          { name: { $regex: lowerSearchString } },
          { name: { $regex: upperSearchString } },
        ],
      };
    }
    return this.find(query);
  }

  deleteProductById(id) {
    return this.delete(id);
  }
}

module.exports = { getInst: () => new ProductModel() };
