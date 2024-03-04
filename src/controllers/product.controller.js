'use strict'

const { StatusCodes } = require("http-status-codes")
const { SuccessResponse } = require("../core/success.response")
const ProductServicesv2 = require("../services/product.services.v2")


class ProductController {
    createNewProduct = async (req, res, next) => {  
        return new SuccessResponse({
            message: 'Success created new product!',
            statusCode: StatusCodes.CREATED,
            metadata:  await ProductServicesv2.createProduct(req.body.product_type, {
                ...req.body,
                product_shop: req.user.userId
            }),
        
        }).send(res);
    }


  // QUERY //
    getListDraffProduct = async (req, res, next) => {
        return new SuccessResponse({
            message: 'Success get list draff products',
            statusCode: StatusCodes.OK,
            metadata: await ProductServicesv2.getProductsDraff({
                product_shop: req.user.userId
            })
        }).send(res);
    }
    // END QUERY //
}

module.exports = new ProductController();