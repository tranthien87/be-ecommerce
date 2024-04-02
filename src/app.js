require('dotenv').config()
const compression = require('compression');
const express = require('express');
const { default: helmet } = require('helmet');
const morgan = require('morgan');
const app = express();
const router = require('./routes')



// add midlewares
app.use(morgan('dev'));
app.use(helmet());
app.use(compression())
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))


// connect database mongoose
require('./dbs/init.mongoosedb');

// connect redis basic
// const initRedis =  require('./dbs/init.redis.basic');
// initRedis.connect();

// connect redis pro
const initRedis = require('./dbs/init.redis');
initRedis.initRedis();


// router init
app.use('/', router);

// Handling Not Found Error
app.use((req, res, next) => {
    const notFoundError = new Error('Not found!');
    notFoundError.status = 404;
    next(notFoundError);
})

// Handling Error

app.use((error, req, res, next) => {
    console.log('Error app.js', error );
    const statusCode = error.status || 500;
    res.status(statusCode).json({
        status: 'Error',
        code: statusCode,
        stack: true,
        message: error.message || 'Internal server error !'
    })
})


module.exports = app;