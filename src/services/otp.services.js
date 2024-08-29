
const { randomInt } = require('crypto')
const OTP = require('../models/otp.model');
const { NotFoundError } = require('../core/error.response');


const generateToken = () => {
    return randomInt(0, Math.pow(2,32));
}

const newOtp = async ({email}) => {
    const token = generateToken();
    const newOpt = await OTP.create({
        opt_token : token,
        opt_email: email
    })
    return newOpt;
}

const checkTokenLogin = async ({token}) => {
    const otp = await OTP.findOne({opt_token: token});
    if(!otp) {
        throw new NotFoundError('Otp not found.')
    }
    await OTP.deleteOne({opt_token: token})

    return otp;
}
module.exports = { newOtp , checkTokenLogin}