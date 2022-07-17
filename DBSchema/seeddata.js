const mongoose = require("mongoose");

const seedata = new mongoose.Schema({
  _id: String,
  membership: Object,
  FAQ: Object,
  validpincodes: Array,
  minimumcartvaluetouse: Number,
  deliveryCharges: Number,
  supportdetails: Object,
  aboutus: Array,
  supportinfo: Array,
  privacypolicy: Array,
  termsandconditions: Array,
});

module.exports = new mongoose.model("seeddata", seedata);
