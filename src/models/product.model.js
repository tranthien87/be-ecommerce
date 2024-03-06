'use strict'
const {Schema, model, Types} = require('mongoose'); 
const slugify = require('slugify');
const COLLECTION_NAME = 'Products';
const DOCUMENT_NAME = 'Product'

const productSchema = new Schema({
    product_name: { type: String, require: true},
    product_thumb: { type: String, require: true},
    product_description: String,
    product_slug: String,
    product_price: { type: Number, require: true},
    product_quantity: { type: Number, require: true},
    product_type: { type: String, require: true, enum: ['Clothing', 'Electronics', 'Furniture']},
    product_shop: { type: Schema.Types.ObjectId, ref: 'Shop'},
    product_attributes: { type: Schema.Types.Mixed, require: true},
    product_ratingAverage: {
        type: Number,
        default: 4.5,
        min: [1.0, 'Rating must above 1.0'],
        max: [5.0, 'Rating max is 5.0'],
        set: v => Math.round(v * 10) / 10
    },
    product_variations: { type: Array, default: []},
    isDraft: { type: Boolean, default: true, select: false, index: true},
    isPublish: { type: Boolean, default: false, select: false, index: true},
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
// create index for search
productSchema.index({product_name: 'text', product_description: 'text'})

productSchema.pre('save', function(next) {
    this.product_slug = slugify(this.product_name, {lower: true})
    next();
})


module.exports = {
    product: model(DOCUMENT_NAME, productSchema),
    clothing: model('Clothing', closthingSchema),
    electronic: model('Electronics', electronicSchema),
    furniture: model('Furniture', furnitureSchema)
}