import { Router } from "express";
import authController from "../controllers/AuthController.js";
import authenticate from "../middlewares/authenticate.js";

const authRouter = Router();

authRouter.post("/register", authController.register);
authRouter.post("/login", authController.login);
authRouter.get("/me", authenticate, authController.me);
authRouter.post("/balance", authenticate, authController.addBalance);

export default authRouter;