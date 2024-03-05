
const { Types, Schema } = require('mongoose');
const { product, electronic, clothing, furniture } = require('../product.model');


const findAllDraftsForShop = async ({query, limit, skip}) => {
    return await queryProducts({query, limit, skip})
}

const findAllPublicForShop = async ({query, limit, skip}) => {
    return await queryProducts({query, limit, skip})
 }

const publicProductByShop = async ({product_shop, product_id}) => {
    let foundShop = await product.findOne({
        product_shop: new Types.ObjectId(product_shop),
        _id:  new Types.ObjectId(product_id)
    })
    if (!foundShop) return null;
    
    foundShop.isDraft = false;
    foundShop.isPublish = true;
    const modifyCount = await foundShop.updateOne(foundShop);
    return modifyCount;

}
const queryProducts = async ({query, limit, skip}) => {
    return await product.find(query)
    .populate('product_shop', 'name email -_id')
    .sort({ updateAt: -1})
    .skip(skip)
    .limit(limit)
    .lean()
    .exec()
}
module.exports = {
    findAllDraftsForShop,
    publicProductByShop,
    findAllPublicForShop
}