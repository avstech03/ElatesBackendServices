const ModelFactory = require("../Model/ModelFactory");
const Promise = require("bluebird");
const { PromiseProvider } = require("mongoose");
const seeddata = require("../Model/seeddata");
const _ = require("lodash");
const moment = require("moment");
const Razorpay = require("razorpay");
const config = require("../config/serverconfig.json");
const generateId = require("../Services/generateId");
const { parse } = require("uuid");
const crypto = require("crypto");

const razonpayInstance = new Razorpay({
  key_id: config.razorpay.key_id,
  key_secret: config.razorpay.key_secret,
});

const calculateMultipleOrderPrice = (amount, from, to, frequency) => {
  let fromDate = moment(from);
  let toDate = moment(to);
  let diff = toDate.diff(fromDate, "days");
  let noOfOrders = parseInt(diff / frequency) + 1;
  return amount * noOfOrders;
};

class CartService {
  constructor() {
    this.model = ModelFactory.cart();
  }

  getCart(userId) {
    return this.model.getCartByUserId(userId);
  }

  calculateCart(cart, membershipObtained) {
    const couponModel = ModelFactory.coupon();
    const seedDataModel = ModelFactory.seeddata();
    const getSeedDataP = seedDataModel.getSeedData();
    let getCouponP = Promise.resolve({});
    if (cart.coupon) getCouponP = couponModel.getCouponByCode(cart.coupon);
    return Promise.join(getCouponP, getSeedDataP).spread((coupon, seedData) => {
      let amount = 0;
      // Calculate product prices
      if (cart.coupon && !coupon) return Promise.reject("INVALID_COUPON");
      if (cart.products && cart.products.length) {
        _.forEach(cart.products, (product) => {
          if (
            membershipObtained ||
            (cart.membership &&
              cart.membership.planName &&
              cart.membership.price)
          )
            amount += product.specialPrice * product.count;
          else amount += product.sellingPrice * product.count;
        });
        if (cart.deliveryType === "multiple") {
          amount = calculateMultipleOrderPrice(
            amount,
            cart.from,
            cart.to,
            cart.frequency
          );
          cart.deliveryCharges = 0;
        } else if (
          !membershipObtained &&
          (!cart.membership ||
            !cart.membership.planName ||
            !cart.membership.price)
        ) {
          amount += seedData.deliveryCharges;
          cart.deliveryCharges = seedData.deliveryCharges;
        }
        if (
          cart.membership &&
          cart.membership.planName &&
          cart.membership.price
        ) {
          amount += parseInt(cart.membership.price);
          cart.deliveryCharges = 0;
        }

        if (
          coupon &&
          coupon.restrictions &&
          coupon.restrictions.priceMoreThan <= amount
        ) {
          let discount = parseInt(
            (amount * coupon.restrictions.discountPercent) / 100
          );
          if (discount > coupon.restrictions.maximumDiscount)
            discount = coupon.restrictions.maximumDiscount;
          amount -= discount;
          cart.discount = discount;
        } else {
          cart.coupon = "";
          cart.discount = 0;
        }
        cart.amount = amount;
        return cart;
      } else {
        cart.amount = 0;
        return cart;
      }
    });
  }

  addProductToCart(userId, cartId, product) {
    const userModel = ModelFactory.user();
    const seedDataModel = ModelFactory.seeddata();
    const getCartP = this.model.getCartByUserId(userId);
    const getUserP = userModel.getUserById(userId);
    const seedDataP = seedDataModel.getSeedData();
    return Promise.join(getCartP, getUserP, seedDataP).spread(
      (cart, user, seedData) => {
        if (cart && cart.products) {
          let productAlreadyExists = false;
          _.forEach(cart.products, (_product) => {
            if (
              _product.productId === product.productId &&
              _product.quantity === product.quantity
            ) {
              productAlreadyExists = true;
              _product.count++;
            }
          });
          if (!productAlreadyExists) {
            cart.products.push(product);
          }
          return this.calculateCart(cart, user.membershipObtained).then(
            (cart) => {
              return this.model.updateCartById(cartId, cart).then((res) => {
                return this.model.getCartByUserId(userId);
              });
            }
          );
        }
      }
    );
  }

  addMembershipToCart(userId, cartId, membership) {
    const seedDataModel = ModelFactory.seeddata();
    const userModel = ModelFactory.user();
    const getCartP = this.model.getCartByUserId(userId);
    const getUserP = userModel.getUserById(userId);
    const seedDataP = seedDataModel.getSeedData();
    return Promise.join(getCartP, getUserP, seedDataP).spread(
      (cart, user, seedData) => {
        if (user.membershipObtained) {
          return Promise.reject("MEMBERSHIP_ALREADY_OBTAINED");
        }
        if (membership) {
          cart.membership = membership;
          return this.calculateCart(cart, user.membershipObtained).then(
            (cart) => {
              return this.model.updateCartById(cartId, cart).then((res) => {
                return this.model.getCartById(cartId);
              });
            }
          );
        }
      }
    );
  }

  removeProductFromCart(userId, cartId, product) {
    const userModel = ModelFactory.user();
    const getCartP = this.model.getCartByUserId(userId);
    const getUserP = userModel.getUserById(userId);
    const seedDataModel = ModelFactory.seeddata();
    const seedDataP = seedDataModel.getSeedData();

    return Promise.join(getCartP, getUserP, seedDataP).spread(
      (cart, user, seedData) => {
        if (cart && cart.products) {
          let removeProduct = false;
          _.forEach(cart.products, (_product) => {
            if (
              _product.productId === product.productId &&
              _product.quantity === product.quantity
            ) {
              _product.count = _product.count - 1;
              if (_product.count <= 0) removeProduct = true;
            }
          });
          if (removeProduct) {
            _.remove(cart.products, {
              productId: product.productId,
              quantity: product.quantity,
            });
          }
          return this.calculateCart(cart, user.membershipObtained).then(
            (cart) => {
              return this.model.updateCartById(cartId, cart).then((res) => {
                return this.model.getCartByUserId(userId);
              });
            }
          );
        }
      }
    );
  }

