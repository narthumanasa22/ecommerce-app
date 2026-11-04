
import { connectRabbitMQ } from "../rabbitmq";

const EXCHANGE_NAME = "order_events";

export async function publishOrderEvent(order: {
  orderId: number;
  email: string;
  totalAmount: number;
}) {
  const { connection, channel } = await connectRabbitMQ();

  try {
    // 1. Create a fanout exchange
    await channel.assertExchange(EXCHANGE_NAME, "fanout", {
      durable: true,
    });

    // 2. Convert order data into a message
    const message = Buffer.from(JSON.stringify(order));

    // 3. Publish message to the exchange
    channel.publish(EXCHANGE_NAME, "", message, {
      persistent: true,
    });

    console.log("Order event published:", order.orderId);
  } finally {
    await channel.close();
    await connection.close();
  }
}
