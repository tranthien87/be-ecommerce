require('dotenv').config()
const compression = require('compression');
const express = require('express');
const { default: helmet } = require('helmet');
const morgan = require('morgan');
const app = express();
const router = require('./routes');
const { v4: uuidv4 } = require('uuid');
const myLogger  = require('./logs/logger');
const cors = require('cors')
// const PubSubService = require('./services/redisPubSub.services');

// add midlewares
app.disable('x-powered-by');
app.use(cors());
app.use(morgan('dev'));
app.use(helmet());
app.use(compression())
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))
app.use((req, res, next) => {
    const requestId = req.headers['x-request-id'];
    req.requestId = requestId ? requestId : uuidv4();

    myLogger.setInfoLog(`input params:: ${req.method}`, [
        req.path,
        {requestId: req.requestId},
        req.method === 'POST' ? req.body : req.query
    ]);
    next();
})

app.get('/api/test', (req, res) => {
    res.send({
        metadata: {
            name: "shop dev api"
        }
    })
  })
// connect database mongoose
require('./dbs/init.mongoosedb');

// connect redis basic
// const initRedis =  require('./dbs/init.redis.basic');
// initRedis.connect();


// router init
app.use('/', router);
// const data = {"message": "hello"};

// Pub Sub Test
// setInterval(() => {PubSubService.publishToRedis('comments', JSON.stringify(data));}, 10000)

// PubSubService.subscribeToRedis('comments', (channel, message) => {
//     console.log(`Received message on channel ${channel}:`, message);
// });
// End Pub Sub Test

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
    const mesError = `${error.status} - ${Date.now()}- Response:: ${JSON.stringify(error)}`
    myLogger.setErrorLog(mesError, [
        req.path,
        {requestId: req.requestId},
        {message: error.message}
    ])

    res.status(statusCode).json({
        status: 'Error',
        code: statusCode,
        stack: true,
        message: error.message || 'Internal server error !'
    })
})

module.exports = app;