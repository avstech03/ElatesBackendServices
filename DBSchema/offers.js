const mongoose = require("mongoose");

const offers = new mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    isExpired: {
        type: Boolean,
        default: false,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    pic: {
        type: String,
        required: true
    },
    offerValue: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model("offers", offers);