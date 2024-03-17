'use strict'

const {discountServices} = require("../services/discount.services");


class DiscountController {
    createDiscountCode = async (req, res, next) => {  
        return new SuccessResponse({
            message: 'Success created new discount code!',
            statusCode: StatusCodes.CREATED,
            metadata:  await discountServices.createDiscountCode({
                ...req.body
            }),
        
        }).send(res);
    }
}

module.exports = new DiscountController()