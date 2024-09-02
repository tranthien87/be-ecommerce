'use strict'

const skuModel = require("../models/sku.model")
const { randomProductId } = require("../utils")
const _ = require('lodash')
const newSku = async ({spu_id, sku_list}) => {
    try {
        const sku_list_map = sku_list.map(sku => {
            return {
                ...sku,
                product_id: spu_id,
                sku_id: `${spu_id}.${randomProductId()}`
            }
        })
        console.log('sku list', `${spu_id}.${randomProductId()}`);
        
        const sku = await skuModel.create(sku_list_map);

        return sku;
    } catch (error) {
        return [];
    }

}
const getOneSku = async ({sku_id, product_id}) => {
    try {
        // 1. get sku from cache
        // 2. read cache

        const sku = await skuModel.findOne({
            sku_id, product_id
        }).lean()

        if(sku) {
            // 3. set cache
        }

        return _.omit(sku, ['__v', 'updatedAt', 'createdAt', 'isDeleted']);
    } catch (error) {
        console.error(error);
        return null;
    }
}

const allSkuById = async ({product_id}) => {
    try {
        const sku_list = await skuModel.find({product_id}).lean();
        return sku_list.map(sku =>  _.omit(sku, ['__v', '_id', 'createdAt']))
    } catch (error) {
        console.error(error);
        return [];
    }
}


module.exports = {newSku, getOneSku, allSkuById};