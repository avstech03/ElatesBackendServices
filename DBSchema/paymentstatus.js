const mongoose = require("mongoose");

const paymentStatus = new mongoose.Schema({
    _id: {
        type: String,
        require: true
    },
    status: {
        type: String,
        require: true,
        enum: ["inprogress", "failed", "success"],
        default: "inprogress"
    },
    paymentOrderId: {
        type: String,
        require: true
    }
});

module.exports = new mongoose.model("paymentstatus", paymentStatus);