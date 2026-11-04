
import { connectRabbitMQ } from "../rabbitmq";

async function startOrderConsumer() {
  const { connection, channel } = await connectRabbitMQ();

  const queueName = "order_created";

  await channel.assertQueue(queueName, {
    durable: true,
  });

  console.log("Order consumer waiting for messages...");

  await channel.consume(queueName, (msg) => {
    if (msg !== null) {
      try {
        const order = JSON.parse(msg.content.toString());

        console.log("New order received!");
        console.log("Order ID:", order.orderId);
        console.log("Email:", order.email);
        console.log("Total:", order.totalAmount);

        channel.ack(msg);
      } catch (error) {
        console.error("Failed to process order message:", error);
        channel.nack(msg, false, false);
      }
    }
  });

  connection.on("error", (error) => {
    console.error("RabbitMQ connection error:", error);
  });
}

startOrderConsumer().catch(console.error);
