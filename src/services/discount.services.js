/**
 * Discount services
 * 1- Generate discount code (shop | Admin)
 * 2- Get discount amount (User)
 * 3- Get all discount code (Shop | User)
 * 4- Verify discount code (User)
 * 5- Delete discount code (Admin | Shop) 
 * 6- Cancel discount code (User)
 */

const {BadRequestError, NotFoundError} = require('../core/error.response');
const {discount} = require('../models/discount.model');
const {convertToObjectIdMongo} = require('../utils');
const {findAllProducts} = require('../models/repositories/product.repo');
const {
    findAllDiscountCodeUnSelect ,
    findAllDiscountCodeSelect ,
    checkDiscountCodeExit
} = require('../models/repositories/discount.repo');

class DiscountServices {

     static async createDiscountCode(payload) {
        const {
            name,
            description,
            type,
            value,
            code,
            start_date,
            end_date,
            max_users,
            uses_count,
            user_used,
            max_uses_per_user, 
            min_order_value,
            shopId,
            is_active,
            applies_to,
            product_ids, 
        } = payload;

        if(new Date() < new Date(start_date) || new Date() > new Date(end_date)) {
            throw new BadRequestError('Discount code has expired')
        }

        if(new Date(start_date) >= new Date(end_date)) {
            throw new BadRequestError('Start date must be before end date')
        }

        const foundDiscountCode = await discount.findOne({
            discount_code: code,
            discount_shopId: convertToObjectIdMongo(shopId)
        }).lean();

        if (foundDiscountCode && foundDiscountCode.discount_is_active) {
            throw new BadRequestError('Discount code already exit.')
        }

        const newDiscountCode = discount.create({
            discount_name: name,
            discount_description: description,
            discount_type: type, 
            discount_value: value,
            discount_code: code,
            discount_start_date: new Date(start_date),
            discount_end_date: new Date(end_date),
            discount_max_users: max_users,
            discount_uses_count:uses_count,
            discount_user_used: user_used, 
            discount_max_uses_per_user: max_uses_per_user, 
            discount_min_order_value: min_order_value || 0,
            discount_shopId: shopId,
            discount_is_active: is_active,
            discount_applies_to: applies_to,
            discount_product_ids: applies_to === 'all' ? [] : product_ids, 
        })

        return newDiscountCode;

    }

    static async updateDiscountCode () {}

    /**
     * Get all products belong that discount code
    */

    static async getAllProductWithDiscountCode({
        code, shopId, userId, limit, page
    }) {
        const foundDiscountCode = await discount.findOne({
            discount_code: code,
            discount_shopId: convertToObjectIdMongo(shopId)
        }).lean();

        if (!foundDiscountCode || !foundDiscountCode.discount_is_active) {
            throw new NotFoundError('Discount code not found.')
        }

        const { discount_applies_to, discount_product_ids} = foundDiscountCode;

        let products;

        if(discount_applies_to === 'all') {
            products = await findAllProducts({
                filter: {
                    product_shop: convertToObjectIdMongo(shopId),
                    isPublish: true
                },
                limit: +limit,
                page: +page,
                sort: 'ctime',
                select: ['product_name']
            }) 
        }
        if(discount_applies_to === 'specific') {
            products = await findAllProducts({
                filter: {
                    _id: {$in: discount_product_ids},
                    isPublish: true
                },
                limit: +limit,
                page: +page,
                sort: 'ctime',
                select: ['product_name']
            }) 
        }
        return products;
    }

    /**
     * Get all  discounts of shop | Shop
    */
    static async getAllDiscountCodeByShop(payload) {
        const {
            shopId, page , limit
        } = payload;

        const discountCodes = await findAllDiscountCodeUnSelect({
            limit,
            page,
            model: discount,
            filter: {
                discount_shopId: convertToObjectIdMongo(shopId),
                discount_is_active: true
            },
            unSelect: ['__v', 'discount_shopId' ]
        })
        return discountCodes;
    }

    /***
     * Apply discount code | User
    */

    static async applyDiscountCode({
        code, shopId, userId, products
    }) {
        // check this discoutn code is exits

        const foundDiscountCode = await checkDiscountCodeExit({
            model: discount, 
            filter: {
                discount_code: code,
                discount_shopId: convertToObjectIdMongo(shopId)
            }
         });
        if (!foundDiscountCode || !foundDiscountCode.discount_is_active) {
            throw new BadRequestError('Discount code not found!')
        }

        const {
         discount_is_active,
         discount_max_users,
         discount_start_date,
         discount_end_date,
         discount_min_order_value,
         discount_max_uses_per_user,
         discount_user_used, 
         discount_type, 
         discount_value   
        } = foundDiscountCode;

        if(!discount_is_active) throw new BadRequestError('Discount is not active yet!');
        if(!discount_max_users) throw new BadRequestError('Discount code has been used up!');
        if(new Date() < new Date(discount_start_date) || new Date() > new Date(discount_end_date)) {
            throw new BadRequestError('Discount code has expired')
        }
        // check cost order products is match min order
        let totalOrder = 0;
        if (discount_min_order_value > 0) {
           // get total value order
           totalOrder = products.reduce((acc, product ) => {
            return acc + (product.product_price * product.product_quantity)
           }, 0);

           if(totalOrder < discount_min_order_value) throw new BadRequestError(`Discount require minimum orders value is ${discount_min_order_value}`)
        }
        
        if (discount_max_uses_per_user > 0) {
            const userUsedDiscount = discount_user_used.find(user => user.userId === userId) 
            if (userUsedDiscount) {
                // check to see how many dicount has been used by this user
            }
        } 

        const discountAmount = discount_type === 'fixed_amount' ? discount_value : totalOrder * (discount_value / 100);

        return {
            totalOrder,
            discountAmount,
            totalPrice: totalOrder - discountAmount
        }

    }


    static async deleteDiscount({shopId, code}) {
        /**
         * Check this discoutn is avaible
         * Check this discount has using in another user
         * 
         **/
        return await discount.findOneAndDelete({
            discount_code: code,
            discount_shopId: convertToObjectIdMongo(shopId)
        })
    }

    static async cancelDiscount() {
        // check this discoutn code is exits
        const foundDiscountCode = await checkDiscountCodeExit({
            model: discount, 
            filter: {
                discount_code: code,
                discount_shopId: convertToObjectIdMongo(shopId)
            }
         });
        if (!foundDiscountCode || !foundDiscountCode.discount_is_active) {
            throw new BadRequestError('Discount code not found!')
        } 

        const discountCancel = await discount.findOneAndUpdate({
            _id: foundDiscountCode._id
        }, 
        {
            $pull: { discount_user_used:  userId},
            $inc: {
                discount_max_users: 1,
                discount_uses_count: -1
            }
        })
        return discountCancel;
    }

}

module.exports = {
    discountServices: DiscountServices
}