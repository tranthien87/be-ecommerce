'use strict'

const { StatusCodes } = require("http-status-codes")
const { SuccessResponse } = require("../core/success.response")
const profiles = [
    {
    usr_id: 1,
    usr_name: "John Doe",
    usr_avata: "images/1"
},
{
    usr_id: 2,
    usr_name: "John Mart",
    usr_avata: "images/2"
},
{
    usr_id: 3,
    usr_name: "John Smith",
    usr_avata: "images/3"
}
]
class ProfileController {
    profiles = async (req, res, next) => {
        return new SuccessResponse({
            message: "Successfull view any profile",
            statusCode: StatusCodes.OK,
            metadata: profiles
        }).send(res)
    }
    profile = async (req, res, next) => {
        return new SuccessResponse({
            message: "Successfull view own profile",
            statusCode: StatusCodes.OK,
            metadata: {
                id: 1,
                name: "John Doe",
                avata: "avata.com"
            }
        }).send(res)
    }
}

module.exports = new ProfileController()