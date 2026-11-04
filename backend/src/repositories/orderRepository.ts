
import { prisma } from "../prisma";

// CREATE ORDER FROM USER'S CART
export const createOrderFromCart = async (userId: number) => {
  return await prisma.$transaction(async (tx) => {
    // 1. Find the user's cart and its products
    const cart = await tx.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    // 2. Check whether the cart exists and has items
    if (!cart || cart.items.length === 0) {
      throw new Error("Cart is empty");
    }

    // 3. Calculate total using database product prices
    const totalAmount = cart.items.reduce(
      (total, item) =>
        total + Number(item.product.price) * item.quantity,
      0
    );

    // 4. Create order and order items together
    const order = await tx.order.create({
      data: {
        userId,
        totalAmount: totalAmount.toFixed(2),
        items: {
          create: cart.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
          })),
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    // 5. Clear cart only after the order is created
    await tx.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    return order;
  });
};

// GET ALL ORDERS FOR A USER
export const findOrdersByUserId = async (userId: number) => {
  return await prisma.order.findMany({
    where: { userId },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

// GET ONE ORDER BELONGING TO A USER
export const findOrderById = async (
  userId: number,
  orderId: number
) => {
  return await prisma.order.findFirst({
    where: {
      id: orderId,
      userId,
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });
};
