const _ = require("lodash");
const Promise = require("bluebird");
const payloadValidator = require("./payloadvalidator").payloadValidator;
const codes = require("../config/codes.json");
const Error = require("./Error");

const serviceHandler = (req, res, serviceP) => {
    
    let validatorP = Promise.resolve(true);
    if(req.method === "POST" || req.method === "PUT") validatorP = payloadValidator(req.body, req.ApiId);

    return Promise.resolve(validatorP)
        .then((isValid) => {
            if(!isValid) {
                const err = Error.Err("PRE_CONDITIONS_FAILED");
                res.status(err.statusCode);
                res.send(err);
                res.end();
            }
            return Promise.resolve(isValid);
        }).then((isValid) => {
            if(isValid) {
                return serviceP
                    .then((data) => {
                        res.status(200);
                        res.send(data);
                    })
                    .catch((error) => {
                        console.log(" === ERROR === ", error);
                        if(error) {
                            const err = Error.Err(error);
                            res.status(err.statusCode);
                            res.send(err);
                        }
                    });
            }
        });
};

module.exports = {
    serviceHandler: serviceHandler
};