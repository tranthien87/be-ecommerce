'use strict'
require('dotenv').config()
const redis = require('redis');

class PubSubService {
    constructor() {
        
         this.publisher = redis.createClient({
            url: `redis://${process.env.REDIS_USERNAME}:${process.env.REDIS_PASSWORD}@redis-13239.c321.us-east-1-2.ec2.cloud.redislabs.com:13239`
        });
        this.subscriber = redis.createClient({
            url: `redis://${process.env.REDIS_USERNAME}:${process.env.REDIS_PASSWORD}@redis-13239.c321.us-east-1-2.ec2.cloud.redislabs.com:13239`
        });
    }

    publishToRedis(channel, message) {
    
        return new Promise((resolve, reject) => {
            this.publisher.publish(channel, message, (
                error, result
            ) => {
                if (error) {
                    reject(error)
                } else {
                    resolve(result);
                }
            });
        })
         
    }

    subscribeToRedis(channel, callback) {
        this.subscriber.subscribe(channel);
        this.subscriber.on("message", (channelsub, message) => {
            if (channelsub === channel) {
                callback(channel, message)
            }
        })
       
    }
}

module.exports = new PubSubService();