import { connectRabbitMQ } from "./rabbitmq";

interface OrderMessage {
  orderId: number;
  email: string;
  totalAmount: number;
}

export async function sendOrderCreatedMessage(order: OrderMessage) {
  const { connection, channel } = await connectRabbitMQ();

  try {
    const queueName = "order_created";

    await channel.assertQueue(queueName, {
      durable: true,
    });

    channel.sendToQueue(
      queueName,
      Buffer.from(JSON.stringify(order)),
      { persistent: true }
    );

    console.log("Order message sent:", order);
  } finally {
    await channel.close();
    await connection.close();
  }
}