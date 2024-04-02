'use strict'

const redis = require('redis');
const redisClient = redis.createClient({
    username:'sakura',
    password: 'Aa1234a@',
    socket: {
        host: 'redis-13239.c321.us-east-1-2.ec2.cloud.redislabs.com',
        port: 13239
    }
});

redisClient.on('ready', () => console.log('Redis connected!!'))
redisClient.on('error', err => console.log('Redis cloud connect error:::', err));

module.exports = redisClient;