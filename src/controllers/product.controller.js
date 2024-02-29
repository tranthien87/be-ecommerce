'use strict'

const { StatusCodes } = require("http-status-codes")
const { SuccessResponse } = require("../core/success.response")
const ProductServices = require("../services/product.services")
const ProductServicesv2 = require("../services/product.services.v2")
class ProductController {
    createNewProduct = async (req, res, next) => {
    
        // return new SuccessResponse({
        //     message: 'Success created new product!',
        //     statusCode: StatusCodes.CREATED,
        //     metadata:  await ProductServices.createProduct(req.body.product_type, {
        //         ...req.body,
        //         product_shop: req.user.userId
        //     }),
        
        // }).send(res)   
        return new SuccessResponse({
            message: 'Success created new product!',
            statusCode: StatusCodes.CREATED,
            metadata:  await ProductServicesv2.createProduct(req.body.product_type, {
                ...req.body,
                product_shop: req.user.userId
            }),
        
        }).send(res) 
    }
}

module.exports = new ProductController();