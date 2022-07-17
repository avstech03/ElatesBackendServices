const ModelFactory = require("../Model/ModelFactory");
const validator = require("../Services/validations");
const Promise = require("bluebird");
const codes = require("../config/codes.json");
const config = require("../config/serverconfig.json");
const utils = require("../Services/utils");
const request = Promise.promisify(require("request"));
const redisUtils = require("../Services/RedisClient/redisUtils");
const jwt = require("jsonwebtoken");
const moment = require("moment");

class UserService {
  constructor() {
    this.model = ModelFactory.user();
  }

  /*  ===  USER  ===  */

  generateOTP(phoneNumber) {
    const generateRandomOTP = () => Math.floor(Math.random() * 1000) + 1000;
    if (!validator.isValidPhoneNumber(phoneNumber))
      return Promise.reject("INVALID_PHONE_NUMBER");

    return new Promise((resolve, reject) => {
      const OTP = generateRandomOTP();
      let queryParams = config.sms.queryparams;
      queryParams.numbers = [phoneNumber];
      queryParams.message = `${OTP} ${config.sms.loginMessageTemplate}`;
      const uri = `${config.sms.uri}?${utils.getQueryString(queryParams)}`;
      const method = config.sms.method;

      request({
        uri: uri,
        method: method,
      }).then((res) => {
        if (res.statusCode !== 200) return reject("FAILED_TO_SEND_OTP");
        return redisUtils
          .pushToRedis(OTP, phoneNumber)
          .then(() =>
            redisUtils.expireFromRedis(phoneNumber, config.otp.shouldExpireIn)
          )
          .then(() => {
            resolve(codes["OTP_SENT_SUCCESSFULLY"]);
          });
      });
    });
  }

  verifyOTP(phoneNumber, otp) {
    const cartModel = ModelFactory.cart();

    if (!validator.isValidPhoneNumber(phoneNumber))
      return Promise.reject("INVALID_PHONE_NUMBER");
    return redisUtils.getFromRedis(phoneNumber).then((res) => {
      if (res) res = res.toString();
      if (otp === res) {
        return this.model.getUserByPhoneNumber(phoneNumber).then((user) => {
          if (user) {
            const token = jwt.sign(
              { userId: user._id, type: "enduser" },
              config.appserver.privateKey
            );
            return Promise.resolve({
              token,
              user,
            });
          } else {
            const userInfo = {
              phoneNumber: phoneNumber,
              type: "enduser",
              membershipObtained: false,
            };
            return this.model
              .createUser(userInfo)
              .tap((res) => {
                let cart = {
                  userId: res._id,
                  products: [],
                  membership: {},
                  amount: 0,
                  deliveryCharges: 0,
                };
                return cartModel.createCart(cart);
              })
              .then((res) => {
                if (!res) return Promise.reject("FAILED_TO_CREATE_USER");
                const token = jwt.sign(
                  { userId: res._id, type: "enduser" },
                  config.appserver.privateKey
                );
                return Promise.resolve({
                  token,
                  user: res,
                });
              });
          }
        });
      } else return Promise.reject("INVALID_OTP");
    });
  }

  updateUserPersonalDetails(userId, body) {
    return this.model.updateUserById(userId, body);
  }

  /*  ===  ADMIN  ===  */

  addNewAdmin(data) {
    const username = data.username;
    return this.model.getUserByUserName(username).then((user) => {
      if (user) return Promise.reject("ERR_DUPLICATE_USERNAME");
      const userInfo = {
        username: username,
        password: data.password,
        type: "admin",
      };
      return this.model.createUser(userInfo).then((res) => {
        if (!res) Promise.reject("FAILED_TO_CREATE_USER");
        const token = jwt.sign(
          { userId: res._id, type: "admin" },
          config.appserver.privateKey
        );
        return {
          token,
          user: res,
        };
      });
    });
  }

  adminLogin(username, password) {
    return this.model.getUserByUserName(username).then((user) => {
      if (!user) return Promise.reject("LOGIN_FAILED");
      if (user.password !== password) return Promise.reject("LOGIN_FAILED");
      const token = jwt.sign(
        { userId: user._id, type: "admin" },
        config.appserver.privateKey
      );
      return {
        token,
        user,
      };
    });
  }

  getUserInfo(userId) {
    if (!userId) return Promise.reject("MISSING_REQ_FIELDS");
    return this.model.getUserById(userId);
  }
}

UserService.prototype.getAllEndUsers = function (queryParams) {
  const self = this;
  return self.model.getAllEndUsers(queryParams);
};

UserService.prototype.addAmountToUserWallet = function (userId, walletAmount) {
  const self = this;
  if (walletAmount) {
    return self.model.getUserById(userId).then((user) => {
      if (!user) Promise.reject("USER_NOT_FOUND");
      let updatedWalletAmount =
        parseInt(user.walletAmount) + parseInt(walletAmount);
      return self.model.updateUserById(userId, {
        walletAmount: updatedWalletAmount,
      });
    });
  }
};

UserService.prototype.addMemberShip = function (plan, userId) {
  const self = this;
  let updateSet = { membershipObtained: true };
  let currentDate = moment();
  if (plan === "Monthly")
    updateSet.isMemberShipValidTill = currentDate.add(30, "days").format();
  else if (plan === "Quarterly")
    updateSet.isMemberShipValidTill = currentDate.add(90, "days").format();
  else if (plan === "HalfYearly")
    updateSet.isMemberShipValidTill = currentDate.add(180, "days").format();
  else if (plan === "Yearly")
    updateSet.isMemberShipValidTill = currentDate.add(365, "days").format();
  console.log("Sunny@@        updateset!!!!!!!        ", updateSet);
  return self.model.updateUserById(userId, updateSet);
};

UserService.prototype.updateMembershipDetails = function (userId) {
  const self = this;
  return self.model.getUserById(userId).then((user) => {
    if (user && user.membershipObtained) {
      if (moment() > moment(user.isMemberShipValidTill)) {
        return self.model.updateUserById(userId, { membershipObtained: false });
      }
      return Promise.resolve({});
    }
    return Promise.resolve({});
  });
};

module.exports = {
  getInst: () => new UserService(),
};
