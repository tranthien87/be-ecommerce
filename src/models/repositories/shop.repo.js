

'use strict'

const shopModel = require("../shop.model")

const selectStructe = {
    email: 1,
    status: 1,
    roles: 1 
}
const findShopById = async ({shop_id, select = selectStructe}) => {
    return await shopModel.findById(shop_id).select(select).lean();
}

module.exports = {findShopById}