
const { randomInt } = require('crypto')
const OTP = require('../models/otp.model')


const generateToken = () => {
    return randomInt(0, Math.pow(2,32));
}

const newOtp = async ({email}) => {
    const token = generateToken();
    const newOpt = OTP.create({
        opt_token : token,
        opt_email: email
    })
    return newOpt;
}

module.exports = { newOtp }