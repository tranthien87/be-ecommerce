const dev = {
    app: {
        port: 1234
    },
    db: {
        host: process.env.DEV_APP_HOST ||  '127.0.0.1',
        name: process.env.DEV_DB_NAME || 'shopDEV',
        port: process.env.DEV_DB_PORT || 27017,
    }
}
const pro = {
    app: {
        port: 1234
    },
    db: {
        host: process.env.PRO_APP_HOST ||  '127.0.0.1',
        name: process.env.PRO_DB_NAME || 'shopPRO',
        port: process.env.PRO_DB_PORT || 27017,
    }
}
 const config = { dev, pro};

 const env = process.env.NODE_ENV || 'dev';

module.exports = config[env]