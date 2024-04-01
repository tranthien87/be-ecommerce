'use strict'

const { BadRequestError } = require('../core/error.response');
const { inventory } = require('../models/inventory.model')
const { findProductById, findProductByIdCart } = require('../models/repositories/product.repo')


class InventoryService {
    static async addStockToInventory({stock, productId, shopId, location = '12, Tran Phu, Q1, HCM'}) {
        const product = await findProductByIdCart({productId});
        if (!product) throw new BadRequestError('Product does not exit');

        const query ={ 
            inven_shopId: shopId,
            inven_productId: productId
        }, updateSet = {
            $inc: { inven_stock: stock},
            $set: { inven_location: location}
        }, option = { upsert: true, new: true};

        return await inventory.findOneAndUpdate(query, updateSet, option);

    }
}

module.exports = InventoryService