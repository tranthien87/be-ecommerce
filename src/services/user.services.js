const { ErrorResponse } = require('../core/error.response');
const { SuccessResponse } = require('../core/success.response');
const USER = require('../models/user.model');

const newUSer = async ({
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

    return SuccessResponse({
        message: 'Verify email user',
        metadata: {
            token
        }
    })

}