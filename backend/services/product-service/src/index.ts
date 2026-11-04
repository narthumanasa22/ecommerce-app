
import express, { Request, Response } from "express";
import productRoutes from "../../../src/routes/productRoutes";

const app = express();
const PORT = 4001;

// Middleware
app.use(express.json());

// Health check
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Product Microservice is running!",
  });
});

// Product CRUD routes
app.use("/products", productRoutes);

// Start Product Microservice
app.listen(PORT, () => {
  console.log(`Product Service running on port ${PORT}`);
});
