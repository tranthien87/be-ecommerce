'use strict'
const {Schema, model, Types} = require('mongoose'); 

const COLLECTION_NAME = 'Products';
const DOCUMENT_NAME = 'Product'

const productSchema = new Schema({
    product_name: { type: String, require: true},
    product_thumb: { type: String, require: true},
    product_description: String,
    product_number: { type: Number, require: true},
    product_quantity: { type: Number, require: true},
    product_type: { type: String, require: true, enum: ['Clothing', 'Electronics', 'Furniture']},
    product_shop: { type: Schema.Types.ObjectId, ref: 'Shop'},
    product_attributes: { type: Schema.Types.Mixed, reuire: true}
}, {
    timestamps: true,
    collection: COLLECTION_NAME
})


const closthingSchema = new Schema({
    brand: {type: String, require: true},
    size: String,
    material: String,
    product_shop: { type: Schema.Types.ObjectId, ref: 'Shop'},
}, {
    timestamps: true,
    collation: 'clothes'
})

const electronicSchema = new Schema({
    manufacture: {type: String, require: true},
    model: String,
    color: String,
    product_shop: { type: Schema.Types.ObjectId, ref: 'Shop'},
}, {
    timestamps: true,
    collation: 'electronics'
})

const furnitureSchema = new Schema({
    brand: {type: String, require: true},
    size: String,
    material: String,
    product_shop: { type: Schema.Types.ObjectId, ref: 'Shop'},
}, {
    timestamps: true,
    collection: 'furnitures'
})


module.exports = {
    product: model(DOCUMENT_NAME, productSchema),
    clothing: model('Clothing', closthingSchema),
    electronic: model('Electronics', electronicSchema),
    furniture: model('Furniture', furnitureSchema)
}