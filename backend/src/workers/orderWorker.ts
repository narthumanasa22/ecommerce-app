import { Worker } from "bullmq";

export const orderWorker = new Worker(
  "orderQueue",
  async (job) => {
    console.log("Processing job:", job.name);
    console.log("Job data:", job.data);

    if (job.name === "send-order-confirmation") {
      console.log(
        `Order confirmation processed for Order ID: ${job.data.orderId}`
      );
    }
  },
  {
    connection: {
      host: "localhost",
      port: 6379,
    },
  }
);

orderWorker.on("completed", (job) => {
  console.log(`Job ${job.id} completed successfully`);
});

orderWorker.on("failed", (job, error) => {
  console.error(`Job ${job?.id} failed:`, error.message);
});