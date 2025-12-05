import { Router } from "express";
import dataRoutes from "./auth.routes.js";
import orderRoutes from "./order.route.js";
import signupRoutes  from "./signup.route.js";
import protectedRoutes from "./protected.route.js";

const router = Router();

router.use("/protected", protectedRoutes);
router.use("/",signupRoutes)
router.use("/order", orderRoutes);
router.use("/data", dataRoutes);

export default router;
