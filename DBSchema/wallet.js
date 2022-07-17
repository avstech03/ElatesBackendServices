const mongoose = require("mongoose");

const wallet = new mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    referalAmount: {
        type: Number,
        default: 0
    },
    generalAmount: {
        type: Number,
        default: 0
    },
    userId: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("wallet", wallet);