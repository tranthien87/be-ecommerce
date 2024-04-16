'use strict'

const { StatusCodes } = require('http-status-codes');
const CommentService = require('../services/comment.services');
const { SuccessResponse } = require('../core/success.response');

class CommentController {
    createComment = async (req, res, next) => {
        return new SuccessResponse({
            message: "Create new comment successfull!",
            statusCode: StatusCodes.CREATED,
            metadata: await CommentService.createComment(req.body)
        }).send(res)
    }

    deleteComment = async (req, res, next) => {
        return new SuccessResponse({
            message: "Delete comment successfull!",
            statusCode: StatusCodes.CREATED,
            metadata: await CommentService.deleteComment(req.body)
        }).send(res)
    }


    getCommentByParentId = async (req, res, next) => {
        return new SuccessResponse({
            message: "Get list comment successfull!",
            statusCode: StatusCodes.OK,
            metadata: await CommentService.getCommentByParentId(req.query)
        }).send(res)
    }
}

module.exports = new CommentController()