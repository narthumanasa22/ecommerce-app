
import { Router } from "express";
import {
  createOrder,
  getOrders,
  getOrderById,
} from "../controllers/orderController";
import { authenticate } from "../middleware/authMiddleware";

const router = Router();

// Create order from cart
router.post("/", authenticate, createOrder);

// Get all orders of logged-in user
router.get("/", authenticate, getOrders);

// Get a specific order
router.get("/:orderId", authenticate, getOrderById);

export default router;
