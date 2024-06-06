'use strict'

const redis = require('redis');
const {app: {username, password, port, url}} = require('../configs/config.redis');

let client = {};

const handleEventConnect = ({redisConnection}) => {
    redisConnection.on('connect', () => console.log(`Redis client connected.`));
    redisConnection.on('error', (err) => console.log(`Redis client connect error: `, err));
    redisConnection.on('reconnecting', () => console.log(`Redis client reconnecting`));
    redisConnection.on('end', () => console.log(`Redis client disconnected.`));
}

const redisClient = redis.createClient({
    url: `redis://${username}:${password}@redis-13239.c321.us-east-1-2.ec2.cloud.redislabs.com:13239`
});


const initRedis =  () => {
    console.log(process.env.REDIS_USERNAME);
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
