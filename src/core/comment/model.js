const mongoose = require('mongoose');

const DOCUMENT = 'Comment';
const COLLECTION = "Comments";

const commentSchema = new mongoose.Schema({
    text: { type: String, required: true },
    userId: {type: mongoose.Types.ObjectId, ref:'User',required:true},
    postId:{type: mongoose.Types.ObjectId ,ref :'Post'},
    parentSlug: {type: String, default: ''},
    slug: {type: String, require: true},
    
}, {
    collection: COLLECTION,
    timestamps: true
})

module.exports = {
    comment: mongoose.model(DOCUMENT, commentSchema)
}