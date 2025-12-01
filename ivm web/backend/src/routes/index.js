import { Router } from "express";
import dataRoutes from "./auth.routes.js";
import orderRoutes from "./order.route.js";

const router = Router();


router.use("/order", orderRoutes);
router.use("/data", dataRoutes);

export default router;
