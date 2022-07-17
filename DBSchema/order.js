const mongoose = require("mongoose");

    const address = new mongoose.Schema({
        HnoStreet: {
            type: String
        },
        cs: {
            type: String
        },
        
        pincode: {
            type: String
        },
        landmark: {
            type: String
        }
    });

    const order = new mongoose.Schema({
        _id: {
            type: String,
            required: true
        },
        userId: {
            type: String,
            required: true
        },
        deliveryAddress: address,
        paymentMode: {
            type: String,
            enum: ["cod", "online", "referalwallet", "generalwallet"]
        },
        time: {
            type: Date,
            required: true,
            default: Date.now
        },
        status: {
            type: String,
            required: true,
            default: "placed",
            enum: ["placed", "dispatched", "shipped", "delivered", "cancelled"]
        },
        multipleOrderStatus: {
            type: String,
            default: "resume",
            enum: ["resume", "pause"]
        },
        cart: {
            type: Object,
        },
        nextDeliveryOn: {
            type: Date
        }
    });

    module.exports = mongoose.model("order", order);