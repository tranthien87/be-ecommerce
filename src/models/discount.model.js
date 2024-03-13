'use strict'

const { Schema, model, Types} = require('mongoose'); // Erase if already required

const COLLECTION_NAME = 'Discount';
const DOCUMENT_NAME = 'Discounts'


// Declare the Schema of the Mongo model
const discountSchema = new Schema({
    discount_name: { type: String, require: true},
    discount_description: { type: String, require: true},
    discount_type: { type: String, default: "fixed_amount"}, // or percentage
    discount_value: {type:Number, require: true},
    discount_code: { type: String, require: true},
    discount_start_date: { type: Date, require: true},
    discount_end_date: { type: Date, require: true},
    discount_max_users: { type: Number, require: true},// number discount can use
    discount_uses_count: { type: Number, require: true}, // number discount has used
    discount_user_used: { type: Array, default: []}, // who was used this discount
    discount_max_uses_per_user: { type: Number, require: true}, // maximum discount number user can you
    discount_min_order_value: { type: Number, require: true},
    discount_shopId: { type: Schema.Types.ObjectId, ref: "Shop"},
    discount_is_active: { type: Boolean, default: true},
    discount_applies_to: { type: String, require: true, enum: ['all', 'specific']},
    discount_product_ids: { type: Array, default: [] }, // numbe product able to appliy
}, {
    collection: COLLECTION_NAME,
    timestamps: true
});

//Export the model
module.exports = {
    discount: model(DOCUMENT_NAME, discountSchema)
}