'use strict'

const { StatusCodes } = require('http-status-codes');
const CommentService = require('../services/comment.services');
const { SuccessResponse } = require('../core/success.response');

class CommentController {
    createComment = async (req, res, next) => {
        return new SuccessResponse({
            message: "Create new comment successfull!",
            statusCode: StatusCodessCodes.CREATED,
            metadata: await CommentService.createComment(req.body)
        }).send(res)
    }
}

module.exports = new CommentController()