const redis       = require("ioredis");
const _           = require("lodash");
const redisConfig = require("../../config/serverconfig.json").redis;

let redisClientCache = {};

const createClient = (cacheKey) => {
    console.log(" === CREATING REDIS CLIENT === ");
    if(typeof(cacheKey) === "string" && redisClientCache[cacheKey]) {
        console.log(" === USING REDIS CLIENT OF CACHE KEY === ", cacheKey);
        return redisClientCache[cacheKey];
    }
    const client = redis.createClient(redisConfig.port, redisConfig.host, redisConfig.options);
    client.on("error", (e) => {
        console.log(" === ERROR WHILE CONNECTING TO REDIS CLIENT === ");
    });

    if(client) console.log(" === SUCCESSFULLY CONNECTED TO REDIS === ");

    return client;
};

module.exports = { createClient: createClient };