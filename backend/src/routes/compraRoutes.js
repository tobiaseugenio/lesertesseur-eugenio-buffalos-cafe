import { Router } from "express";
import compraController from "../controllers/CompraController.js";
import authenticate from "../middlewares/authenticate.js";

const compraRouter = Router();

compraRouter.post("/checkout", authenticate, compraController.checkout);

export default compraRouter;
