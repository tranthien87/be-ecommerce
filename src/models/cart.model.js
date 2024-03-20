'use strict'

const { Schema, model, Types} = require('mongoose'); // Erase if already required

const COLLECTION_NAME = 'Carts';
const DOCUMENT_NAME = 'Cart'

// Declare the Schema of the Mongo model
const cartSchema = new Schema({
    cart_state: {
        type: String,
        require: true,
        enum: ['active', 'completed', 'failed', 'pendding'],
        default: 'active'
    },
    cart_products: {
        type: Array,
        default: [],
        require: true
    },
    cart_count_product: {
        type: Number, default: 0
    },
    cart_userId: { type: Number, require: true}

}, {
    collection: COLLECTION_NAME,
    timestamps: true
});

//Export the model
module.exports = {
    cart: model(DOCUMENT_NAME, cartSchema)
}