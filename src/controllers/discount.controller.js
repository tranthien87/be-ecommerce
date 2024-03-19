'use strict'
const { StatusCodes } = require("http-status-codes")
const {discountServices} = require("../services/discount.services");
const {SuccessResponse} = require('../core/success.response')

class DiscountController {
    createDiscountCode = async (req, res, next) => {  
        return new SuccessResponse({
            message: 'Success created new discount code!',
            statusCode: StatusCodes.CREATED,
            metadata:  await discountServices.createDiscountCode({
                ...req.body,
                shopId: req.user.userId
            }),
        
        }).send(res);
    }
    getAllProductWithDiscountCode = async (req, res, next) => {  
        return new SuccessResponse({
            message: 'Success get products by discoutn code!',
            statusCode: StatusCodes.OK,
            metadata:  await discountServices.getAllProductWithDiscountCode({
                ...req.query
            }),
        
        }).send(res);
    }
    getAllDiscountCode = async (req, res, next) => {
        return new SuccessResponse({
            message: 'Success all discount code by shop!',
            statusCode: StatusCodes.OK,
            metadata:  await discountServices.getAllDiscountCodeByShop({
                ...req.query
            }),
        
        }).send(res);
    }
    getDiscountAmount = async (req, res, next) => {
        return new SuccessResponse({
            message: 'Successfull get discount amount!',
            statusCode: StatusCodes.OK,
            metadata:  await discountServices.applyDiscountCode({
                ...req.body
            }),
        
        }).send(res);
    }
}

module.exports = new DiscountController()