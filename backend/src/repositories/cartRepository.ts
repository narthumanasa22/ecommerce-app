
import { prisma } from "../prisma";

// GET OR CREATE USER CART
export const getOrCreateCart = async (userId: number) => {
  return await prisma.cart.upsert({
    where: {
      userId: userId
    },
    update: {},
    create: {
      userId: userId
    }
  });
};

// ADD PRODUCT TO CART
export const addCartItem = async (
  userId: number,
  productId: number,
  quantity: number
) => {
  const cart = await getOrCreateCart(userId);

  return await prisma.cartItem.upsert({
    where: {
      cartId_productId: {
        cartId: cart.id,
        productId: productId
      }
    },
    update: {
      quantity: {
        increment: quantity
      }
    },
    create: {
      cartId: cart.id,
      productId: productId,
      quantity: quantity
    },
    include: {
      product: true
    }
  });
};

// GET USER CART ITEMS
export const findCartItems = async (userId: number) => {
  const cart = await prisma.cart.findUnique({
    where: {
      userId: userId
    },
    include: {
      items: {
        include: {
          product: true
        }
      }
    }
  });

  return cart;
};

// UPDATE CART ITEM QUANTITY
export const updateCartItem = async (
  userId: number,
  cartItemId: number,
  quantity: number
) => {
  const cart = await prisma.cart.findUnique({
    where: {
      userId: userId
    }
  });

  if (!cart) {
    throw new Error("Cart not found");
  }

  const item = await prisma.cartItem.findFirst({
    where: {
      id: cartItemId,
      cartId: cart.id
    }
  });

  if (!item) {
    throw new Error("Cart item not found");
  }

  return await prisma.cartItem.update({
    where: {
      id: item.id
    },
    data: {
      quantity: quantity
    },
    include: {
      product: true
    }
  });
};

// REMOVE CART ITEM
export const removeCartItem = async (
  userId: number,
  cartItemId: number
) => {
  const cart = await prisma.cart.findUnique({
    where: {
      userId: userId
    }
  });

  if (!cart) {
    throw new Error("Cart not found");
  }

  const item = await prisma.cartItem.findFirst({
    where: {
      id: cartItemId,
      cartId: cart.id
    }
  });

  if (!item) {
    throw new Error("Cart item not found");
  }

  return await prisma.cartItem.delete({
    where: {
      id: item.id
    }
  });
};
