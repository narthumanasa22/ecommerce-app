
import { createOrderService } from "./orderService";

// COMMAND: Create order
export const createOrderCommand = async (userId: number) => {
  return await createOrderService(userId);
};
