import compraService from "../services/CompraService.js";
import ClienteResponse from "../responses/ClienteResponse.js";
import ApiResponse from "../responses/ApiResponse.js";
import HttpStatus from "../enums/HttpStatus.js";

class CompraController {
    checkout = async (req, res, next) => {
        try {
            const purchase = await compraService.checkout(req.auth.userId, req.body);
            ApiResponse.success(res, HttpStatus.OK, {
                user: ClienteResponse.fromCliente(purchase.user),
                total: purchase.total,
            });
        } catch (error) {
            next(error);
        }
    };
}

export default new CompraController();
