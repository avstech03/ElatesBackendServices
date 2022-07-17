const BaseModel = require("./BaseModel");

class PaymentStatusModel extends BaseModel {
    constructor() {
        super();
    }

    createPaymentStatus(data) {
        let paymentStatus = {};

        if(data._id) paymentStatus._id = data._id;
        if(data.status) paymentStatus.status = data.status;
        if(data.paymentOrderId) paymentStatus.paymentOrderId = data.paymentOrderId;

        return this.create(paymentStatus);
    }

    updatePaymentStatus(matchCnd, data) {
        let paymentStatus = {};
        let query = {};
        if(matchCnd.paymentOrderId) query.paymentOrderId = matchCnd.paymentOrderId;

        if(data.status) paymentStatus.status = data.status;
        if(data.paymentOrderId) paymentStatus.paymentOrderId = data.paymentOrderId;

        return this.findOneAndUpdate(query, paymentStatus);
    }

    getPaymentStatus(matchCnd) {
        let query = {};
        if(matchCnd.paymentOrderId) query.paymentOrderId = matchCnd.paymentOrderId;
        if(matchCnd.id) query._id = matchCnd.id;

        return this.findOne(query);
    }
}

module.exports = { getInst: () => new PaymentStatusModel() };