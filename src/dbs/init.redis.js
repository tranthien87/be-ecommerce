'use strict'
require('dotenv').config()

const redis = require('redis');

let client = {};

const handleEventConnect = ({redisConnection}) => {
    redisConnection.on('connect', () => console.log(`Redis client connected.`));
    redisConnection.on('error', (err) => console.log(`Redis client connect error: `, err));
    redisConnection.on('reconnecting', () => console.log(`Redis client reconnecting`));
    redisConnection.on('end', () => console.log(`Redis client disconnected.`));
}

const redisClient = redis.createClient({
    url: `redis://${process.env.REDIS_USERNAME}:${process.env.REDIS_PASSWORD}@redis-13239.c321.us-east-1-2.ec2.cloud.redislabs.com:13239`
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
