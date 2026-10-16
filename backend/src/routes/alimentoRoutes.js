import { Router } from "express";
import alimentoController from "../controllers/AlimentoController.js";

const alimentoRouter = Router();

alimentoRouter.get("/", alimentoController.getAll);
alimentoRouter.post("/", alimentoController.create);
alimentoRouter.delete("/:id", alimentoController.delete);

export default alimentoRouter;
