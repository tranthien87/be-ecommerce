'use strict'
const { Schema , model } = require("mongoose");


const DOCUMENT = "Comments";
const COLLECTION = "Comments";

const commentSchema = new Schema({
    comment_productId: { type : Schema.Types.ObjectId, required : true, ref: 'Product' },
    comment_userId: { type: Schema.Types.ObjectId, ref: "User"},
    comment_content: { type: String, default: "text", require: true},
    comment_parentId: { type: Schema.Types.ObjectId, default: null},
    comment_left: { type: Schema.Types.ObjectId},
    comment_right: { type: Schema.Types.ObjectId},
    isDelete: { type: Boolean, default: false}
}, {
    timestamps: true,  
    collection: COLLECTION
})

module.exports = {
    comment: model(DOCUMENT, commentSchema)
}