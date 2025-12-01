import { Router } from "express";
import { createOrderHandler } from "../controllers/order.controller.js";

const router = Router();

router.post("/new", createOrderHandler);

export default router;
