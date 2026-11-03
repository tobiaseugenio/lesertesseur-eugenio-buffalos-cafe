import { ForbiddenError, UnauthorizedError } from "../exceptions/AppError.js";
import clienteRepository from "../repositories/ClienteRepository.js";

async function requireAdmin(req, res, next) {
    try {
        const user = await clienteRepository.findById(req.auth.userId);

        if (!user) {
            return next(new UnauthorizedError("La sesión no es válida o expiró."));
        }

        if (user.role !== "admin") {
            return next(new ForbiddenError("Solo un administrador puede administrar productos."));
        }

        next();
    } catch (error) {
        next(error);
    }
}

export default requireAdmin;
