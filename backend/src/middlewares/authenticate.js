import { UnauthorizedError } from "../exceptions/AppError.js";
import { verifyAuthToken } from "../utils/authToken.js";

function authenticate(req, res, next){
    const authorization = req.headers.authorization || "";
    const token = authorization.startsWith("Bearer ")
        ? authorization.slice("Bearer ".length)
        : "";

    if(!token){
        return next(new UnauthorizedError("Debes iniciar sesión para acceder a este recurso."));
    }

    try{
        const claims = verifyAuthToken(token);
        req.auth = { userId: claims.sub };
        next();
    }catch(error){
        next(error);
    }
}

export default authenticate;