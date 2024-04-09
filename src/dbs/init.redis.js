'use strict'
require('dotenv').config()
const redis = require('redis');

const constants = require('../constants/redis');

let client = {};
const username = process.env.REDIS_ACCOUNT;
const password = process.env.PASSWORD;


const handleEventConnect = ({redisConnection}) => {
    redisConnection.on(constants.CONNECT, () => console.log(`Redis client connected.`));
    redisConnection.on(constants.ERROR, (err) => console.log(`Redis client connect error: `, err));
    redisConnection.on(constants.RECONNECTING, () => console.log(`Redis client reconnecting`));
    redisConnection.on(constants.END, () => console.log(`Redis client disconnected.`));
}

const redisClient = redis.createClient({
    url: `redis://${username}:${password}@redis-13239.c321.us-east-1-2.ec2.cloud.redislabs.com:13239`
});


const initRedis =  () => {
    client.instanceConnect = redisClient;
    handleEventConnect({redisConnection: redisClient})
}

const getRedis = () => {
    if (!client.instanceConnect) {
        client.instanceConnect = redisClient;
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
