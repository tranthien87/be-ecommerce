const {model, Schema } = require('mongoose');

const DOCUMENT = 'template';
const COLLECTION = 'templates';

const templateSchema = new Schema({
    temp_id: {type: Number, require: true},
    temp_name: {type: String, require: true},
    temp_status: {type: String, default: 'actived', enum: ['pending', 'activated', 'block']},
    temp_html: {type: String, require: true},
},
{
    collection: COLLECTION,
    timestamps: true
})

export default model(DOCUMENT, templateSchema);