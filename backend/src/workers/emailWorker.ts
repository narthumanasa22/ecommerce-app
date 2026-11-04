import dotenv from "dotenv";
import { Worker } from "bullmq";

dotenv.config();

const emailWorker = new Worker(
  "emailQueue",
  async (job) => {
    console.log("Processing email job...");

    console.log("Email:", job.data.email);
    console.log("Message:", job.data.message);

    console.log("Email job completed successfully!");
  },
  {
    connection: {
      host: "127.0.0.1",
      port: 6379,
    },
  }
);

emailWorker.on("completed", (job) => {
  console.log(`Job ${job.id} completed`);
});

emailWorker.on("failed", (job, err) => {
  console.log(`Job ${job?.id} failed:`, err.message);
});

console.log("Email worker waiting for jobs...");