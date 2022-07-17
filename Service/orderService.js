const ModelFactory = require("../Model/ModelFactory");
const Promise      = require("bluebird");
const moment       = require("moment");
const _            = require("lodash");

class OrderService {
    constructor() {
        this.model = ModelFactory.order();
    }

    createOrder(order, userId) {
        if(!order) return Promise.reject("MISSING_RESOURCE");
        if(order.userId !== userId) return Promise.reject("UNAUTHORIZED_RESOURCE");
        const userModel = ModelFactory.user();
        const valildateProductsP = Promise.resolve();
        return valildateProductsP
        .then(() => {
            if(order.cart.deliveryType === "multiple") {
                if(!order.cart || !order.cart.from || !order.cart.to || !order.cart.frequency) {
                    return Promise.reject("ERR_INVALID_MULTIPLE_ORDER");
                } else {
                    order.nextDeliveryOn = order.cart.from;
                }
            }
            return this.model.createOrder(order);
        })
        .tap(order => {
            let addMemberShipP = Promise.resolve();
            const reflectReferalAmountP = reflectReferalAmount(order);
            if(order.cart.membership && order.cart.membership.planName) {
                const userService = require("./userService").getInst();
                addMemberShipP = userService.addMemberShip(order.cart.membership.planName, userId);
            }
            return Promise.resolve(addMemberShipP, reflectReferalAmountP);
        }).then(order => {
            const cartModel = ModelFactory.cart();
            let cart = {
                products: [],
                membership: [],
                amount: 0,
                deliveryCharges: 0,
                coupon: "",
                deliveryType: "single",
                from: "",
                to: "",
                slot: "1",
                frequency: 1
            };
            return cartModel.updateCartByUserId(userId, cart).then(res => cartModel.getCartByUserId(userId));
        }); 
    }

    getOrders(userId) {
        if(!userId) return Promise.reject("MISSING_RESOURCE");
        return this.model.getOrdersByUserId(userId);
    }
}

function addAmountToUserWallet(userId, walletAmount) {
    const userModel = ModelFactory.user();
    if(walletAmount) {
        return userModel.getUserById(userId)
        .then(user => {
            if(user) {
                let updatedWalletAmount = parseInt(user.walletAmount) + parseInt(walletAmount);
                return userModel.updateUserById(userId, {walletAmount: updatedWalletAmount});
            }
        });
    } 
}

function reflectReferalAmount(userId) {
    const userModel = ModelFactory.user();
    const orderModel = ModelFactory.order();

    if(!userId) return Promise.reject("MISSING_RESOURCE");
    return orderModel.getOrdersByUserId(userId)
    .then(orders => {
        if(orders.length === 1) {
            return userModel.getUserById(userId)
            .then(userInfo => {
                let referedUserId = userInfo.referalCode;
                return addAmountToUserWallet(referedUserId, 100);
            });
        }
    });
};

OrderService.prototype.getOrdersForAdmin = function(queryParams) {
    const self = this;
    if(queryParams.status === "all") {
        delete queryParams.status;
    }
    if(queryParams.type === "both") {
        delete queryParams.type;
    }
    return self.model.getOrdersForAdmin(queryParams)
        .then(orders => {
            let userIds = _.uniq(_.map(orders, "userId"));
            const userModel = ModelFactory.user();
            return userModel.getUsersByIds(userIds)
            .then(users => {
                orders.forEach(order => {
                    order.userInfo = _.find(users, {_id: order.userId});
                });
                return orders;
            });
        });
};

OrderService.prototype.editOrder = function(orderId, order) {
    const self = this;
    if(order && order.status === "delivered") {
        return self.model.getOrderById(orderId)
        .tap(_order => {
            if(_order && _order.userId) {
                return reflectReferalAmount.call(self, _order.userId);
            }
        })
        .then(_order => {
            order.status = "placed";
            let nextDeliveryDate = new Date(_order.nextDeliveryOn);
            nextDeliveryDate = new Date(nextDeliveryDate.getTime() + 86400000 * _order.cart.frequency);
            const toDate =new Date(_order.cart.to);
            if(nextDeliveryDate.getTime() < toDate.getTime()) {
                order.nextDeliveryOn = nextDeliveryDate;
            } else {
                order.status = "delivered";
            }
            return self.model.updateOrderById(orderId, order)
            .then(order => {
                return self.model.getOrderById(order._id)
                .then(_order => {
                    const userModel = ModelFactory.user();
                    return userModel.getUserById(_order.userId)
                    .then(user => {
                        _order.userInfo = user;
                        return _order;
                    })
                })
            });
        });
    } else return self.model.updateOrderById(orderId, order)
    .then(order => {
        return self.model.getOrderById(order._id)
        .then(_order => {
            const userModel = ModelFactory.user();
            return userModel.getUserById(_order.userId)
            .then(user => {
                _order.userInfo = user;
                return _order;
            })
        })
    });
};

module.exports = {
    getInst: () => new OrderService(),
};