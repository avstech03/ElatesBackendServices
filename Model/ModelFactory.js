const mongoose = require("mongoose");

module.exports = {
    "user": () => {
        const ModelInstance = require("./user").getInst();
        ModelInstance.model = require("../DBSchema/user");
        ModelInstance.modelName = "user";
        return ModelInstance;
    },
    "product": () => {
        const ModelInstance = require("./product").getInst();
        ModelInstance.model = require("../DBSchema/product");
        ModelInstance.modelName = "product";
        return ModelInstance;
    },
    "order": () => {
        const ModelInstance = require("./order").getInst();
        ModelInstance.model = require("../DBSchema/order");
        ModelInstance.modelName = "order";
        return ModelInstance;
    },
    "category": () => {
        const ModelInstance = require("./category").getInst();
        ModelInstance.model = require("../DBSchema/category");
        ModelInstance.modelName = "category";
        return ModelInstance;
    },
    "offers": () => {
        const ModelInstance = require("./offers").getInst();
        ModelInstance.model = require("../DBSchema/offers");
        ModelInstance.modelName = "offers";
        return ModelInstance;
    },
    "coupon": () => {
        const ModelInstance = require("./coupon").getInst();
        ModelInstance.model = require("../DBSchema/coupon");
        ModelInstance.modelName = "coupon";
        return ModelInstance;
    },
    "wallet": () => {
        const ModelInstance = require("./wallet").getInst();
        ModelInstance.model = require("../DBSchema/wallet");
        ModelInstance.modelName = "wallet";
        return ModelInstance;
    },
    "homescreentemplate": () => {
        const ModelInstance = require("./homescreentemplate").getInst();
        ModelInstance.model = require("../DBSchema/homescreentemplate");
        ModelInstance.modelName = "homescreentemplate";
        return ModelInstance;
    },
    "seeddata": () => {
        const ModelInstance = require("./seeddata").getInst();
        ModelInstance.model = require("../DBSchema/seeddata");
        ModelInstance.modelName = "seeddata";
        return ModelInstance; 
    },
    "cart": () => {
        const ModelInstance = require("./cart").getInst();
        ModelInstance.model = require("../DBSchema/cart");
        ModelInstance.modelName = "cart";
        return ModelInstance;
    },
    "paymentstatus": () => {
        const ModelInstance = require("./paymentstatus").getInst();
        ModelInstance.model = require("../DBSchema/paymentstatus");
        ModelInstance.modelName = "paymentstatus";
        return ModelInstance;
    }
};