import { Router } from "express";

import {
  getProducts,
  createProductController,
  updateProductController,
  deleteProductController,
} from "../controllers/productController";

const router = Router();

router.get("/", getProducts);
router.post("/", createProductController);
router.put("/:id", updateProductController);
router.delete("/:id", deleteProductController);

export default router;