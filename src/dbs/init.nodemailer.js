

const { model } = require('mongoose');
const nodemailer = require('nodemailer');


const transport = nodemailer.createTransport({
    host: process.env.HOST_MAIL,
    port: 2525,
    auth: {
        user: process.env.USERNAME_MAIL,
        pass: process.env.PASSWORD_MAIL
    }
})


module.exports = transport 