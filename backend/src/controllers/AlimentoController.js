import alimentoRepository from "../repositories/AlimentoRepository.js";
import AlimentoResponse from "../responses/AlimentoResponse.js";
import ApiResponse from "../responses/ApiResponse.js";
import HttpStatus from "../enums/HttpStatus.js";

class AlimentoController {
    getAll = (req, res) => {
        ApiResponse.success(
            res,
            HttpStatus.OK,
            AlimentoResponse.fromAlimentos(alimentoRepository.findAll())
        );
    };
}

export default new AlimentoController();
