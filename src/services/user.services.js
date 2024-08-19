const { ErrorResponse } = require('../core/error.response');
const { SuccessResponse } = require('../core/success.response');
const {sendEmailToken}  = require('../services/email.services')
const USER = require('../models/user.model');
const { log } = require('winston');

const createNewUSer = async ({
    email = null, 
    captcha = null
}) => {
    // 1. Check email exits in dbs
    const user = await USER.findOne({email}).lean()

    // 2. If user exits

    if(user) {
        return  ErrorResponse("Email already exits !");
    }

    // 3. send token via email to user
    const result = await sendEmailToken({email})
   
    return {
        message: 'Verify email user',
        metadata: result
    }

}


module.exports = {
    createNewUSer
}