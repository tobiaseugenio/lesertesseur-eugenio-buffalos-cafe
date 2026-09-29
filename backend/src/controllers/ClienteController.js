import clienteService from "../services/ClienteService.js";
import ClienteResponse from "../responses/ClienteResponse.js";
import ApiResponse from "../responses/ApiResponse.js";
import HttpStatus from "../enums/HttpStatus.js";

class ClienteController {
    getAll = (req, res, next) => {
        try {
            const clientes = clienteService.getAll();
            ApiResponse.success(res, HttpStatus.OK, ClienteResponse.fromClientes(clientes));
        } catch (error) {
            next(error);
        }
    };

    getById = (req, res, next) => {
        try {
            const cliente = clienteService.getById(req.params.id);
            ApiResponse.success(res, HttpStatus.OK, ClienteResponse.fromCliente(cliente));
        } catch (error) {
            next(error);
        }
    };

    create = (req, res, next) => {
        try {
            const cliente = clienteService.create(req.body);
            ApiResponse.success(res, HttpStatus.CREATED, ClienteResponse.fromCliente(cliente));
        } catch (error) {
            next(error);
        }
    };

    update = (req, res, next) => {
        try {
            const cliente = clienteService.update(req.params.id, req.body);
            ApiResponse.success(res, HttpStatus.OK, ClienteResponse.fromCliente(cliente));
        } catch (error) {
            next(error);
        }
    };

    delete = (req, res, next) => {
        try {
            clienteService.delete(req.params.id);
            ApiResponse.success(res, HttpStatus.OK, null);
        } catch (error) {
            next(error);
        }
    };
}

export default new ClienteController();