  applyCoupon(userId, cartId, couponCode) {
    const userModel = ModelFactory.user();
    const getCartP = this.model.getCartByUserId(userId);
    const getUserP = userModel.getUserById(userId);

    return Promise.join(getCartP, getUserP).spread((cart, user) => {
      cart.coupon = couponCode;
      return this.calculateCart(cart, user.membershipObtained).then((cart) => {
        return this.model.updateCartById(cartId, cart).then((res) => {
          return this.model.getCartById(cartId);
        });
      });
    });
  }

  removeCoupon(userId, cartId) {
    const userModel = ModelFactory.user();
    const getCartP = this.model.getCartByUserId(userId);
    const getUserP = userModel.getUserById(userId);

    return Promise.join(getCartP, getUserP).spread((cart, user) => {
      cart.coupon = "";
      cart.discount = 0;
      return this.calculateCart(cart, user.membershipObtained).then((cart) => {
        return this.model.updateCartById(cartId, cart).then((res) => {
          return this.model.getCartById(cartId);
        });
      });
    });
  }

  removeMembershipFromCart(userId, cartId) {
    const userModel = ModelFactory.user();
    const getUserP = userModel.getUserById(userId);
    const getCartP = this.model.getCartByUserId(userId);
    return Promise.join(getCartP, getUserP).spread((cart, user) => {
      cart.membership = {};
      return this.calculateCart(cart, user.membershipObtained).then((cart) => {
        return this.model.updateCartById(cartId, cart).then((res) => {
          return this.model.getCartByUserId(userId);
        });
      });
    });
  }

  saveMultipleOrder(userId, cartId, body) {
    let from = moment(body.from);
    let to = moment(body.to);
    let currentDate = moment();
    if (from < currentDate) {
      return Promise.reject("INVALID_DATE");
    }
    if (to < from) {
      return Promise.reject("INVALID_DATE");
    }
    let diff = to.diff(from, "days") + 1;
    if (body.frequency > diff) return Promise.reject("INVALID_FREQUENCY");
    const userModel = ModelFactory.user();
    const getUserP = userModel.getUserById(userId);
    const getCartP = this.model.getCartByUserId(userId);
    return Promise.join(getCartP, getUserP).spread((cart, user) => {
      cart.deliveryType = "multiple";
      cart.from = from;
      cart.to = to;
      cart.frequency = body.frequency;
      cart.slot = body.slot;
      return this.calculateCart(cart, user.membershipObtained).then((cart) => {
        return this.model.updateCartById(cartId, cart).then((res) => {
          return this.model.getCartByUserId(userId);
        });
      });
    });
  }

  saveSingleOrder(userId, cartId, body) {
    const userModel = ModelFactory.user();
    const getCartP = this.model.getCartByUserId(userId);
    const getUserP = userModel.getUserById(userId);
    const seedDataModel = ModelFactory.seeddata();
    const getSeedDataP = seedDataModel.getSeedData();
    return Promise.join(getCartP, getUserP, getSeedDataP).spread(
      (cart, user, seedData) => {
        cart.deliveryType = "single";
        cart.from = "";
        cart.to = "";
        cart.slot = body.slot;
        cart.frequency = 0;
        if (body.deliveyDate) cart.deliveyDate = body.deliveryDate;
        return this.calculateCart(cart, user.membershipObtained).then(
          (cart) => {
            return this.model.updateCartById(cartId, cart).then((res) => {
              return this.model.getCartByUserId(userId);
            });
          }
        );
      }
    );
  }

  createOrderForRazorPay(userId, body) {
    const paymentStatusModel = ModelFactory.paymentstatus();
    return this.model.getCartByUserId(userId).then((cart) => {
      if (cart) {
        let amount = cart.amount;
        if (amount) {
          if (typeof amount === "string") amount = parseInt(amount);
        }
        return razonpayInstance.orders
          .create({
            amount: amount * 100,
            currency: config.razorpay.currency,
            receipt: generateId("razorpayorder"),
            payment_capture: config.razorpay.payment_capture,
          })
          .then((razorPayOrder) => {
            var obj = {
              paymentOrderId: razorPayOrder.id,
              status: "inprogress",
            };
            return paymentStatusModel.createPaymentStatus(obj).then(() => {
              return {
                amount: razorPayOrder.amount,
                currency: razorPayOrder.currency,
                id: razorPayOrder.id,
              };
            });
          });
      }
    });
  }

  getPaymentStatus(userId, paymentOrderId) {
    const paymentStatusModel = ModelFactory.paymentstatus();
    return paymentStatusModel.getPaymentStatus({ paymentOrderId });
  }

  verifyRazorPayPaymentSuccess(body) {
    let paymentOrderId = body.payload.payment.entity.order_id;
    const paymentStatusModel = ModelFactory.paymentstatus();
    return paymentStatusModel.updatePaymentStatus(
      { paymentOrderId },
      {
        status: "success",
      }
    );
  }

  verifyRazorPayPaymentFailed(body) {
    let paymentOrderId = body.payload.payment.entity.order_id;
    const paymentStatusModel = ModelFactory.paymentstatus();
    return paymentStatusModel.updatePaymentStatus(
      { paymentOrderId },
      {
        status: "failed",
      }
    );
  }
}

module.exports = {
  getInst: () => new CartService(),
};
