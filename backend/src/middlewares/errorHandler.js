import HttpStatus from "../enums/HttpStatus.js";
import { Messages } from "../enums/Messages.js";
import ApiResponse from "../responses/ApiResponse.js";

const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
    const message = err.message || Messages.INTERNAL_SERVER_ERROR;

    ApiResponse.error(res, statusCode, message);
};

export default errorHandler;
