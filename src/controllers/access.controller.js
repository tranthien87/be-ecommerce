'use strict'
const { StatusCodes } = require('http-status-codes')
const { CREATED, SuccessResponse } = require('../core/success.response')
const AccessService = require('../services/access.services')

class AccessControler {
    login = async (req, res, next) => {
        return new SuccessResponse({
            message: 'Success login!',
            statusCode: StatusCodes.ACCEPTED,
            metadata:  await AccessService.login(req.body),
        
        }).send(res)   
    }

    signUp = async(req,res, next) => {

        return new CREATED({
            message: 'Registered OK',
            metadata:  await AccessService.signUp(req.body),
            options: {
                limited: 10
            }
        }).send(res)            
     
    }
}

module.exports = new AccessControler()