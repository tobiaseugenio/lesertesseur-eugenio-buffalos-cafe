import { Router } from "express";
import alimentoController from "../controllers/AlimentoController.js";

const alimentoRouter = Router();

alimentoRouter.get("/", alimentoController.getAll);

export default alimentoRouter;
