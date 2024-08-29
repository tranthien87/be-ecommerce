'use strict'

const {model, Schema} = require('mongoose');


const DOCUMENT_NAME = 'Sku'
const COLLECTION_NAME = 'Skus'

const skuSchema = new Schema({
    sku_id: { type: String, require: true, unique: true},
    sku_tier_idx: { type: Array, default: [0]}, // [0,0], [0,1]
    /**
     * color = ['red', 'green'] --> [0,1]
     * size = ['S', 'M'] --> [0,1]
     * attr product = [red, M] ==> [0,1]
    **/

    sku_default: { type: Boolean, default: false},
    sku_slug: { type: String, default: ''},
    sku_sort: {type: Number, default: 0},
    sku_price: { type: String, require: true},
    sku_stock: { type: Number, default: 0},
    product_id: {type: String, require: true}

}, {
    timestamps: true,
    collection: COLLECTION_NAME
})

module.exports = model(DOCUMENT_NAME, skuSchema);