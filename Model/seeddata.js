const BaseModel = require("./BaseModel");

class SeedDataModel extends BaseModel {
  constructor() {
    super();
  }

  createdOrUpdateSeedData(data) {
    let query = {};
    if (data._id) query._id = data._id;
    return this.findOneAndUpdate(query, data, null, { upsert: true });
  }

  getSeedData() {
    return this.findOne();
  }
}

module.exports = {
  getInst: () => new SeedDataModel(),
};
