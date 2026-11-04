
import { connectRabbitMQ } from "../rabbitmq";

const EXCHANGE_NAME = "order_events";
const QUEUE_NAME = "email_notifications";

async function startEmailSubscriber() {
  const { connection, channel } = await connectRabbitMQ();

  // 1. Declare the fanout exchange
  await channel.assertExchange(EXCHANGE_NAME, "fanout", {
    durable: true,
  });

  // 2. Create a dedicated queue
  await channel.assertQueue(QUEUE_NAME, {
    durable: true,
  });

  // 3. Bind queue to exchange
  await channel.bindQueue(QUEUE_NAME, EXCHANGE_NAME, "");

  console.log("Email subscriber waiting for order events...");

  // 4. Receive messages
  await channel.consume(
    QUEUE_NAME,
    (msg) => {
      if (msg !== null) {
        try {
          const order = JSON.parse(msg.content.toString());

          console.log("Email notification received!");
          console.log("Order ID:", order.orderId);
          console.log("Email:", order.email);
          console.log("Total:", order.totalAmount);

          channel.ack(msg);
        } catch (error) {
          console.error("Email event processing failed:", error);
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

startEmailSubscriber().catch(console.error);
