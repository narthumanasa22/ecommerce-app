import express from "express";

const app = express();
const PORT = 4003;

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Order Service is running!",
  });
});

app.listen(PORT, () => {
  console.log(`Order Service running on port ${PORT}`);
});

