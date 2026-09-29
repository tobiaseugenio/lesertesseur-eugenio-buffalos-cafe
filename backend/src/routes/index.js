import { Router } from "express";
import clienteRouter from "./clienteRoutes.js";

const router = Router();

router.use("/clientes", clienteRouter);

export default router;
