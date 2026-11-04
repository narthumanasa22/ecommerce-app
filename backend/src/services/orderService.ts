
import {
  createOrderFromCart,
  findOrdersByUserId,
  findOrderById,
} from "../repositories/orderRepository";

import { findById } from "../repositories/userRepository";
import { addEmailJob } from "../queues/emailQueue";
import { sendOrderCreatedMessage } from "../queues/orderProducer";

// CREATE ORDER
export const createOrderService = async (userId: number) => {
  if (!Number.isInteger(userId) || userId <= 0) {
    throw new Error("Invalid user ID");
  }

  const user = await findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  const order = await createOrderFromCart(userId);

  console.log("Order created:", order.id);

  // BullMQ email job
  try {
    const job = await addEmailJob(
      user.email,
      `Order ${order.id} created successfully`
    );

    console.log("Email job queued:", job.id);
  } catch (error) {
    console.error("BullMQ email job failed:", error);
  }

  // RabbitMQ order event
  try {
    await sendOrderCreatedMessage({
      orderId: order.id,
      email: user.email,
      totalAmount: Number(order.totalAmount),
    });

    console.log("OrderCreated event published:", order.id);
  } catch (error) {
    console.error("RabbitMQ event publishing failed:", error);
  }

  return order;
};

// GET ALL ORDERS
export const getOrdersService = async (userId: number) => {
  if (!Number.isInteger(userId) || userId <= 0) {
    throw new Error("Invalid user ID");
  }

  return await findOrdersByUserId(userId);
};

// GET SINGLE ORDER
export const getOrderByIdService = async (
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
