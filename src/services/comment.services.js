'use strict'

const { NotFoundError } = require('../core/error.response');
const Comment = require('../models/comment.model');
const { convertToObjectIdMongo } = require('../utils');


class CommentService {
    static async createComment ({
        productId, userId, content, parentCommentId = null
    }) {
        // create new comment
        const newComment = new Comment({
            comment_productId: productId,
            comment_userId: userId,
            comment_content: content,
            comment_parentId: parentCommentId
        })


        let rightValue;
        if (parentCommentId) {
            // reply comment
            const parentComment = Comment.findById(parentCommentId);
            if(!parentComment) throw new NotFoundError('comment not found') 
            rightValue = parentComment.comment_right;
            // update many comment

            await Comment.updateMany({
                comment_productId: convertToObjectIdMongo(productId),
                comment_right: {$gte: rightValue}
            }, { 
                $inc : { comment_right: 2 }
            })

            await Comment.updateMany({
                comment_productId: convertToObjectIdMongo(productId),
                comment_left: {$gt: rightValue}
            }, { 
                $inc : { comment_left: 2 }
            })

        } else {

            const maxRigthValue = Comment.findOne({
                "comment_productId": convertToObjectIdMongo(productId)
            }, "comment__right", {sort: {comment_right: -1}})
            
            if(maxRigthValue) {
                rightValue = Number(maxRigthValue.comment_right) + 1;
            } else {
                rightValue = 1
            }
        
        }
        // insert to comment
        newComment.comment_left = rightValue;
        newComment.comment_right = rightValue + 1;
        await newComment.save();
        return newComment;
    }
}

module.exports = CommentService