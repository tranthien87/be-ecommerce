

const {model, Schema } = require('mongoose');

const DOCUMENT = 'opt_log';
const COLLECTION = 'opt_logs';

const optSchema = new Schema({
    opt_token: {type: String, require: true},
    opt_email: {type: String, require: true},
    opt_status: {type: String, default: 'pending', enum: ['pending', 'activated', 'block']},
    opt_expire: {type: Date, default: Date.now(), expires: 60}
},
{
    collection: COLLECTION,
    timestamps: true
})

module.exports = model(DOCUMENT, optSchema)