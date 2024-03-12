const {inventory} = require("../../models/inventory.model")

const insertInventory = async ({productId, stock, shopId, location = "unknow"}) => {
    return await inventory.create({
        inven_productId: productId,
        inven_location: location,
        inven_shopId: shopId,
        inven_stock: stock
    })
}

module.exports = {
    insertInventory
}