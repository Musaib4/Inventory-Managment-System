import { Router } from "express";
import { createOrderHandler } from "../controllers/order.controller.js";
import { getOrdersHandler } from "../controllers/order.controller.js";
import { getDateController } from "../controllers/order.controller.js";



const router = Router();

router.post("/", createOrderHandler);
// router.get("/", getOrdersHandler); 
router.get("/", getDateController);

export default router;
