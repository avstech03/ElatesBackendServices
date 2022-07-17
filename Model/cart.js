const coupon = require("../DBSchema/coupon");
const BaseModel = require("./BaseModel");

class CartModel extends BaseModel {
    constructor() {
        super();
    }

    createCart(data) {
        let cart = {};

        if(data._id) cart._id = data._id;
        if(data.products) cart.products = data.products;
        if(data.membership) cart.membership = data.membership;
        if(data.amount || data.amount === 0) cart.amount = data.amount;
        if(data.userId) cart.userId = data.userId;
        if(data.deliveryCharges) cart.deliveryCharges = data.deliveryCharges;
        if(data.coupon) cart.coupon = data.coupon;
        if(data.discount || data.discount === 0) cart.discount = data.discount;
        if(data.deliveryType) cart.deliveryType = data.deliveryType;
        if(data.from) cart.from = data.from;
        if(data.to) cart.to = data.to;
        if(data.slot) cart.slot = data.slot;
        if(data.deliveryDate) cart.deliveryDate = data.deliveryDate;

        return this.create(cart);
    }

    updateCartById(id, data) {
        let cart = {};
        const query = {
            _id: id
        };

        if(data.products) cart.products = data.products;
        if(data.membership) cart.membership = data.membership;
        if(data.amount || data.amount === 0) cart.amount = data.amount;
        if(data.userId) cart.userId = data.userId;
        if(data.deliveryCharges || data.deliveryCharges === 0) cart.deliveryCharges = data.deliveryCharges;
        if(data.coupon || data.coupon === '') cart.coupon = data.coupon;
        if(data.discount || data.discount === 0) cart.discount = data.discount;
        if(data.deliveryType) cart.deliveryType = data.deliveryType;
        if(data.from) cart.from = data.from;
        if(data.to) cart.to = data.to;
        if(data.slot) cart.slot = data.slot;
        if(data.deliveryDate) cart.deliveryDate = data.deliveryDate;

        return this.findOneAndUpdate(query, cart);
    }

    updateCartByUserId(userId, data) {
        let cart = {};
        const query = {
            userId: userId
        };

        if(data.products) cart.products = data.products;
        if(data.membership) cart.membership = data.membership;
        if(data.amount || data.amount === 0) cart.amount = data.amount;
        if(data.userId) cart.userId = data.userId;
        if(data.deliveryCharges || data.deliveryCharges === 0) cart.deliveryCharges = data.deliveryCharges;
        if(data.coupon || data.coupon === '') cart.coupon = data.coupon;
        if(data.discount || data.discount === 0) cart.discount = data.discount;
        if(data.deliveryType) cart.deliveryType = data.deliveryType;
        if(data.from) cart.from = data.from;
        if(data.to) cart.to = data.to;
        if(data.slot) cart.slot = data.slot;
        if(data.deliveryDate) cart.deliveryDate = data.deliveryDate;

        return this.findOneAndUpdate(query, cart);
    }

    getCartByUserId(userId) {
        const query = {userId: userId};
        return this.findOne(query);
    }

    getCartById(id) {
        const query = {_id: id};
        return this.findOne(query);
    }
}

module.exports = { getInst: () => new CartModel() };