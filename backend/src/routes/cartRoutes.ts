
import { Router } from "express";

import {
  addToCart,
  getCart,
  updateCartItem,
  removeCartItem
} from "../controllers/cartController";

import { authenticate } from "../middleware/authMiddleware";

const router = Router();

// Add product to cart
router.post("/", authenticate, addToCart);

// Get user's cart
router.get("/", authenticate, getCart);

// Update cart item quantity
router.patch("/:cartItemId", authenticate, updateCartItem);

// Remove item from cart
router.delete("/:cartItemId", authenticate, removeCartItem);

export default router;
