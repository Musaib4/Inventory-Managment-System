import { Router } from "express";
import { createOrderHandler } from "../controllers/order.controller.js";
import { getOrdersHandler } from "../controllers/order.controller.js";


const router = Router();

router.post("/new", createOrderHandler);
router.get("/new", getOrdersHandler); 

export default router;
