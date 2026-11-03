import { Router } from "express";
import authRouter from "./authRoutes.js";
import alimentoRouter from "./alimentoRoutes.js";
import compraRouter from "./compraRoutes.js";

const router = Router();

router.use("/auth", authRouter);
router.use("/products", alimentoRouter);
router.use("/orders", compraRouter);

export default router;
