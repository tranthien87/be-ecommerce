'use strict'
const { StatusCodes } = require('http-status-codes')
const { CREATED, SuccessResponse } = require('../core/success.response')
const AccessService = require('../services/access.services')

class AccessControler {
    // handlerRefreshToken = async (req, res, next) => {
    //     return new SuccessResponse({
    //         message: 'Get token success!',
    //         statusCode: StatusCodes.ACCEPTED,
    //         metadata:  await AccessService.handlerRefreshToken(req.body.refreshToken),
        
    //     }).send(res)   
    // }
    //  v2
    handlerRefreshToken = async (req, res, next) => {
        return new SuccessResponse({
            message: 'Get token success!',
            statusCode: StatusCodes.ACCEPTED,
            metadata:  await AccessService.handlerRefreshTokenV2({
                refreshToken: req.refreshToken,
                user: req.user,
                keyStrore: req.keyStore
            }),
        
        }).send(res)   
    }
    login = async (req, res, next) => {
        return new SuccessResponse({
            message: 'Success login!',
            statusCode: StatusCodes.ACCEPTED,
            metadata:  await AccessService.login({requestId: req.requestId, ...req.body}),
        
        }).send(res)   
    }
    logout = async (req, res, next) => {
        return new SuccessResponse({
            message: 'Success logout!',
            statusCode: StatusCodes.ACCEPTED,
            metadata:  await AccessService.logout({keyStore: req.keyStore}),
        
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