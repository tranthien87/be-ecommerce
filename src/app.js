const express = require('express');
const { default: helmet } = require('helmet');
const morgan = require('morgan');
const app = express();



// add midlewares
app.use(morgan('dev'));
app.use(helmet());

app.get('/', (req, res) => {
    return res.status(500).json({
        message: "Welcome to node js !!"
    })
})



module.exports = app