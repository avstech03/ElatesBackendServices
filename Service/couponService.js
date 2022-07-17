const ModelFactory = require("../Model/ModelFactory");
const Promise      = require("bluebird");

class CouponService {
    constructor() {
        this.model = ModelFactory.coupon();
    }

    createCoupon(coupon) {
        return this.model.createCoupon(coupon);
    }

    editCoupon(couponId, coupon) {
        return this.model.updateCouponById(couponId, coupon);
    }

    getCoupons() {
        return this.model.getCoupons();
    }

    getCouponById(couponId) {
        return this.model.getCouponById(couponId);
    } 

    deleteCoupon(couponId) {
        return this.model.deleteCoupon(couponId);
    }

    getCouponByCode(code) {
        return this.model.getCouponByCode(code);
    }
}

module.exports = {
    getInst: () => new CouponService()
};