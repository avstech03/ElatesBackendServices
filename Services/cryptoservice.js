const crypto    = require("crypto");
const Promise   = require("bluebird");
const _         = require("lodash");

class CryptoService {
    constructor(fields) {
        this.cryptoConfig = require("../config/serverconfig.json").crypto;
        this.fields = fields;
        this.iv = crypto.randomBytes(16);
    }

    removeCryptoInfo(rec) {
        const val = _.omit(rec, "iv");
        return rec;
    }

    encrypt(recs) {
        if(Array.isArray(recs)) {
            return Promise.map(recs, (rec) => {
                return this.encryptOne(rec);
            });
        }
        return this.encryptOne(recs);
    }

    encryptOne(rec) {
        if(this.fields && this.fields.length > 0) {
            let isEncrypted = false;
            this.fields.forEach((field) => {
                const cipher = crypto.createCipheriv(this.cryptoConfig.algorithm, this.cryptoConfig.secretKey, this.iv);
                let text = _.get(rec, field);
                let encryptedText;
                if(text) {
                    isEncrypted = true;
                    encryptedText = Buffer.concat([cipher.update(text), cipher.final()]).toString("hex");
                    rec[field] = encryptedText;
                }
            });
            if(isEncrypted) rec.iv = JSON.stringify(this.iv);
        }
        return Promise.resolve(rec);
    }

    decrypt(recs) {
        if(Array.isArray(recs)) {
            return Promise.map(recs, (rec) => {
                return this.decryptOne(rec);
            });
        }
        return this.decryptOne(recs);
    }

    decryptOne(rec) {
        if(this.fields && this.fields.length > 0 && rec && rec.iv) {
            this.fields.forEach((field) => {
                const decipher = crypto.createDecipheriv(this.cryptoConfig.algorithm, this.cryptoConfig.secretKey, Buffer.from(JSON.parse(rec.iv), "hex"));
                let hash = _.get(rec, field);
                let text = Buffer.concat([decipher.update(Buffer.from(hash, "hex")), decipher.final()]);
                _.set(rec, field, text.toString());
            });
            return this.removeCryptoInfo(rec);
        }
        return Promise.resolve(rec);
    }
}

module.exports = {
    getInst: (fields) => new CryptoService(fields)
};