'use strict'

const { StatusCodes } = require("http-status-codes")
const { SuccessResponse } = require("../core/success.response")
const ProductServices = require("../services/product.services")

class ProductController {
    createNewProduct = async (req, res, next) => {
        console.log(req.body)
        return new SuccessResponse({
            message: 'Success created new product!',
            statusCode: StatusCodes.CREATED,
            metadata:  await ProductServices.createProduct(req.body.product_type, req.body),
        
        }).send(res)   
    }
}

module.exports = new ProductController();