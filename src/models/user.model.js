'use strict'

const {model, Schema} = require('mongoose');


const DOCUMENT_NAME = 'User'
const COLLECTION_NAME = 'Users'

const userSchema = new Schema({
    usr_id: { type: Number, require: true},
    usr_slug: { type: String, require: true},
    usr_name: {type: String, default: ''},
    usr_password: { type: String, default: ''},
    usr_salf: {type: String, default: ''},
    usr_email: { type: String, require: true},
    usr_phone: {type: String, default: ''},
    usr_sex: {type: String, default: ''},
    usr_avata: { type: String, default: ''},
    usr_date_of_birth: {type: Date, default: null},
    usr_role: { type: Schema.Types.ObjectId, ref: 'Role'},
    usr_status: {
        type: String, enum: ['pending', 'block', 'active'], default: 'pending'
    } 

}, {
    timestamps: true,
    collection: COLLECTION_NAME
})

module.exports = model(DOCUMENT_NAME, userSchema);