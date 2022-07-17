class ElaError {
    constructor() {
        this.errConfig = require("../config/statuscodes.json");
        this.codesConfig = require("../config/codes.json");
    }
    
    Err(code) {
        if(this.errConfig[code]) {
            return {
                err: this.codesConfig[code],
                statusCode: this.errConfig[code]
            };
        }
        return {
            err: this.codesConfig["INTERNAL_SER_ERR"],
            statusCode: this.errConfig["INTERNAL_SER_ERR"]
        };
    }
}

module.exports = new ElaError();