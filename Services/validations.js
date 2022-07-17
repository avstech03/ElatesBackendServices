const _ = require("lodash");

const isValidPhoneNumber = (phoneNumber) => {
    if(phoneNumber.length < 10) return false;
    for(let i = 0; i < 10; i++) {
        if(!_.includes("0123456789", phoneNumber[i])) return false;
    }
    return true;
};

module.exports = {
    isValidPhoneNumber: isValidPhoneNumber
}