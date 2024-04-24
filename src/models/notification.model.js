'use strict'

const { Schema, model } = require("mongoose");

const DOCUMENT = "Notification";
const COLLECTION = "Notifications";

const notificationSchema = new Schema({
    noti_type: {type: String, enum: ['ORDER-001', 'ORDER-002', 'SHOP-01', 'PROMOTION-01'], require: true},
    noti_senderId: { type: Schema.Types.ObjectId, require: true, ref: 'Shop'},
    noti_receivedId: {type: Number, require: true},
    noti_content: { type: String, require: true },
    noti_options: { type: Object, default: {} },
}, {
    timestamps: true,  
    collection: COLLECTION
})

module.exports = {
    notification: model(DOCUMENT, notificationSchema)
}