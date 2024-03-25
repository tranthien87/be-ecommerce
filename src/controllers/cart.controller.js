'use strict'
const { StatusCodes } = require("http-status-codes");
const CartServices = require("../services/cart.services");
const {SuccessResponse} = require('../core/success.response');


class CartController {
    
    createCart = async (req, res, next) => {
        return new SuccessResponse({
            message: "Successfull create new cart",
            statusCode: StatusCodes.CREATED,
            metadata: await CartServices.addProductToCart(req.body)
        }).send(res)
    }
    updateCart = async (req, res, next) => {
        return new SuccessResponse({
            message: "Successfull update product in the cart",
            statusCode: StatusCodes.OK,
            metadata: await CartServices.addToCart(req.body)
        }).send(res)
    }
    deleteProductInCart = async (req, res, next) => {
        return new SuccessResponse({
            message: "Successfull delete cart",
            statusCode: StatusCodes.OK,
            metadata: await CartServices.deleteItemInCart(req.body)
        }).send(res)
    }
    getListCart = async (req, res, next) => {
        return new SuccessResponse({
            message: "Successfull delete cart",
            statusCode: StatusCodes.OK,
            metadata: await CartServices.getListUserCart(req.query)
        }).send(res)
    }
}

module.exports = new CartController()