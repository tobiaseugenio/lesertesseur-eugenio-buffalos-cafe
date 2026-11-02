import { Router } from "express";
import alimentoController from "../controllers/AlimentoController.js";

const alimentoRouter = Router();

alimentoRouter.get("/", alimentoController.getAll);
alimentoRouter.post("/", alimentoController.create);
alimentoRouter.put("/:id", alimentoController.update);
alimentoRouter.delete("/:id", alimentoController.delete);

export default alimentoRouter;
