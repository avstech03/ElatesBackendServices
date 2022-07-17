const order = require("../DBSchema/order");
const BaseModel = require("./BaseModel");
const Promise = require('bluebird');

class OrderModel extends BaseModel {
    constructor() {
        super();
    }

    createOrder(data) {
        let order = {};

        if(data._id) order._id = data._id;
        if(data.userId) order.userId = data.userId;
        if(data.deliveryAddress) order.deliveryAddress = data.deliveryAddress;
        if(data.paymentMode) order.paymentMode = data.paymentMode;
        if(data.time) order.time = data.time;
        if(data.status) order.status = data.status;
        if(data.nextDeliveryOn) order.nextDeliveryOn = data.nextDeliveryOn;
        if(data.cart) order.cart = data.cart;

        return this.create(order);
    }

updateOrderById(id, data) {
        let order = {}, query = {_id: id};

        if(data.userId) order.userId = data.userId;
        if(data.deliveryAddress) order.deliveryAddress = data.deliveryAddress;
        if(data.paymentMode) order.paymentMode = data.paymentMode;
        if(data.time) order.time = data.time;
        if(data.status) order.status = data.status;
        if(data.nextDeliveryOn) order.nextDeliveryOn = data.nextDeliveryOn;
        if(data.multipleOrderStatus) order.multipleOrderStatus = data.multipleOrderStatus;
        if(data.cart) order.cart = data.cart;

        return this.findOneAndUpdate(query, order);
    }

    updateOrder(query, update, unset) {
        let updateSet = {};

        if(data.userId) order.userId = data.userId;
        if(data.deliveryAddress) order.deliveryAddress = data.deliveryAddress;
        if(data.paymentMode) order.paymentMode = data.paymentMode;
        if(data.time) order.time = data.time;
        if(data.status) order.status = data.status;
        if(data.nextDeliveryOn) order.nextDeliveryOn = data.nextDeliveryOn;
        if(data.multipleOrderStatus) order.multipleOrderStatus = data.multipleOrderStatus;
        if(data.cart) order.cart = data.cart;

        return this.findOneAndUpdate(query, updateSet);
    }

    getOrderById(id) {
        let query = {_id: id};
        
        return Promise.resolve(this.findOne(query));
    }

    getOrdersByUserId(userId) {
        let query = {userId: userId};
        let opts = {
            sort: {
                time: -1,
            }
        };
        return this.find(query, {}, opts);
    }
    
    getOrdersByStatus(status) {
        let query = {status: status};
        return this.find(query);
    }
}

OrderModel.prototype.getOrdersForAdmin = function(query, projection, options) {
    const self = this;
    let matchCnd = {};
    let proj = projection || {};
    let opts = {
        sort: {
            time: -1,
        }
    }

    if(query) {
        if(query.from && query.to) matchCnd.time = {
            $gte: new Date(query.from),
            $lte: new Date(query.to)
        }
        if(query.status) matchCnd.status = query.status;
        if(query.type) matchCnd["cart.deliveryType"] = query.type;
        if(query.userId) matchCnd.userId = query.userId;
    }

    return self.find(matchCnd, proj, opts);
}

module.exports = { getInst: () => new OrderModel() };