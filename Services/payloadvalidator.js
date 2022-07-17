const _ = require("lodash");

const payloadValidator = (body, ApiId) => {
    const template = require("../config/payloadvalidator.json")[ApiId];
    if(!template) return true;
    const requiredFields = _.map(Object.keys(template), (key) => {
        if(template[key].required) return key;
    });
    const actualFields = Object.keys(body);
    if(_.difference(requiredFields, actualFields).length) return false;
    else return true;
};

module.exports = {
    payloadValidator: payloadValidator
};