const serviceHandler = require("../Services/servicehandler").serviceHandler;
const BuilderService = require("../Service/BuilderService");
const Promise = require("bluebird");
const _ = require("lodash");
const codes = require("../config/codes.json");
const config = require("../config/serverconfig.json");

/* USER */

const generateOTP = (req, res) => {
  const serviceInst = BuilderService["userService"];
  const phoneNumber = req.query.phoneNumber;
  if (!phoneNumber)
    return Promise.reject(codes["MISSING_REQ_FIELDS_IN_QUERY_PARAMS"]);
  return serviceHandler(req, res, serviceInst.generateOTP(phoneNumber));
};

const updateUserPersonalDetails = (req, res) => {
  const serviceInst = BuilderService["userService"];
  const userId = req.params.userId;
  req.ApiId = "updateuserdetails";
  let body = req.body;
  return serviceHandler(
    req,
    res,
    serviceInst.updateUserPersonalDetails(userId, body)
  );
};

const verifyOTP = (req, res) => {
  const serviceInst = BuilderService["userService"];
  const phoneNumber = req.query.phoneNumber;
  const otp = req.query.otp;
  if (!phoneNumber || !otp)
    return Promise.reject(codes["MISSING_REQ_FIELDS_IN_QUERY_PARAMS"]);
  return serviceHandler(req, res, serviceInst.verifyOTP(phoneNumber, otp));
};

const getUserInfo = (req, res) => {
  const serviceInst = BuilderService["userService"];
  const userId = req.params.userId;
  return serviceHandler(req, res, serviceInst.getUserInfo(userId));
};

/* ADMIN */

const adminLogin = (req, res) => {
  const serviceInst = BuilderService["userService"];
  const username = req.query.username;
  const password = req.query.password;
  if (!username || !password)
    return Promise.reject("MISSING_REQ_FIELDS_IN_QUERY_PARAMS");
  return serviceHandler(req, res, serviceInst.adminLogin(username, password));
};

const addNewAdmin = (req, res) => {
  const serviceInst = BuilderService["userService"];
  req.ApiId = "addadmin";
  let body = req.body;
  return serviceHandler(req, res, serviceInst.addNewAdmin(body));
};

const getAllUsers = (req, res) => {
  const serviceInst = BuilderService["userService"];
  req.ApiId = "getAllUsers";
  return serviceHandler(req, res, serviceInst.getAllEndUsers(req.query));
};

const addAmountToUserWallet = (req, res) => {
  const serviceInst = BuilderService["userService"];
  req.ApiId = "addAmountToWallet";
  const endUserId = req.params.endUserId;
  const walletAmount = req.query.walletAmount;
  serviceHandler(
    req,
    res,
    serviceInst.addAmountToUserWallet(endUserId, walletAmount)
  );
};

const addMemberShip = (req, res) => {
  const serviceInst = BuilderService["userService"];
  const plan = req.query.plan;
  const userId = req.params.userId;
  serviceHandler(req, res, serviceInst.addMemberShip(plan, userId));
};

const updateMembershipDetails = (req, res) => {
  const serviceInst = BuilderService["userService"];
  const userId = req.params.userId;
  serviceHandler(req, res, serviceInst.updateMembershipDetails(userId));
};

module.exports = (app) => {
  /* USER APIS */
  app.get("/elates/generateOTP", (req, res) => generateOTP(req, res));
  app.get("/elates/verifyOTP", (req, res) => verifyOTP(req, res));
  app.put("/elates/api/users/:userId", (req, res) =>
    updateUserPersonalDetails(req, res)
  );
  app.get(`${config.api.user}/addMembership`, (req, res) =>
    addMemberShip(req, res)
  );
  app.get(`${config.api.user}/updateMembershipDetails`, (req, res) =>
    updateMembershipDetails(req, res)
  );

  /* ADMIN APIS */
  app.get("/elates/admin/login", (req, res) => adminLogin(req, res));
  app.post("/elates/api/admin/:userId/addAdmin", (req, res) =>
    addNewAdmin(req, res)
  );
  app.get(`${config.api.user}`, (req, res) => getUserInfo(req, res));
  app.get(`${config.api.admin}/users`, (req, res) => getAllUsers(req, res));
  app.get(`${config.api.admin}/addAmountToWallet/:endUserId`, (req, res) =>
    addAmountToUserWallet(req, res)
  );

  /* SUPER ADMIN APIS */
  app.post("/elates/superadmin", (req, res) => addNewAdmin(req, res));
};
