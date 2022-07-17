const mongoose = require("mongoose");

const template = new mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    template: {
        type: Object,
        required: true
    }
});

module.exports = new mongoose.model("homescreentemplate", template);