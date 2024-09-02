'use strict'

const { log } = require("winston");
const { NotFoundError, BadRequestError } = require("../core/error.response");
const { findShopById } = require("../models/repositories/shop.repo");
const SPU = require("../models/spu.model");
const { randomProductId } = require("../utils");
const {newSku, allSkuById} = require("./sku.services");
const skuModel = require("../models/sku.model");
const _ = require('lodash')

const newSpu = async ({
    product_id,
    product_name,
    product_thumb,
    product_description,
    product_price,
    product_category,
    product_shop,
    product_attributes,
    product_quantity,
    product_variantions,
    sku_list = []
}) => {
    try {
         // 1. check if shop is avaiabled

         const foundShop = await findShopById({shop_id: product_shop});       

         if(!foundShop) throw new NotFoundError('Shop not found!');

         // 2. create spu

         const spu = await SPU.create({
            product_id: randomProductId(),
            product_name,
            product_thumb,
            product_description,
            product_price,
            product_category,
            product_shop,
            product_attributes,
            product_quantity,
            product_variantions
         })
         
         if(spu && sku_list.length ) {
            // 3. create skus
            const sku = await newSku({spu_id: spu.product_id, sku_list});
        
         }
        
         // 4. sync data via elasticsearch

         return spu;


    } catch (error) {
        console.error(error)
    }

}

const getOneSpu = async ({spu_id}) => {
    console.log(spu_id);
    
     const spu = await SPU.findOne({
        product_id: spu_id,
        isPublish: false
    }).lean()
    if(!spu) throw new NotFoundError('spu not exit');
    const skus = await allSkuById({product_id: spu.product_id})
    return {
        spu_info: _.omit(spu, ['__v', 'updatedAt', 'createdAt', 'isDeleted']),
        sku_list: skus.map(sku => _.omit(sku, ['__v', 'updatedAt', 'createdAt']))
    }
}

module.exports = {
    newSpu,
    getOneSpu
}