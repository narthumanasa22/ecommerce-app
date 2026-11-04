import { sendOrderCreatedMessage } from "./producer";

async function testRabbitMQ() {
  try {
    await sendOrderCreatedMessage({
      orderId: 101,
      email: "test@example.com",
      totalAmount: 50000,
    });

    console.log("RabbitMQ message sent successfully!");
  } catch (error) {
    console.error("RabbitMQ test failed:", error);
  }
}

testRabbitMQ();