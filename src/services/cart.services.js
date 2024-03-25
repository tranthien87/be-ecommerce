'use strict'

const { cart } = require('../models/cart.model');
const {findProductByIdCart} = require('../models/repositories/product.repo');
const { NotFoundError } = require('../core/error.response');
const { convertToObjectIdMongo } = require('../utils');
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
        
        const query = {
            cart_userId: userId,
            "cart_products.productId": productId,
            cart_state: 'active'
        };
        
        const updateSet = {
            $inc: {
                "cart_products.$.quantity": quantity
            }
        };
        
        const options = {
            upsert: true
        }
       
        return await cart.findOneAndUpdate(query, updateSet, options);
    }

    // End repo cart

    static async addProductToCart({userId, product = {}}) {
        const cartUser = await cart.findOne({cart_userId: userId});
        
        if (!cartUser) {
            // create new cart for user
            return await CartServices.createCart({userId, product})
        }

        // check cart is empty --> add product to cart

        if (!cartUser.cart_products.length) {
            cartUser.cart_products = [product];
            console.log('cartUser', cartUser)
            return await cartUser.save()
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
     *          productId
     *      }],
     *      version   
     *  }
     * ]
    */

    static async addToCart({ userId, shop_order_ids}) {
        console.log("🚀 ~ CartServices ~ addToCart ~ shop_order_ids:", shop_order_ids[0].item_products)
        // check product already to added
        const { productId, quantity, old_quantity } = shop_order_ids[0]?.item_products[0];

        const foundProduct = await findProductByIdCart({productId});
        console.log("🚀 ~ CartServices ~ addToCart ~ foundProduct:", foundProduct)

        if(!foundProduct) throw new NotFoundError('Product not found!');

        if(foundProduct.product_shop.toString() !== shop_order_ids[0]?.shopId) {
            throw new NotFoundError('Product not belong of shop!');
        }
        if(quantity === 0) {
            // remove product of cart
        }

        return await CartServices.updateCartQuantity({
            userId, 
            product: {
            productId,
            quantity: quantity - old_quantity
             }
         })

    }

    static async deleteItemInCart({userId, productId}) {
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

    static async getListUserCart({userId}) {
        return cart.findOne({
            cart_userId: +userId
        }).lean();
    }
}

module.exports = CartServices