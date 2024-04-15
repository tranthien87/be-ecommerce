'use strict'

const { NotFoundError, ConflictResponseError } = require('../core/error.response');
const {comment: Comment} = require('../models/comment.model');
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
            const parentComment = await Comment.findById(parentCommentId);
            
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

            const maxRigthValue = await Comment.findOne({
                "comment_productId": convertToObjectIdMongo(productId)
            }, "comment_right", {sort: {comment_right: -1}})
            
            if(maxRigthValue) {
                rightValue = maxRigthValue.right + 1;
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

    static async getCommentByParentId({
        productId,
        parentCommentId = null,
        limit = 50,
        offset = 0
    }) {
        console.log("🚀 ~ CommentService ~ productId:", productId)
        if (parentCommentId) {
            const parentComment = await Comment.findById(parentCommentId);
            if (!parentComment) throw new NotFoundError('comment is not found!')
            
            // find comments: > comment left && < comment right

            const comment = await Comment.find({
                comment_productId: convertToObjectIdMongo(productId),
                comment_left: { $gt: parentComment.comment_left},
                comment_right: { $lt: parentComment.comment_right}
            }).select({
                comment_left: 1,
                comment_right: 1,
                comment_content: 1,
                comment_parentId: 1
            }).sort({
                comment_left: 1
            }).limit(limit).skip(offset)
            return comment;
        }
        return await Comment.find({
            comment_productId: convertToObjectIdMongo(productId),
            comment_parentId: parentCommentId

        }).select({
            comment_left: 1,
            comment_right: 1,
            comment_content: 1,
            parent_commentId: 1
        }).sort({
            comment_left: 1
        })
    }
}

module.exports = CommentService