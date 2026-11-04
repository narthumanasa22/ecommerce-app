
import { executeOrderSaga } from "./services/orderSagaService";

async function testSaga() {
  console.log("\n========== SUCCESS TEST ==========");

  const successResult = await executeOrderSaga({
    orderId: 301,
    amount: 5000,
  });

  console.log("Success Result:", successResult);

  console.log("\n========== FAILURE TEST ==========");

  const failureResult = await executeOrderSaga({
    orderId: 302,
    amount: 3000,
    simulatePaymentFailure: true,
  });

  console.log("Failure Result:", failureResult);
}

testSaga().catch(console.error);
