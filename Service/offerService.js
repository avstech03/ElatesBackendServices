const ModelFactory = require("../Model/ModelFactory");
const Promise      = require("bluebird");

const validateCategoryInOffer = categoryId => {
    const categoryModel = ModelFactory.category();
    return categoryModel.getCategoryById(categoryId)
    .then(res => {
        if(!res) return Promise.reject("INVALID_CATEGORY");
        return res;
    });
};

class OfferService {
    constructor() {
        this.model = ModelFactory.offers();
    }

    createOffer(offer) {
        if(!offer) return Promise.reject("MISSING_RESOURCE");
        let validateCategoryP = Promise.resolve();
        if(offer.category) validateCategoryP = validateCategoryInOffer(offer.category);
        return validateCategoryP
        .then(() => this.model.createOffer(offer));
    }

    udpateOffer(offerId, offer) {
        if(!offer) return Promise.reject("MISSING_RESOURCE");
        if(!offerId) return Promise.reject("MISSING_REQ_FIELDS_IN_QUERY_PARAMS");
        let validateCategoryP = Promise.resolve();
        if(offer.category) validateCategoryP = validateCategoryInOffer(offer.category);
        return validateCategoryP
        .then(() => this.model.updateOfferById(offerId, offer));
    }

    getOffers() {
        return this.model.getNonExpiredOffers();
    }
}

OfferService.prototype.deleteOffer = function(offerId) {
    const self = this;
    return self.model.deleteOffer(offerId);
}

module.exports = {
    getInst: () => new OfferService(),
};