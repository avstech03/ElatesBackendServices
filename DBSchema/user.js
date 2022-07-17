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

const user = new mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    username: {
        type: String
    },
    password: {
        type: String
    },
    email: {
        type: String
    },
    phoneNumber: {
        type: String
    },
    referalCode: {
        type: String
    },
    type: {
        type: String,
        default: "enduser",
        enum: ["admin", "enduser"]
    },
    address: address,
    membershipObtained: {
        type: Boolean
    },
    isMemberShipValidTill: {
        type: Date,
    },
    isMembershipExpired: {
        type: Boolean,
        default: true
    },
    iv: {
        type: String
    },
    walletAmount: {
        type: Number,
        default: 0
    }
});
    
module.exports = mongoose.model("user", user);

