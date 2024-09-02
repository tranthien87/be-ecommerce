'use strict'


const { getRedis } = require('../dbs/init.redis');

const { promisify } = require('util');
const { reservationInventory } = require('../models/repositories/inventory.repo');

const acquireLock = async (productId, quantity, cartId) => {
    const redisClient = getRedis(); // Get the Redis client here
    const pexpire = promisify(redisClient.pexpire).bind(redisClient);
    const setnxAsync = promisify(redisClient.setnx).bind(redisClient);


    const key = `lock_v2024_${productId}`;
    const retryTime = 10;
    const expireTime = 3000;

    for (let i = 0; i < retryTime; i++) { // Fix the loop condition
        // create a key, who hold this key has access to payment
        const result = await setnxAsync(key, expireTime); // 1 or 0
        console.log('set key', result);
        if (result === 1) {
            // handle inventory
            const isReservation = await reservationInventory({ productId, quantity, cartId });
            if (isReservation.modifiedCount) {
                await pexpire(key, expireTime);
                return key;
            }
            return null;
        } else {
            await new Promise(resolve => setTimeout(resolve, 50));
        }
    }
    return null;
}

const releaseLock = async (keyLock) => {
    const redisClient = getRedis(); // Get the Redis client here
    const delAsync = promisify(redisClient.del).bind(redisClient); // Fix the client reference
    return await delAsync(keyLock);
}

module.exports = {
    acquireLock, releaseLock
}