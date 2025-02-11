'use strict';

const { createClient } = require('redis');
const { app: { port, url } } = require('../configs/config.redis');

let client = null;

const handleEventConnect = (redisConnection) => {
    redisConnection.on('connect', () => console.log(`Redis client connected.`));
    redisConnection.on('error', (err) => {
        console.error(`Redis client connect error: `, err);
        // Handle the error appropriately here

    });
    redisConnection.on('reconnecting', () => {
        console.log(`Redis client reconnecting`);
        setTimeout(async () => {
            await closeRedis(); // Disconnect after a delay if reconnecting
        }, 5000);
    });
    redisConnection.on('end', () => console.log(`Redis client disconnected.`));
}

const initRedis = async () => {
    try {
        const redisClient = createClient({
            socket: {
                host: url,
                port: port
            }
        });
        client = redisClient;
        handleEventConnect(redisClient);
        await redisClient.connect();
        
    } catch (error) {
        console.error('Failed to connect to Redis:', error);
    }
}

const getRedis = () => {
    if (!client) {
        throw new Error('Redis client not initialized. Call initRedis() first.');
    }
    return client;
};

const closeRedis = async () => {
    if (client) {
        await client.disconnect();
        client = null;
    }
}

module.exports = {
    initRedis,
    getRedis,
    closeRedis
}
