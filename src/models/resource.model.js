'use strict'

const {model, Schema} = require('mongoose');


const DOCUMENT_NAME = 'Resource'
const COLLECTION_NAME = 'Resources'

const resourceSchema = new Schema({
    resc_name: { type: String, require: true},
    resc_slug: { type: String, require: true},
    resc_description: {type: String, default: ''},
}, {
    timestamps: true,
    collection: COLLECTION_NAME
})

module.exports = model(DOCUMENT_NAME, resourceSchema);