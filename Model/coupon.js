const BaseModel = require("./BaseModel");

class CouponModel extends BaseModel {
    constructor() {
        super();
    }

    createCoupon(data) {
        let coupon = {};

        if(data._id) coupon._id = data._id;
        if(data.code) coupon.code = data.code;
        if(data.isExpired) coupon.isExpired = data.isExpired;
        if(data.validFrom) coupon.validFrom = data.validFrom;
        if(data.validTill) coupon.validTill = data.validTill;
        if(data.description) coupon.description = data.description;
        if(data.restrictions) coupon.restrictions = data.restrictions;

        return this.create(coupon);
    }

    updateCouponById(id, data) {
        let coupon = {}, query = {_id: id};

        if(data.code) coupon.code = data.code;
        if(data.isExpired) coupon.isExpired = data.isExpired;
        if(data.validFrom) coupon.validFrom = data.validFrom;
        if(data.validTill) coupon.validTill = data.validTill;
        if(data.description) coupon.description = data.description;
        if(data.restrictions) coupon.restrictions = data.restrictions;

        return this.findOneAndUpdate(query, coupon);
    }

    updateCoupon(query, update, unset) {
        let updateSet = {};

        if(update.code) updateSet.code = update.code;
        if(update.isExpired) updateSet.isExpired = update.isExpired;
        if(update.validFrom) updateSet.validFrom = update.validFrom;
        if(update.validTill) updateSet.validTill = update.validTill;
        if(update.description) updateSet.description = update.description;
        if(update.restrictions) updateSet.restrictions = updates.restrictions;

        return this.findOneAndUpdate(query, update, unset);
    }

    getCoupons() {
        return this.find();
    }
    
    getCouponById(id) {
        let query = {_id: id};
        return this.findOne(query);
    }

    getCouponByCode(code) {
        let query = {code: code};
        return this.findOne(query);
    }

    getNonExpiredCoupons() {
        let query = {isExpired: false};
        return this.find(query);
    }

    getExpiredCoupons() {
        let query = {isExpired: true};
        return this.find(query);
    }

    deleteCoupon(id) {
        return this.delete(id);
    }

    getCouponByCode(code) {
        return this.findOne({code});
    }
}

module.exports = { getInst: () => new CouponModel() };