const Promise     = require("bluebird");
const redisClient = Promise.promisifyAll(require("./index").createClient());

const pushToRedis = (data, key) => {
    return redisClient.hsetAsync(key, "object", JSON.stringify(data))
        .catch((error) => {
            return Promise.reject("ADD_TO_REDIS_FAILED");
        });
};

const getFromRedis = (key) => {
    return redisClient.hgetAsync(key, "object")
        .then((response) => {
            try {
                response = JSON.parse(response);
                return response;
            } catch(err) {
                return Promise.reject(err);
            }
        })
        .catch((err) => {
            return Promise.reject("GET_FROM_REDIS_FAILED");
        });
};

const deleteFromRedis = (key) => {
    return redisClient.delAsync(key)
        .catch((err) => {
            return Promise.reject("DEL_FROM_REDIS_FAILED");
        });
};

const expireFromRedis = (key, ttl) => {
    ttl = ttl || 60 * 60;
    
    return redisClient.expireAsync(key, ttl)
        .catch((err) => {
            return Promise.reject(err);
        });
};

module.exports = {
    pushToRedis: pushToRedis,
    getFromRedis: getFromRedis,
    deleteFromRedis: deleteFromRedis,
    expireFromRedis: expireFromRedis
};
