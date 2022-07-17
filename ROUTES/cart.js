const serviceHandler = require("../services/servicehandler").serviceHandler;
const BuilderService = require("../Service/BuilderService");
const Promise = require("bluebird");
const _ = require("lodash");
const codes = require("../config/codes.json");
const config = require("../config/serverconfig.json");

const getCart = (req, res) => {
  const serviceInst = BuilderService["cartService"];
  const userId = req.params.userId;
  if (!userId) return Promise.reject("MISSING_RESOURCE");
  serviceHandler(req, res, serviceInst.getCart(userId));
};

const addProductToCart = (req, res) => {
  const serviceInst = BuilderService["cartService"];
  const userId = req.params.userId;
  const cartId = req.params.cartId;
  const product = req.body;
  if (!userId || !cartId) return Promise.reject("MISSING_RESOURCE");
  serviceHandler(
    req,
    res,
    serviceInst.addProductToCart(userId, cartId, product)
  );
};

const addMembershipToCart = (req, res) => {
  const serviceInst = BuilderService["cartService"];
  const userId = req.params.userId;
  const cartId = req.params.cartId;
  const membership = req.body;
  if (!userId || !cartId || !membership)
    return Promise.reject("MISSING_RESOURCE");
  serviceHandler(
    req,
    res,
    serviceInst.addMembershipToCart(userId, cartId, membership)
  );
};

const removeProductFromCart = (req, res) => {
  const serviceInst = BuilderService["cartService"];
  const userId = req.params.userId;
  const cartId = req.params.cartId;
  const product = req.body;
  if (!userId || !cartId) return Promise.reject("MISSING_RESOURCE");
  serviceHandler(
    req,
    res,
    serviceInst.removeProductFromCart(userId, cartId, product)
  );
};

const applyCoupon = (req, res) => {
  const serviceInst = BuilderService["cartService"];
  const userId = req.params.userId;
  const couponCode = req.query.coupon;
  const cartId = req.params.cartId;
  if (!userId || !couponCode || !cartId)
    return Promise.reject("MISSING_RESOURCE");
  serviceHandler(req, res, serviceInst.applyCoupon(userId, cartId, couponCode));
};

const removeCoupon = (req, res) => {
  const serviceInst = BuilderService["cartService"];
  const userId = req.params.userId;
  const cartId = req.params.cartId;
  if (!userId || !cartId) return Promise.reject("MISSING_RESOURCE");
  serviceHandler(req, res, serviceInst.removeCoupon(userId, cartId));
};

const saveMultipleOrder = (req, res) => {
  const serviceInst = BuilderService["cartService"];
  const userId = req.params.userId;
  const cartId = req.params.cartId;
  const body = req.body;
  if (!userId || !cartId || !body) return Promise.reject("MISSING_RESOURCE");
  serviceHandler(req, res, serviceInst.saveMultipleOrder(userId, cartId, body));
};

const removeMembershipFromCart = (req, res) => {
  const serviceInst = BuilderService["cartService"];
  const userId = req.params.userId;
  const cartId = req.params.cartId;
  if (!userId || !cartId) return Promise.reject("MISSING_RESOURCE");
  serviceHandler(
    req,
    res,
    serviceInst.removeMembershipFromCart(userId, cartId)
  );
};

const saveSingleOrder = (req, res) => {
  const serviceInst = BuilderService["cartService"];
  const userId = req.params.userId;
  const cartId = req.params.cartId;
  const body = req.body;
  if (!userId || !cartId || !body) return Promise.reject("MISSING_RESOURCE");
  serviceHandler(req, res, serviceInst.saveSingleOrder(userId, cartId, body));
};

const createOrderForRazorPay = (req, res) => {
  const serviceInst = BuilderService["cartService"];
  const userId = req.params.userId;
  const body = req.body;
  if (!userId || !body) return Promise.reject("MISSING_RESOURCE");
  serviceHandler(req, res, serviceInst.createOrderForRazorPay(userId, body));
};

const getPaymentStatus = (req, res) => {
  const serviceInst = BuilderService["cartService"];
  const userId = req.params.userId;
  const paymentOrderId = req.params.paymentOrderId;
  if (!userId || !paymentOrderId) return Promise.reject("MISSING_RESOURCE");
  serviceHandler(
    req,
    res,
    serviceInst.getPaymentStatus(userId, paymentOrderId)
  );
};

const verifyRazorPayPaymentSuccess = (req, res) => {
  const serviceInst = BuilderService["cartService"];
  const body = req.body;
  serviceHandler(req, res, serviceInst.verifyRazorPayPaymentSuccess(body));
};

const verifyRazorPayPaymentFailed = (req, res) => {
  const serviceInst = BuilderService["cartService"];
  const body = req.body;
  serviceHandler(req, res, serviceInst.verifyRazorPayPaymentFailed(body));
};

module.exports = (app) => {
  /* USER APIS */
  app.get(`${config.api.user}/cart`, (req, res) => getCart(req, res));
  app.put(`${config.api.user}/cart/:cartId/addproducttocart`, (req, res) =>
    addProductToCart(req, res)
  );
  app.put(`${config.api.user}/cart/:cartId/addmembershiptocart`, (req, res) =>
    addMembershipToCart(req, res)
  );
  app.put(`${config.api.user}/cart/:cartId/removeproductfromcart`, (req, res) =>
    removeProductFromCart(req, res)
  );
  app.put(`${config.api.user}/cart/:cartId/applycoupon`, (req, res) =>
    applyCoupon(req, res)
  );
  app.get(`${config.api.user}/cart/:cartId/removecoupon`, (req, res) =>
    removeCoupon(req, res)
  );
  app.put(`${config.api.user}/cart/:cartId/savemultipleorder`, (req, res) =>
    saveMultipleOrder(req, res)
  );
  app.put(`${config.api.user}/cart/:cartId/savesingleorder`, (req, res) =>
    saveSingleOrder(req, res)
  );
  app.get(
    `${config.api.user}/cart/:cartId/removemembershipfromcart`,
    (req, res) => removeMembershipFromCart(req, res)
  );

  /* RAZOR PAY */
  app.post(`${config.api.user}/razorpay`, (req, res) =>
    createOrderForRazorPay(req, res)
  );
  app.get(`${config.api.user}/paymentstatus/:paymentOrderId`, (req, res) =>
    getPaymentStatus(req, res)
  );
  app.post(`/razorpay/verify/success`, (req, res) =>
    verifyRazorPayPaymentSuccess(req, res)
  );
  app.post(`/razorpay/verify/failed`, (req, res) =>
    verifyRazorPayPaymentFailed(req, res)
  );
};
