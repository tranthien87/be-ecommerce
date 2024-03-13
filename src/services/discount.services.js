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
const {findAllProducts} = require('../models/repositories/product.repo')

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

    static async updateDiscountCode () {

    }
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

        if (!foundDiscountCode && !foundDiscountCode.discount_is_active) {
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
                page: +page,
                limit: +limit,
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
                page: +page,
                limit: +limit,
                sort: 'ctime',
                select: ['product_name']
            }) 
        }
        return products;
    }
}