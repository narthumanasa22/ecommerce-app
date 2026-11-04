
type SagaOrder = {
  orderId: number;
  amount: number;
  simulatePaymentFailure?: boolean;
};

export const executeOrderSaga = async (order: SagaOrder) => {
  let orderCreated = false;
  let paymentCompleted = false;

  try {
    // STEP 1: Create order
    console.log("Step 1: Creating order...");

    orderCreated = true;

    console.log("Order created:", order.orderId);

    // STEP 2: Process payment
    console.log("Step 2: Processing payment...");

    if (order.simulatePaymentFailure) {
      throw new Error("Payment failed");
    }

    paymentCompleted = true;

    console.log("Payment successful:", order.amount);

    // STEP 3: Update inventory
    console.log("Step 3: Updating inventory...");

    console.log("Inventory updated successfully!");

    // STEP 4: Confirm order
    console.log("Step 4: Order confirmed!");

    return {
      success: true,
      message: "Order Saga completed successfully",
      orderId: order.orderId,
    };
  } catch (error) {
    console.error(
      "Saga failed:",
      error instanceof Error ? error.message : error
    );

    // COMPENSATION 1: Refund payment
    if (paymentCompleted) {
      console.log("Compensation: Refunding payment...");
    }

    // COMPENSATION 2: Cancel order
    if (orderCreated) {
      console.log("Compensation: Cancelling order...");
    }

    return {
      success: false,
      message: "Order Saga failed and compensation started",
      orderId: order.orderId,
    };
  }
};
