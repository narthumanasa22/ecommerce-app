import dotenv from "dotenv";
import { Queue } from "bullmq";

dotenv.config();

export const emailQueue = new Queue("emailQueue", {
  connection: {
    host: "127.0.0.1",
    port: 6379,
  },
});

export async function addEmailJob(
  email: string,
  message: string
) {
  const job = await emailQueue.add(
    "sendEmail",
    {
      email,
      message,
    },
    {
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 2000,
      },
    }
  );

  console.log("Email job added:", job.id);

  return job;
}