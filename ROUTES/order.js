const serviceHandler = require("../Services/servicehandler").serviceHandler;
const BuilderService = require("../Service/BuilderService");
const Promise = require("bluebird");
const _ = require("lodash");
const codes = require("../config/codes.json");
const config = require("../config/serverconfig.json");

const createOrder = (req, res) => {
  const serviceInst = BuilderService["orderService"];
  let body = req.body;
  let userId = req.params.userId;
  req.ApiId = "createOrder";
  return serviceHandler(req, res, serviceInst.createOrder(body, userId));
};

const getOrders = (req, res) => {
  const serviceInst = BuilderService["orderService"];
  let userId = req.params.userId;
  return serviceHandler(req, res, serviceInst.getOrders(userId));
};

const getOrdersForAdmin = (req, res) => {
  const serviceInst = BuilderService["orderService"];
  return serviceHandler(req, res, serviceInst.getOrdersForAdmin(req.query));
};

const editOrder = (req, res) => {
  const serviceInst = BuilderService["orderService"];
  const orderId = req.params.orderId;
  let body = req.body;
  if (!orderId || !body) return Promise.reject("MISSING_RESOURCE");
  return serviceHandler(req, res, serviceInst.editOrder(orderId, body));
};

module.exports = (app) => {
  /* ADMIN APIS */
  app.get(`${config.api.admin}/order`, (req, res) =>
    getOrdersForAdmin(req, res)
  );
  app.put(`${config.api.admin}/order/:orderId`, (req, res) =>
    editOrder(req, res)
  );

  /* USER APIS */
  app.post(`${config.api.user}/order`, (req, res) => createOrder(req, res));
  app.get(`${config.api.user}/order`, (req, res) => getOrders(req, res));
  app.put(`${config.api.user}/order/:orderId`, (req, res) =>
    editOrder(req, res)
  );
};
