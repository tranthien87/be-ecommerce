'use strict'
const { ReasonPhrases ,StatusCode } = require('http-status-codes');

// const StatusCode = {
//     FORBIDDEN: '403',
//     CONFLICT: '409'
// }
// const ReasonStatusCode = {
//     FORBIDDEN: 'Bad request error',
//     CONFLICT: 'Conflict error'
// }
class ErrorResponse extends Error {
    constructor(message, status) {
        super(message)
        this.status = status
    }

}

class ConflictResponseError extends ErrorResponse {
    constructor(message = ReasonPhrases.CONFLICT, statusCode = StatusCode.FORBIDDEN ) {
        super(message, statusCode)
    }
}
class BadRequestError extends ErrorResponse {
    constructor(message = ReasonPhrases.CONFLICT, statusCode = StatusCode.FORBIDDEN ) {
        super(message, statusCode)
    }
}
class AuthFailueError extends ErrorResponse {
    constructor(message = ReasonPhrases.UNAUTHORIZED, statusCode = StatusCode.UNAUTHORIZED ) {
        super(message, statusCode)
    }
}
class NotFoundError extends ErrorResponse {
    constructor(message = ReasonPhrases.NOT_FOUND, statusCode = StatusCode.NOT_FOUND ) {
        super(message, statusCode)
    }
}

module.exports = {
    ErrorResponse, ConflictResponseError, BadRequestError, AuthFailueError, NotFoundError
}