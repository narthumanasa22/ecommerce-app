import { sendOrderCreatedMessage } from "./queues/orderProducer";

async function testProducer() {
  try {
    await sendOrderCreatedMessage({
      orderId: 101,
      email: "test@example.com",
      totalAmount: 50000,
    });

    console.log("RabbitMQ message sent successfully!");
  } catch (error) {
    console.error("RabbitMQ producer test failed:", error);
  }
}

testProducer();