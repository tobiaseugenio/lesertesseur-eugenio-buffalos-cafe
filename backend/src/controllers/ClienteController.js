import clienteService from "../services/ClienteService.js";
import ClienteResponse from "../responses/ClienteResponse.js";
import ApiResponse from "../responses/ApiResponse.js";
import HttpStatus from "../enums/HttpStatus.js";

class ClienteController {
    getAll = async (req, res, next) => {
        try {
            const clientes = await clienteService.getAll();
            ApiResponse.success(res, HttpStatus.OK, ClienteResponse.fromClientes(clientes));
        } catch (error) {
            next(error);
        }
    };

    getById = async (req, res, next) => {
        try {
            const cliente = await clienteService.getById(req.params.id);
            ApiResponse.success(res, HttpStatus.OK, ClienteResponse.fromCliente(cliente));
        } catch (error) {
            next(error);
        }
    };

    create = async (req, res, next) => {
        try {
            const cliente = await clienteService.create(req.body);
            ApiResponse.success(res, HttpStatus.CREATED, ClienteResponse.fromCliente(cliente));
        } catch (error) {
            next(error);
        }
    };

    update = async (req, res, next) => {
        try {
            const cliente = await clienteService.update(req.params.id, req.body);
            ApiResponse.success(res, HttpStatus.OK, ClienteResponse.fromCliente(cliente));
        } catch (error) {
            next(error);
        }
    };

    delete = async (req, res, next) => {
        try {
            await clienteService.delete(req.params.id);
            ApiResponse.success(res, HttpStatus.OK, null);
        } catch (error) {
            next(error);
        }
    };
}

export default new ClienteController();
