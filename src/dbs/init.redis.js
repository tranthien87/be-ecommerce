'use strict'

const redis = require('redis');

const constants = require('../constants/redis');

let client = {};

const handleEventConnect = (redisClient) => {
    redisClient.on(constants.CONNECT, () => console.log(`Redis client init connection.`));
    redisClient.on(constants.ERROR, (err) => console.log(`Redis client connect error: `, err));
    redisClient.on(constants.RECONNECTING, () => console.log(`Redis client reconnecting`));
    redisClient.on(constants.END, () => console.log(`Redis client disconnected.`));
}

const initRedis = () => {
    const redisClient = redis.createClient({
        username: constants.USERNAME,
        password: constants.PASSWORD,
        socket: {
            host: constants.REDIS_CONNECT_URL,
            port: constants.PORT
        }
    });
    redisClient.connect();
    client.instanceConnect = redisClient;
    handleEventConnect(redisClient)
}

const getRedis = () => {
    if(!client.instanceConnect) {
     initRedis();
    }
    return client;
};

const closeRedis = () => {
    client?.instanceConnect.disconnect();
}


module.exports = {
    initRedis,
    getRedis,
    closeRedis
}
