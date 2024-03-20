'use strict'

const { cart } = require('../models/cart.model');

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
}

module.exports = CartServices