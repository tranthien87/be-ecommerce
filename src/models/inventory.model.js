'use strict'

const { Schema, model} = require('mongoose'); // Erase if already required

const COLLECTION_NAME = 'Inventory';
const DOCUMENT_NAME = 'Inventories'


// Declare the Schema of the Mongo model
const inventorySchema = new Schema({
    inven_productId: { type: Schema.Types.ObjectId, ref: "Product"},
    inven_location: { type: String, default: "unknow"},
    inven_stock: { type: Number, require: true},
    inven_shopId: { type: Schema.Types.ObjectId, ref: "Shop"},
    inven_reservation: { type: Array, default: []}
}, {
    collection: COLLECTION_NAME,
    timestamps: true
});

//Export the model
module.exports = {
    inventory: model(DOCUMENT_NAME, inventorySchema)
}