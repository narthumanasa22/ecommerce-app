import express from "express";

const app = express();
const PORT = 4002;

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Auth Service is running!",
  });
});

app.listen(PORT, () => {
  console.log(`Auth Service running on port ${PORT}`);
});