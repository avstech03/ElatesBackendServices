const mongoose = require("mongoose");

const product = new mongoose.Schema({
    productId: String,
    count: Number,
    quantity: String,
    sellingPrice: Number,
    specialPrice: Number
});

const membership = new mongoose.Schema({
    planName: String,
    price: Number
});

const cart = new mongoose.Schema({
    _id: {
        type: String,
        require: true
    },
    products: {
        type: [product],
        default: []
    },
    membership: membership,
    amount: {
        type: Number,
        default: 0
    },
    deliveryCharges: {
        type: Number,
        default: 0
    },
    userId: {
        type: String,
        required: true
    },
    coupon: {
        type: String,
        default: ""
    },
    discount: {
        type: Number,
        default: 0
    },
    deliveryType: {
        type: String,
        enum: ['single', 'multiple'],
        default: 'single'
    },
    from: {
        type: Date,
    },
    to: {
        type: Date,
    },
    slot: {
        type: String,
        enum: ['1', '2', '3', '4'],
        default: '1'
    },
    deliveryDate: {
        type: Date
    },
    frequency: {
        type: Number,
        default: 1
    }
});

module.exports = new mongoose.model("cart", cart);