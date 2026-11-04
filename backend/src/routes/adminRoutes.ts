import { Router } from "express";
import { authenticate } from "../middleware/authMiddleware";
import { authorizeAdmin } from "../middleware/authorizeAdmin";

const router = Router();

router.get("/check", authenticate, authorizeAdmin, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome Admin!",
  });
});

export default router;
