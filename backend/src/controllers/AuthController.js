import authService from "../services/AuthService.js";
import ClienteResponse from "../responses/ClienteResponse.js";
import ApiResponse from "../responses/ApiResponse.js";
import HttpStatus from "../enums/HttpStatus.js";

class AuthController {
    register = async (req, res, next) => {
        try{
            const session = await authService.register(req.body);
            ApiResponse.success(res, HttpStatus.CREATED, {
                token: session.token,
                user: ClienteResponse.fromCliente(session.user)
            });
        }catch(error){
            next(error);
        }
    };

    login = async (req, res, next) => {
        try{
            const session = await authService.login(req.body);
            ApiResponse.success(res, HttpStatus.OK, {
                token: session.token,
                user: ClienteResponse.fromCliente(session.user)
            });
        }catch(error){
            next(error);
        }
    };

    me = (req, res, next) => {
        try{
            const cliente = authService.getUser(req.auth.userId);
            ApiResponse.success(res, HttpStatus.OK, ClienteResponse.fromCliente(cliente));
        }catch(error){
            next(error);
        }
    };
}

export default new AuthController();