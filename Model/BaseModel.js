const Promise = require("bluebird");
const CryptoService = require("../services/cryptoservice");
const generateId = require("../services/generateId");

class BaseModel {
  constructor() {
    this.needEncryption = false;
  }

  encrypt(data) {
    const CryptoServiceInst = CryptoService.getInst(this.encryptFields);
    return Promise.resolve(CryptoServiceInst.encrypt(data));
  }

  decrypt(data) {
    const CryptoServiceInst = CryptoService.getInst(this.encryptFields);
    return Promise.resolve(CryptoServiceInst.decrypt(data));
  }

  create(data) {
    if (!data._id) {
      data._id = generateId(this.modelName);
    }
    if (
      !this.needEncryption &&
      (!this.encryptFields || this.encryptFields.length === 0)
    )
      return this.model(data).save();
    return this.encrypt(data)
      .then((rec) => {
        return this.model(rec).save();
      })
      .then((rec) => {
        return this.decrypt(rec);
      });
  }

  findOne(query, proj, opts) {
    return this.model.findOne(query, proj, opts).then((rec) => {
      if (rec) rec = rec.toObject(rec);
      else return Promise.resolve();
      if (rec && rec.iv) return this.decrypt(rec);
      return Promise.resolve(rec);
    });
  }

  find(query, proj, opts) {
    let findP = this.model.find(query, proj);
    if (opts) {
      if (opts.sort) findP = findP.sort(opts.sort);
      if (opts.skip) findP = findP.skip(opts.skip);
      if (opts.limit) findP = findP.limit(opts.limit);
    }
    console.log("Sunny@@      ", query);
    return findP.then((recs) => {
      return Promise.map(recs, (rec) => {
        if (rec.iv) return this.decrypt(rec);
        return Promise.resolve(rec.toObject(rec));
      });
    });
  }

  findOneAndUpdate(query, update, unset, options) {
    let updateSet = {
      $set: {},
      $unset: {},
    };
    let opts = options || {};
    if (update) updateSet["$set"] = update;
    if (unset) updateSet["$unset"] = unset;
    return this.model.findOneAndUpdate(query, updateSet, opts);
  }

  delete(id) {
    return this.model.findByIdAndRemove({ _id: id });
  }
}

module.exports = BaseModel;
