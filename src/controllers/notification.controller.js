'use strict'

const { StatusCodes } = require('http-status-codes');
const { SuccessResponse } = require('../core/success.response');
const { listNotiByUser } = require('../services/notification.services');

class NotificationController {
    getListNotiByuser = async (req, res, next) => {
        return new SuccessResponse({
            message: "Get list notification by user successfull!",
            statusCode: StatusCodes.OK,
            metadata: await listNotiByUser(req.query)
        }).send(res)
    }
   
}

module.exports = new NotificationController()