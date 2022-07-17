const BaseModel = require("./BaseModel");

class OffersModel extends BaseModel {
    constructor() {
        super();
    }

    createOffer(data) {
        let offer = {};

        if(data._id) offer._id = data._id;
        if(data.name) offer.name = data.name;
        if(data.isExpired) offer.isExpired = data.isExpired;
        if(data.category) offer.category = data.category;
        if(data.pic) offer.pic = data.pic;
        if(data.offerValue) offer.offerValue = data.offerValue;

        return this.create(offer);
    }

    updateOfferById(id, data) {
        let offer = {}, query = {_id: id};

        if(data.name) offer.name = data.name;
        if(data.isExpired) offer.isExpired = data.isExpired;
        if(data.category) offer.category = data.category;
        if(data.pic) offer.pic = data.pic;
        if(data.offerValue) offer.offerValue = data.offerValue;

        return this.findOneAndUpdate(query, offer);
    }

    getOfferById(id) {
        let query = {_id: id};
        return this.findOne(query);
    }

    getExpiredOffers() {
        let query = {isExpired: true};
        return this.find(query);
    }

    getNonExpiredOffers() {
        let query = {isExpired: false};
        return this.find(query);
    }
    
    deleteOffer(id) {
        return this.delete(id);
    }
}

module.exports = { getInst: () => new OffersModel() };