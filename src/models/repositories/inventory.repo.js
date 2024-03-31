const {inventory} = require("../../models/inventory.model")
const { convertToObjectIdMongo } = require('../../utils');


const insertInventory = async ({productId, stock, shopId, location = "unknow"}) => {
    return await inventory.create({
        inven_productId: productId,
        inven_location: location,
        inven_shopId: shopId,
        inven_stock: stock
    })
}

const reservationInventory = async ({productId, quantity, cartId}) => {
    const query = {
        inven_productId: convertToObjectIdMongo(productId),
        inven_stock: {$gte: quantity}
    }, updateSet = {
        $inc: {inven_stock: -quantity},
        $push : {
            inven_reservation: {
                quantity,
                productId,
                createOn: new Date()
            }
        }
        
    }, options = { upsert: true, new: true};

    return await inventory.updateOne(query, updateSet);
}

module.exports = {
    insertInventory, reservationInventory
}