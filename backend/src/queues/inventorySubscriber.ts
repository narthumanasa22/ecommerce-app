
import { connectRabbitMQ } from "../rabbitmq";

const EXCHANGE_NAME = "order_events";
const QUEUE_NAME = "inventory_updates";

async function startInventorySubscriber() {
  const { connection, channel } = await connectRabbitMQ();

  // 1. Declare the same fanout exchange
  await channel.assertExchange(EXCHANGE_NAME, "fanout", {
    durable: true,
  });

  // 2. Create a separate inventory queue
  await channel.assertQueue(QUEUE_NAME, {
    durable: true,
  });

  // 3. Bind inventory queue to exchange
  await channel.bindQueue(QUEUE_NAME, EXCHANGE_NAME, "");

  console.log("Inventory subscriber waiting for order events...");

  // 4. Receive messages
  await channel.consume(
    QUEUE_NAME,
    (msg) => {
      if (msg !== null) {
        try {
          const order = JSON.parse(msg.content.toString());

          console.log("Inventory update received!");
          console.log("Order ID:", order.orderId);
          console.log("Updating inventory for this order...");

          channel.ack(msg);
        } catch (error) {
          console.error("Inventory event processing failed:", error);
          channel.nack(msg, false, false);
        }
      }
    },
    { noAck: false }
  );

  connection.on("error", (error) => {
    console.error("RabbitMQ connection error:", error);
  });
}

startInventorySubscriber().catch(console.error);
