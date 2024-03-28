'use strict'
const {BadRequestError, NotFoundError} = require('../core/error.response');
const { findCartById } = require("../models/repositories/cart.repo");
const { checkProductByServer } = require('../models/repositories/product.repo');
const {discountServices} = require('./discount.services');

class CheckoutServices {
    /**
     * Use for login and not login user
     * 
     * {
     *      cartId,
     *      userId,
     *      shop_order_ids: [
     *          {
     *              shopId,
     *              shop_discounts: [],
     *              item_products: [
     *                  {
     *                      price,
     *                      quantity,
     *                      productId
     *                  }
     *              ]
     *          },
     *          {
     *              shopId,
     *              shop_discounts: [],
     *              item_products: [
     *                  {
     *                      price,
     *                      quantity,
     *                      productId
     *                  }
     *              ]
     *          }
     *      ]
     * }
     * 
     */

    static async checkoutReview({cartId, userId, shop_order_ids}) {
        // check cart avaiable
        const foundCart = await findCartById({id: cartId})
        if (!foundCart) {
            throw new BadRequestError('cart not found')
        }

        let checkout_orders = {
            total_price: 0,
            total_discount: 0,
            freeship: 0,
            checkout_price: 0
        }, shop_order_ids_new = [];

        // calc total price orders
        for (let i = 0; i < shop_order_ids.length; i++) {
            const {shopId, shop_discounts, item_products } = shop_order_ids[i]

            // checking product

            const checkProducts = await checkProductByServer(item_products);
            console.log("🚀 ~ CheckoutServices ~ checkoutReview ~ checkProduct:", checkProducts)
            if(!checkProducts[0]) throw BadRequestError('order wrong')
            
            const checkoutPrice = checkProducts.reduce((acc, product) => {
                return acc + (product.quantity * product.price)
            }, 0);

            // total price before apply discount
            checkout_orders.total_price += checkoutPrice;

            let itemCheckout = {
                shopId,
                shop_discounts,
                priceRaw: checkoutPrice,
                priceApplyDiscount: checkoutPrice,
                item_products: checkProducts
            }

            // if shop_discounts > 0
            if(shop_discounts.length > 0) {
                // case have only 1 discount
                const {totalOrder, discountAmount, totalPrice } = await discountServices.applyDiscountCode({
                    code: shop_discounts[0].code,
                    shopId,
                    userId,
                    products: checkProducts
                })

                // total discount 
                checkout_orders.total_discount += discountAmount;
                console.log("🚀 ~ CheckoutServices ~ checkoutReview ~ discountAmount:", discountAmount)

                if (discountAmount > 0) {
                    itemCheckout.priceApplyDiscount = checkoutPrice - discountAmount;
                }

            }

            checkout_orders.checkout_price += itemCheckout.priceApplyDiscount; 
            shop_order_ids_new.push(itemCheckout);
            
        }

        return {
            shop_order_ids,
            shop_order_ids_new,
            checkout_orders
        }

    }

    static async orderByUser({shop_order_ids, cartId, userId, checkout_address = {}, checkout_payment = {}}) {
        const {shop_order_ids_new, checkout_orders} = CheckoutServices.checkoutReview({cartId, userId, shop_order_ids});
        const products = shop_order_ids_new.flatMap(order => order.item_products);
        // check inventory use optimissted key - redis 
        for (let i = 0; i < products.length; i++) {
            const {productId, quantity} = products[i];
            
        }
    }

}

module.exports = CheckoutServices