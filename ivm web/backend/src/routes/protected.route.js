// routes/protected.route.js
import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

// Protected example
router.get("/login", authenticate, (req, res) => {
  // req.user is available here
  res.json({
    message: "This is protected data",
    user: req.user
  });
});

export default router;
