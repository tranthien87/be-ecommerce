'use strict'
const { StatusCodes } = require("http-status-codes");
const CheckoutServices = require("../services/checkout.services");
const {SuccessResponse} = require('../core/success.response');


class CheckoutController {
    
    checkout = async (req, res, next) => {
        return new SuccessResponse({
            message: "Successfull checkout review",
            statusCode: StatusCodes.OK,
            metadata: await CheckoutServices.checkoutReview(req.body)
        }).send(res)
    }

  
}

module.exports = new CheckoutController()