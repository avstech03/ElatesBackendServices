const mongoose = require("mongoose");

const restrictions = new mongoose.Schema({
    priceMoreThan: {
        type: Number,
        required: true
    },
    maximumDiscount: {
        type: Number,
        required: true
    },
    discountPercent: {
        type: Number,
        required: true
    }
});

const coupon = new mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    restrictions: restrictions
});

module.exports = new mongoose.model("coupon", coupon);