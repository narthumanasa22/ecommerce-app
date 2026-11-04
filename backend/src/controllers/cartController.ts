
import { Response } from "express";
import * as cartService from "../services/cartService";
import { AuthRequest } from "../middleware/authMiddleware";

// ADD PRODUCT TO CART
export const addToCart = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Authentication required"
      });
    }

    const userId = req.user.id;
    const { productId, quantity } = req.body;

    if (
      !Number.isInteger(Number(productId)) ||
      Number(productId) <= 0
    ) {
      return res.status(400).json({
        message: "Valid product ID is required"
      });
    }

    const itemQuantity =
      quantity === undefined ? 1 : Number(quantity);

    if (
      !Number.isInteger(itemQuantity) ||
      itemQuantity <= 0
    ) {
      return res.status(400).json({
        message: "Quantity must be a positive integer"
      });
    }

    const cartItem = await cartService.addToCartService(
      userId,
      Number(productId),
      itemQuantity
    );

    return res.status(201).json({
      message: "Product added to cart",
      cartItem
    });
  } catch (error) {
    return res.status(400).json({
      message: error instanceof Error
        ? error.message
        : "Failed to add product to cart"
    });
  }
};

// GET USER CART
export const getCart = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Authentication required"
      });
    }

    const cart = await cartService.getCartService(
      req.user.id
    );

    return res.status(200).json({
      message: "Cart fetched successfully",
      cart
    });
  } catch (error) {
    return res.status(400).json({
      message: error instanceof Error
        ? error.message
        : "Failed to fetch cart"
    });
  }
};

// UPDATE CART ITEM QUANTITY
export const updateCartItem = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Authentication required"
      });
    }

    const cartItemId = Number(req.params.cartItemId);
    const { quantity } = req.body;

    if (
      !Number.isInteger(cartItemId) ||
      cartItemId <= 0 ||
      !Number.isInteger(quantity) ||
      quantity <= 0
    ) {
      return res.status(400).json({
        message: "Valid cart item ID and positive quantity are required"
      });
    }

    const item = await cartService.updateCartItemService(
      req.user.id,
      cartItemId,
      quantity
    );

    return res.status(200).json({
      message: "Cart quantity updated successfully",
      item
    });
  } catch (error) {
    return res.status(400).json({
      message: error instanceof Error
        ? error.message
        : "Failed to update cart"
    });
  }
};

// REMOVE CART ITEM
export const removeCartItem = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Authentication required"
      });
    }

    const cartItemId = Number(req.params.cartItemId);

    if (
      !Number.isInteger(cartItemId) ||
      cartItemId <= 0
    ) {
      return res.status(400).json({
        message: "Valid cart item ID is required"
      });
    }

    await cartService.removeCartItemService(
      req.user.id,
      cartItemId
    );

    return res.status(200).json({
      message: "Cart item removed successfully"
    });
  } catch (error) {
    return res.status(400).json({
      message: error instanceof Error
        ? error.message
        : "Failed to remove cart item"
    });
  }
};
