const BaseModel = require("./BaseModel");

class WalletModel extends BaseModel {
    constructor() {
        super();
    }

    createWallet(data) {
        let wallet = {};
        
        if(data._id) wallet._id = data._id;
        if(data.referalAmount) wallet.referalAmount = data.referalAmount;
        if(data.generalAmount) wallet.generalAmount = data.generalAmount;
        if(data.userId) wallet.userId = data.userId;
        
        return this.create(wallet);
    }

    updateWalletById(data) {
        let wallet = {}, query = {_id: id};
        
        if(data._id) wallet._id = data._id;
        if(data.referalAmount) wallet.referalAmount = data.referalAmount;
        if(data.generalAmount) wallet.generalAmount = data.generalAmount;
        if(data.userId) wallet.userId = data.userId;
        
        return this.findOneAndUpdate(query, wallet);
    }

    updateWalletByUserId(userId, data) {
        let wallet = {}, query = {userId: userId};
        
        if(data._id) wallet._id = data._id;
        if(data.referalAmount) wallet.referalAmount = data.referalAmount;
        if(data.generalAmount) wallet.generalAmount = data.generalAmount;
        if(data.userId) wallet.userId = data.userId;
        
        return this.findOneAndUpdate(query, wallet);
    }
    
    getWalletById(id) {
        let query = {_id: id};
        return this.findOne(query);
    }

    getWalletByUserId(userId) {
        let query = {userId: userId};
        return this.findOne(query);
    }
    
    deleteWallet(id) {
        return this.delete(id);
    }
}

module.exports = { getInst: () => new WalletModel() };