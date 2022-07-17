const BaseModel = require("./BaseModel");

class UserModel extends BaseModel {
    constructor() {
        super();
        this.needEncryption = true;
        this.encryptFields = ["password"];
    }

    createUser(data) {
        let userInfo = {};

        if(data.username) userInfo.username = data.username;
        if(data.email) userInfo.email = email;
        if(data.phoneNumber) userInfo.phoneNumber = data.phoneNumber;
        if(data.referalCode) userInfo.referalCode = data.referalCode;
        if(data.type) userInfo.type = data.type;
        if(data.membershipObtained) userInfo.membershipObtained = data.membershipObtained;
        if(data.address) userInfo.address = data.address;
        if(data.isMemberShipValidTill) userInfo.isMemberShipValidTill = data.isMemberShipValidTill;
        if(data.isMembershipExpired) userInfo.isMembershipExpired = data.isMembershipExpired;
        return this.create(data);
    }

    updateUserById(id, data) {
        let userInfo = {}, query = {_id: id};

        if(data.username) userInfo.username = data.username;
        if(data.email) userInfo.email = data.email;
        if(data.phoneNumber) userInfo.phoneNumber = data.phoneNumber;
        if(data.referalCode) userInfo.referalCode = data.referalCode;
        if(data.type) userInfo.type = data.type;
        if(data.membershipObtained) userInfo.membershipObtained = data.membershipObtained;
        if(data.address) userInfo.address = data.address;
        if(data.isMemberShipValidTill) userInfo.isMemberShipValidTill = data.isMemberShipValidTill;
        if(data.isMembershipExpired) userInfo.isMembershipExpired = data.isMembershipExpired;
        if(data.walletAmount) userInfo.walletAmount = data.walletAmount;
        return this.findOneAndUpdate(query, data);
    }

    getUserById(id) {
        let query = {_id: id};
        return this.findOne(query);
    }

    getUserByUserName(username) {
        let query = {username: username};
        return this.findOne(query);
    }

    getUserByEmail(email) {
        let query = {email: email};
        return this.findOne(query);
    }

    getUserByPhoneNumber(phoneNumber) {
        let query = {phoneNumber: phoneNumber};
        return this.findOne(query);
    }

    getAllEndUsers(queryParams) {
        let query = {
            type: "enduser"
        };
        if(queryParams) {
            if(queryParams.email) query.email = queryParams.email;
            if(queryParams.username) query.username = queryParams.username;
            if(queryParams.phoneNumber) query.phoneNumber = queryParams.phoneNumber;
            if(queryParams.membership) {
                if(queryParams.membership === "prime") query.membershipObtained = true;
                else if(queryParams.membership === "non-prime")query.membershipObtained = false;
            }
        }

        return this.find(query);
    }

    getUsersByIds(ids) {
        let query = {
            _id: {
                $in: ids
            }
        };
        return this.find(query);
    }
}

module.exports = { getInst: () => new UserModel() };