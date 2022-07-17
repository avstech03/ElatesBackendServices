const mongoose = require("mongoose");

    const quantity = new mongoose.Schema({
        value: String,
        units: {
            type: String,
            enum: ["ml", "l", "gm", "kg"]
        },
        availableQuantity: {
            type: Number,
            required: true
        },
        mrp: {
            type: Number,
            required: true
        },
        sellingPrice: {
            type: Number,
            required: true
        },
        membershipPrice: {
            type: Number,
            required: true
        }
    });

    const product = new mongoose.Schema({
        _id: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        brand: {
            type: String,
            required: true
        },
        category: {
            type: String,
            required: true
        },
        quantity: [quantity],
        pic: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        isMultipleDeliveryAvailable: {
            type: Boolean,
            required: true,
            default: false
        },
        maxQuantity: {
            type: Number,
            required: true
        },
    });

    module.exports = mongoose.model("product", product);