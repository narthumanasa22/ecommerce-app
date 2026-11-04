import { publishOrderEvent } from "./queues/orderEventPublisher";

async function testPubSub() {
  try {
    await publishOrderEvent({
      orderId: 201,
      email: "test@example.com",
      totalAmount: 50000,
    });

    console.log("Pub/Sub test completed!");
  } catch (error) {
    console.error("Pub/Sub test failed:", error);
  }
}

testPubSub();