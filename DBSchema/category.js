const mongoose = require("mongoose");

const category = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
  },
  description: {
    type: String,
  },
  pic: {
    type: String,
    // required: true
  },
  isMainCategory: {
    type: Boolean,
    required: true,
    default: false,
  },
});

module.exports = mongoose.model("category", category);
