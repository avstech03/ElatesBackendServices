const ModelFactory = require("../Model/ModelFactory");
const validator = require("../Services/validations");
const Promise = require("bluebird");
const codes = require("../config/codes.json");
const config = require("../config/serverconfig.json");
const utils = require("../Services/utils");
const request = Promise.promisify(require("request"));
const redisUtils = require("../Services/RedisClient/redisUtils");
const jwt = require("jsonwebtoken");
const { userService } = require("./BuilderService");

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
      queryParams.message = OTP;
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
            return this.model.createUser(userInfo).then((res) => {
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
      console.log("Sunny@@   ", user.password, password);
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

module.exports = {
  getInst: () => new UserService(),
};
