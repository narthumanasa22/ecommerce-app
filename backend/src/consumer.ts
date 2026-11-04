
import "dotenv/config";
import { connectRabbitMQ } from "./rabbitmq";

async function main() {
  try {
    // Connect to RabbitMQ
    const { connection, channel } = await connectRabbitMQ();

    const queueName = "order_notifications";

    // Create queue if it does not exist
    await channel.assertQueue(queueName, {
      durable: true,
    });

    // Receive messages
    await channel.consume(
      queueName,
      (message) => {
        if (message === null) return;

        try {
          const order = JSON.parse(message.content.toString());

          console.log("Received order message:", order);

          // Acknowledge after successful processing
          channel.ack(message);
        } catch (error) {
          console.error("Failed to process message:", error);

          // Reject message without requeue
          channel.nack(message, false, false);
        }
      },
      { noAck: false }
    );

    console.log("Consumer waiting for order messages...");

    connection.on("error", (error) => {
      console.error("RabbitMQ connection error:", error);
    });
  } catch (error) {
    console.error("Consumer failed:", error);
    process.exitCode = 1;
  }
}

main();
