import { Router } from "express";
import alimentoController from "../controllers/AlimentoController.js";
import authenticate from "../middlewares/authenticate.js";
import requireAdmin from "../middlewares/requireAdmin.js";

const alimentoRouter = Router();

alimentoRouter.get("/", alimentoController.getAll);
alimentoRouter.post("/", authenticate, requireAdmin, alimentoController.create);
alimentoRouter.put("/:id", authenticate, requireAdmin, alimentoController.update);
alimentoRouter.delete("/:id", authenticate, requireAdmin, alimentoController.delete);

export default alimentoRouter;
