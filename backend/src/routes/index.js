import { Router } from "express";
import clienteRouter from "./clienteRoutes.js";
import alimentoRouter from "./alimentoRoutes.js";

const router = Router();

router.use("/clientes", clienteRouter);
router.use("/products", alimentoRouter);

export default router;
