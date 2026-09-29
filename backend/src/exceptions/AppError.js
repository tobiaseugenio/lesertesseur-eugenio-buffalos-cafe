import HttpStatus from "../enums/HttpStatus.js";

class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        Error.captureStackTrace?.(this, this.constructor);
    }
}

export class BadRequestError extends AppError {
    constructor(message) {
        super(message, HttpStatus.BAD_REQUEST);
    }
}

export class NotFoundError extends AppError {
    constructor(message) {
        super(message, HttpStatus.NOT_FOUND);
    }
}

export class ConflictError extends AppError {
    constructor(message) {
        super(message, HttpStatus.CONFLICT);
    }
}

export class InternalServerError extends AppError {
    constructor(message) {
        super(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

export default AppError;
