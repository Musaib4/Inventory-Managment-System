import { Router } from "express";
import { getMasterData, getChart1, getChart2 } from "../controllers/data.controller.js";

const router = Router();

router.get("/masterdata", getMasterData);
router.get("/chart1data", getChart1);
router.get("/chart2data", getChart2);

export default router;
