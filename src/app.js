require('dotenv').config();
const compression = require('compression');
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const myLogger = require('./logs/logger');
const router = require('./routes');
// const PubSubService = require('./services/redisPubSub.services');

const app = express();

// Middleware setup must have when init
app.disable('x-powered-by');
app.use(cors());
app.use(morgan('dev'));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request ID and logging middleware
app.use((req, res, next) => {
    const requestId = req.headers['x-request-id'] || uuidv4();
    req.requestId = requestId;

    myLogger.setInfoLog(`input params:: ${req.method}`, [
        req.path,
        { requestId: req.requestId },
        req.method === 'POST' ? req.body : req.query
    ]);
    next();
});

// Test route
app.get('/api/test', (req, res) => {
    res.status(200).json({
        metadata: {
            name: "shop dev api"
        }
    });
});

// Connect to MongoDB
require('./dbs/init.mongoosedb');

// Connect to Redis (if needed)
// const initRedis = require('./dbs/init.redis.basic');
// initRedis.connect();

// Initialize routes
app.use('/', router);

// Pub/Sub Test (if needed)
// const data = { "message": "hello" };
// setInterval(() => { PubSubService.publishToRedis('comments', JSON.stringify(data)); }, 10000);
// PubSubService.subscribeToRedis('comments', (channel, message) => {
//     console.log(`Received message on channel ${channel}:`, message);
// });

// Handling Not Found Error
app.use((req, res, next) => {
    const notFoundError = new Error('Not found!');
    notFoundError.status = 404;
    next(notFoundError);
});

// Error Handling Middleware
app.use((error, req, res, next) => {
    console.error('Error app.js', error);
    const statusCode = error.status || 500;
    const mesError = `${statusCode} - ${Date.now()} - Response:: ${JSON.stringify(error)}`;
    myLogger.setErrorLog(mesError, [
        req.path,
        { requestId: req.requestId },
        { message: error.message }
    ]);

    res.status(statusCode).json({
        status: 'Error',
        code: statusCode,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
        message: error.message || 'Internal server error!'
    });
});

module.exports = app;