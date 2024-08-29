'use strict'
const {Schema, model, Types} = require('mongoose'); 
const slugify = require('slugify');
const COLLECTION_NAME = 'Spu';
const DOCUMENT_NAME = 'Spus'

const productSchema = new Schema({
    product_id: { type: String, default: ''},
    product_name: { type: String, require: true},
    product_thumb: { type: String, require: true},
    product_description: String,
    product_slug: String,
    product_price: { type: Number, require: true},
    product_quantity: { type: Number, require: true},
    product_category: { type: Array, default:[]},
    // product_type: { type: String, require: true, enum: ['Clothing', 'Electronics', 'Furniture']},
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

    /**
     * 
     * tier varidations: 
     *  [
     *       {
     *          images: [],
     *          name: 'size',
     *          options: ['S', 'M', 'L']
     *       } 
     *       {
     *          images: [],
     *          name: 'color',
     *          options: ['red', 'green', 'blue']
     *       } 
     *  ]
    */
    isDraft: { type: Boolean, default: true, select: false, index: true},
    isPublish: { type: Boolean, default: false, select: false, index: true},
    idDeleted: {type: Boolean, default: false}
}, {
    timestamps: true,
    collection: COLLECTION_NAME
})

// create index for search
productSchema.index({product_name: 'text', product_description: 'text'})

productSchema.pre('save', function(next) {
    this.product_slug = slugify(this.product_name, {lower: true})
    next();
})


module.exports =  model(DOCUMENT_NAME, productSchema);