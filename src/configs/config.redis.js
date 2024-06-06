require('dotenv').config()


const dev = {
    app: {
        port: process.env.REDIS_PORT,
        username: process.env.REDIS_USERNAME,
        password: process.env.REDIS_PASSWORD,
        url: process.env.REDIS_CONNECT_URL
    }
}
const pro = {
    app: {
        port: process.env.REDIS_PORT,
        username: process.env.REDIS_USERNAME,
        password: process.env.REDIS_PASSWORD,
        url: process.env.REDIS_CONNECT_URL
    }
}


const config = {dev, pro}

const env = process.env.NODE_ENV || 'dev';

module.exports = config[env];