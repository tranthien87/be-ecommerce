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
    updateProduct = async (req, res, next) => {  
        return new SuccessResponse({
            message: 'Success created new product!',
            statusCode: StatusCodes.CREATED,
            metadata:  await ProductServicesv2.updateProduct(req.body.product_type, req.params.productId, {
                ...req.body,
                product_shop: req.user.userId
            }),
        
        }).send(res);
    }
    // PUT //
    publishProductByShop = async (req, res , next) => {
        return new SuccessResponse({
            message: 'Success publish product!',
            statusCode: StatusCodes.OK,
            metadata:  await ProductServicesv2.publicDraftProductByShop({
                product_id: req.params.id,
                product_shop: req.user.userId
            }),
        
        }).send(res); 
    }
    unPublishProductByShop = async (req, res , next) => {
        return new SuccessResponse({
            message: 'Success un-publish product!',
            statusCode: StatusCodes.OK,
            metadata:  await ProductServicesv2.unPublicProductByShop({
                product_id: req.params.id,
                product_shop: req.user.userId
            }),
        
        }).send(res); 
    }
    // END PUT //


  // QUERY //
    getListDraffProduct = async (req, res, next) => {
        return new SuccessResponse({
            message: 'Success get list draff products',
            statusCode: StatusCodes.OK,
            metadata: await ProductServicesv2.getProductsDraftByShop({
                product_shop: req.user.userId
            })
        }).send(res);
    }
    getListPublicProduct = async (req, res, next) => {
        return new SuccessResponse({
            message: 'Success get list public products',
            statusCode: StatusCodes.OK,
            metadata: await ProductServicesv2.getProductsPublicByShop({
                product_shop: req.user.userId
            })
        }).send(res);
    }
    getListSearchProduct = async (req, res, next) => {
        return new SuccessResponse({
            message: 'Success get list search products',
            statusCode: StatusCodes.OK,
            metadata: await ProductServicesv2.searchProductByUser(req.params)
        }).send(res);
    }
    findAllProducts = async (req, res, next) => {
        return new SuccessResponse({
            message: 'Success get all products',
            statusCode: StatusCodes.OK,
            metadata: await ProductServicesv2.findAllProducts(req.query)
        }).send(res);
    }

    findProduct = async (req, res, next) => {
        return new SuccessResponse({
            message: 'Success find a products',
            statusCode: StatusCodes.OK,
            metadata: await ProductServicesv2.findProduct({product_id: req.params.product_id})
        }).send(res);
    }

    // END QUERY //
}

module.exports = new ProductController();