import { addEmailJob } from "./queues/emailQueue";

async function testEmail() {
  try {
    const job = await addEmailJob(
      "test@example.com",
      "Your order has been placed successfully!"
    );

    console.log("Email job added successfully!");
    console.log("Job ID:", job.id);
  } catch (error) {
    console.error("Failed to add email job:", error);
  }
}

testEmail();