
import {
  findOrdersByUserId,
  findOrderById,
} from "../repositories/orderRepository";

// QUERY: Get all orders
export const getOrdersQuery = async (userId: number) => {
  if (!Number.isInteger(userId) || userId <= 0) {
    throw new Error("Invalid user ID");
  }

  return await findOrdersByUserId(userId);
};

// QUERY: Get single order
export const getOrderByIdQuery = async (
  userId: number,
  orderId: number
) => {
  if (!Number.isInteger(orderId) || orderId <= 0) {
    throw new Error("Invalid order ID");
  }

  const order = await findOrderById(userId, orderId);

  if (!order) {
    throw new Error("Order not found");
  }

  return order;
};
