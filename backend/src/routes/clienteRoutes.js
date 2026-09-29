import { Router } from "express";
import clienteController from "../controllers/ClienteController.js";

const clienteRouter = Router();

clienteRouter.get("/", clienteController.getAll);
clienteRouter.get("/:id", clienteController.getById);
clienteRouter.post("/", clienteController.create);
clienteRouter.put("/:id", clienteController.update);
clienteRouter.delete("/:id", clienteController.delete);

export default clienteRouter;
