import HttpStatus from "../enums/HttpStatus.js";
import ApiResponse from "../responses/ApiResponse.js";

const notFoundHandler = (req, res) => {
    ApiResponse.error(res, HttpStatus.NOT_FOUND, `Ruta ${req.originalUrl} no encontrada`);
};

export default notFoundHandler;
