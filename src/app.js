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

// router init
app.use('/', router)




module.exports = app;