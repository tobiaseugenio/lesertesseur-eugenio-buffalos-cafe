import { Router } from "express";
import authRouter from "./authRoutes.js";
import alimentoRouter from "./alimentoRoutes.js";

const router = Router();

router.use("/auth", authRouter);
router.use("/products", alimentoRouter);

export default router;
