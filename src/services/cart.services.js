'use strict'

const { cart } = require('../models/cart.model');
const {findProductByIdCart} = require('../models/repositories/product.repo');

class CartServices {
    /**
     * Feature cart service
     * - Add product to cart service [user]
     * - Reduce product quantity by one [user]
     * - increase prodcut quantity by one [use]
     * - delete cart service
     * - delete cart item
     * **/
    // Start repo cart
    static async createCart({userId, product}) {
        const filter = {
            cart_userId: userId,
            cart_state: 'active'
        };
        const updateOrInsert = {
            $addToSet: {
                cart_products: product
            }
        };
        const options = {
            upsert: true,
            new: true
        }
        return await cart.findOneAndUpdate(filter, updateOrInsert, options);
    }
    static async updateCartQuantity({userId, product}) {
        const {productId, quantity} = product;
        const filter = {
            cart_userId: userId,
            'cart_products.productId': productId,
            cart_state: 'active'
        };
        const updateSet = {
            $inc: {
                'cart_products.$.quantity': quantity
            }
        };
        const options = {
            upsert: true,
            new: true
        }
        return await cart.findOneAndUpdate(filter, updateSet, options);
    }

    // End repo cart

    static async addProductToCart({userId, product = {}}) {
        const cartUser = await cart.findOne({cart_userId: userId}).lean();

        if (!cartUser) {
            // create new cart for user
            const newCart = await CartServices.createCart({userId, product})
        }

        // check cart is empty --> add product to cart

        if (!cartUser.cart_count_product) {
            cartUser.cart_products = [product];
            return await cartUser.save();
        }
        // increase product quantity
        return await CartServices.updateCartQuantity({userId, product})
    }

    /***
     * update cart
     * shop_order_ids: [
     *  {
     *      shopId,
     *      item_products: [{
     *          quantity,
     *          price,
     *          shopId,
     *          old_quantity,
     *          product_Id
     *      }],
     *      version   
     *  }
     * ]
    */

    static async addToCart({ userId, product = {}}) {
        // check product already to added
        const { productId, quantity, old_quantity } = shop_order_ids[0]?.item_products[0];
        const foundProduct = await findProductByIdCart({productId});
        if(!foundProduct) throw new NotFoundError('Product not found!');
        if(foundProduct.product_shop.toString !== shop_order_ids[0]?.shopId) {
            throw new NotFoundError('Product not belong of shop!');
        }
        if(quantity === 0) {
            // remove product of cart
        }

        return await CartServices.updateCartQuantity({userId, product: {
            productId,
            quantity: quantity - old_quantity
        }})

    }

    static async deleteUserCart({userId, productId}) {
        const  query = {
            cart_userId: userId,
            cart_state: 'active'
        }
        const updateSet = {
            $pull: {
                cart_products: {
                    productId
                }
            }
        }
        const cartDeleted = await cart.updateOne(query, updateSet);
        return cartDeleted;
    }
}

module.exports = CartServices