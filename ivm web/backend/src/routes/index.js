import { Router } from "express";
import dataRoutes from "./auth.routes.js";

const router = Router();

router.use("/data", dataRoutes);

export default router;
