'use strict'
const { ReasonPhrases , StatusCodes } = require('http-status-codes');
const logger = require('../logs/logger');


class ErrorResponse extends Error {
    constructor(message, status) {
        super(message)
        this.status = status
        // logger.setInfoLog(this.message, [ '/v1/api/login', 'uuid', {}])
    }

}

class ConflictResponseError extends ErrorResponse {
    constructor(message = ReasonPhrases.CONFLICT, statusCode = StatusCodes.FORBIDDEN ) {
        super(message, statusCode)
    }
}
class BadRequestError extends ErrorResponse {
    constructor(message = ReasonPhrases.CONFLICT, statusCode = StatusCodes.FORBIDDEN ) {
        super(message, statusCode)
    }
}
class AuthFailueError extends ErrorResponse {
    constructor(message = ReasonPhrases.UNAUTHORIZED, statusCode = StatusCodes.UNAUTHORIZED ) {
        super(message, statusCode)
    }
}
class NotFoundError extends ErrorResponse {
    constructor(message = ReasonPhrases.NOT_FOUND, statusCode = StatusCodes.NOT_FOUND ) {
        super(message, statusCode)
    }
}
class ForbiddenError extends ErrorResponse {
    constructor(message = ReasonPhrases.FORBIDDEN, statusCode = StatusCodes.FORBIDDEN ) {
        super(message, statusCode)
    }
}
module.exports = {
    ErrorResponse, 
    ConflictResponseError,
    BadRequestError, 
    AuthFailueError, 
    NotFoundError,
    ForbiddenError
}