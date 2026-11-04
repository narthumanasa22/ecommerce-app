
import "dotenv/config";
import amqp from "amqplib";

const RABBITMQ_URL = process.env.RABBITMQ_URL;

export async function connectRabbitMQ() {
  try {
    if (!RABBITMQ_URL) {
      throw new Error("RABBITMQ_URL is missing in .env");
    }

    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();

    console.log("RabbitMQ connected successfully!");

    return { connection, channel };
  } catch (error) {
    console.error("RabbitMQ connection failed:", error);
    throw error;
  }
}
