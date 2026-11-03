import alimentoService from "../services/AlimentoService.js";
import AlimentoResponse from "../responses/AlimentoResponse.js";
import ApiResponse from "../responses/ApiResponse.js";
import HttpStatus from "../enums/HttpStatus.js";

class AlimentoController {
    getAll = async (req, res, next) => {
        try {
            ApiResponse.success(
                res,
                HttpStatus.OK,
                AlimentoResponse.fromAlimentos(await alimentoService.getAll())
            );
        } catch (error) {
            next(error);
        }
    };

    create = async (req, res, next) => {
        try {
            const alimento = await alimentoService.create(req.body);
            ApiResponse.success(
                res,
                HttpStatus.CREATED,
                AlimentoResponse.fromAlimento(alimento)
            );
        } catch (error) {
            next(error);
        }
    };

    update = async (req, res, next) => {
        try {
            const alimento = await alimentoService.update(req.params.id, req.body);
            ApiResponse.success(
                res,
                HttpStatus.OK,
                AlimentoResponse.fromAlimento(alimento)
            );
        } catch (error) {
            next(error);
        }
    };

    delete = async (req, res, next) => {
        try {
            const alimento = await alimentoService.delete(req.params.id);
            ApiResponse.success(
                res,
                HttpStatus.OK,
                AlimentoResponse.fromAlimento(alimento)
            );
        } catch (error) {
            next(error);
        }
    };
}

export default new AlimentoController();
