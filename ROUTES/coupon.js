const serviceHandler = require("../Services/servicehandler").serviceHandler;
const BuilderService = require("../Service/BuilderService");
const Promise = require("bluebird");
const _ = require("lodash");
const codes = require("../config/codes.json");
const config = require("../config/serverconfig.json");

const createCoupon = (req, res) => {
  const serviceInst = BuilderService["couponService"];
  let body = req.body;
  req.ApiId = "createcoupon";
  return serviceHandler(req, res, serviceInst.createCoupon(body));
};

const getCoupons = (req, res) => {
  const serviceInst = BuilderService["couponService"];
  return serviceHandler(req, res, serviceInst.getCoupons());
};

const editCoupon = (req, res) => {
  const serviceInst = BuilderService["couponService"];
  const couponId = req.params.couponId;
  let body = req.body;
  req.ApiId = "editCoupon";
  if (!body || !couponId) return Promise.reject("MISSING_RESOURCE");
  return serviceHandler(req, res, serviceInst.editCoupon(couponId, body));
};

const getCouponById = (req, res) => {
  const serviceInst = BuilderService["couponService"];
  const couponId = req.params.couponId;
  return serviceHandler(req, res, serviceInst.getCouponById(couponId));
};

const deleteCoupon = (req, res) => {
  const serviceInst = BuilderService["couponService"];
  const couponId = req.params.couponId;
  if (!couponId) return Promise.reject("MISSING_RESOURCE");
  return serviceHandler(req, res, serviceInst.deleteCoupon(couponId));
};

const getCouponByCode = (req, res) => {
  const serviceInst = BuilderService["couponService"];
  const code = req.params.code;
  if (!code) return Promise.reject("MISSING_RESOURCE");
  return serviceHandler(req, res, serviceInst.getCouponByCode(code));
};

module.exports = (app) => {
  /* ADMIN APIS */
  app.post(`${config.api.admin}/coupon`, (req, res) => createCoupon(req, res));
  app.get(`${config.api.admin}/coupon`, (req, res) => getCoupons(req, res));
  app.put(`${config.api.admin}/coupon/:couponId`, (req, res) =>
    editCoupon(req, res)
  );
  app.get(`${config.api.admin}/coupon/:couponId`, (req, res) =>
    getCouponById(req, res)
  );
  app.delete(`${config.api.admin}/coupon/:couponId`, (req, res) =>
    deleteCoupon(req, res)
  );

  /* USER APIS */
  app.get(`${config.api.user}/coupon`, (req, res) => getCoupons(req, res));
  app.get(`${config.api.user}/coupon/:code`, (req, res) =>
    getCouponByCode(req, res)
  );
};
