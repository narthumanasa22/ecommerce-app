
import "dotenv/config";
import { emailQueue, addEmailJob } from "./queues/emailQueue";

async function addOrderJob() {
  try {
    const job = await addEmailJob(
      "test@example.com",
      "Order 101 created successfully"
    );

    console.log("Job added successfully:", job.id);
  } catch (error) {
    console.error("Error adding job:", error);
  } finally {
    await emailQueue.close();
  }
}

addOrderJob();
