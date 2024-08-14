const { SuccessResponse } = require("../core/success.response")
const { createNewUSer } = require("../services/user.services")

class UserController {
    // create new user

    newUser = async(req, res, next) => {
        return new SuccessResponse({
            message: 'new user created',
            metadata: await createNewUSer({email: req.body.email})
        }).send(res)
    }


    // check user token via email

    checkRegisterEmailToken = async () => {}
}

module.exports = new UserController()