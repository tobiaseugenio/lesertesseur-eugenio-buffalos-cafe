import alimentoService from "../services/AlimentoService.js";
import AlimentoResponse from "../responses/AlimentoResponse.js";
import ApiResponse from "../responses/ApiResponse.js";
import HttpStatus from "../enums/HttpStatus.js";

class AlimentoController {
    getAll = (req, res) => {
        ApiResponse.success(
            res,
            HttpStatus.OK,
            AlimentoResponse.fromAlimentos(alimentoService.getAll())
        );
    };

    create = (req, res, next) => {
        try {
            const alimento = alimentoService.create(req.body);
            ApiResponse.success(
                res,
                HttpStatus.CREATED,
                AlimentoResponse.fromAlimento(alimento)
            );
        } catch (error) {
            next(error);
        }
    };
}

export default new AlimentoController();
