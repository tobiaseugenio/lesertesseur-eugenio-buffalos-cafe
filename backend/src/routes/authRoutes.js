import { Router } from "express";
import authController from "../controllers/AuthController.js";
import authenticate from "../middlewares/authenticate.js";

const authRouter = Router();

authRouter.post("/register", authController.register);
authRouter.post("/login", authController.login);
authRouter.get("/me", authenticate, authController.me);

export default authRouter;