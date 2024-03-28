'use strict'

const { resolve } = require('path');
const redis = require('redis');
const client = redis.createClient();
const {promisify} = require('util');

const pexpire = promisify(client.pexpire).bind(client);
const setnxAsync = promisify(client.setnx).bind(client);

const acquireLock = async (productId, quantity, cartId) => {
    const key  = `lock_v2024_${productId}`;
    const retryTime = 10;
    const expireTime = 3000;

    for (let i = 0; i < retryTime.length; i++) {
       // create a key, who hold this key has access to payment

       const result = await setnxAsync(key, expireTime); // 1 or 0
       console.log('set key', result);
       if (result === 1) {
        // handle inventory

        return key;
       } else {
            await new Promise(resolve => setTimeout(resolve, 50))
       }
        
    }
}


const releaseLock = async (keyLock) => {
    const delAsync = promisify(client.del).bind(client);
    return await delAsync.del(keyLock);
}

module.exports = {
    acquireLock, releaseLock
}