'use strict'
const { Schema , model } = require("mongoose");


const DOCUMENT = "Comments";
const COLLECTION = "Comments";

const commentSchema = new Schema({
    comment_productId: { type : Schema.Types.ObjectId,ref: 'Product' },
    comment_userId: { type: Number, default: 1},
    comment_content: { type: String, default: "text", require: true},
    comment_parentId: { type: Schema.Types.ObjectId, ref: DOCUMENT},
    comment_left: { type: Number, default: 0},
    comment_right: { type: Number, default: 0},
    isDelete: { type: Boolean, default: false}
}, {
    timestamps: true,  
    collection: COLLECTION
})

module.exports = {
    comment: model(DOCUMENT, commentSchema)
}