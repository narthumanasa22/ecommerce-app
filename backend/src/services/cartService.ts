
import { prisma } from "../prisma";

import {
  addCartItem,
  findCartItems,
  updateCartItem,
  removeCartItem
} from "../repositories/cartRepository";

// ADD PRODUCT TO CART
export const addToCartService = async (
  userId: number,
  productId: number,
  quantity: number
) => {
  if (!Number.isInteger(productId) || productId <= 0) {
    throw new Error("Invalid product ID");
  }

  if (!Number.isInteger(quantity) || quantity <= 0) {
    throw new Error("Quantity must be a positive integer");
  }

  const product = await prisma.product.findUnique({
    where: { id: productId }
  });

  if (!product) {
    throw new Error("Product not found");
  }

  return await addCartItem(userId, productId, quantity);
};

// GET USER CART
export const getCartService = async (userId: number) => {
  return await findCartItems(userId);
};

// UPDATE CART ITEM QUANTITY
export const updateCartItemService = async (
  userId: number,
  cartItemId: number,
  quantity: number
) => {
  if (!Number.isInteger(cartItemId) || cartItemId <= 0) {
    throw new Error("Invalid cart item ID");
  }

  if (!Number.isInteger(quantity) || quantity <= 0) {
    throw new Error("Quantity must be a positive integer");
  }

  return await updateCartItem(userId, cartItemId, quantity);
};

// REMOVE CART ITEM
export const removeCartItemService = async (
  userId: number,
  cartItemId: number
) => {
  if (!Number.isInteger(cartItemId) || cartItemId <= 0) {
    throw new Error("Invalid cart item ID");
  }

  return await removeCartItem(userId, cartItemId);
};
