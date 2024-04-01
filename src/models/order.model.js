'use strict'

const { Schema, model } = require('mongoose');
const COLLECTION_NAME = 'Orders';
const DOCUMENT_NAME = 'Order';

const orderShema = new Schema({
    order_userId: { type: Number, require: true},
    order_checkout: { type: Object, default: {}},
    order_shipping: { type: Object, default: {}},
    order_payment: { type: Object, default: {}},
    order_products: { type: Array, require: true},
    order_trackingNumber: {type: String, default: '#123131'},
    order_status: { type: String, enum: ['pending', 'confirmed', 'shipped', 'cancelled', 'delivered'], default: 'pending'}
}, {
    collection: COLLECTION_NAME,
    timestamps: {
        createdAt: 'createOn',
        updatedAt: 'modifyOn'
    }
})

module.exports = {
    order: model(DOCUMENT_NAME, orderShema)
}