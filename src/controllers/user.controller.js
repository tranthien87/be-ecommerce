const { SuccessResponse } = require("../core/success.response")
const { createNewUSer, checkLoginEmailTokenServices } = require("../services/user.services")

class UserController {
    // create new user

    newUser = async(req, res, next) => {
        return new SuccessResponse({
            message: 'new user created',
            metadata: await createNewUSer({email: req.body.email})
        }).send(res)
    }


    // check user token via email

    checkRegisterEmailToken = async (req, res, next) => {
        const {token} = req.query;
        console.log('token', token);
        
        return new SuccessResponse({
            message: 'Verify user token successfull',
            metadata: await checkLoginEmailTokenServices({token})
        }).send(res)
    }
}

module.exports = new UserController()