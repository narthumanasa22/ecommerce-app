import { Request, Response } from "express";

import {
  getProductsService,
  createProductService,
  updateProductService,
  deleteProductService,
} from "../services/productService";

// GET ALL PRODUCTS
export const getProducts = async (
  req: Request,
  res: Response
) => {
  try {
    const products = await getProductsService();

    res.status(200).json({
      message: "Products fetched successfully",
      products,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch products",
    });
  }
};

// CREATE PRODUCT
export const createProductController = async (
  req: Request,
  res: Response
) => {
  try {
    const { name, price } = req.body;

    const product = await createProductService(
      name,
      Number(price)
    );

    res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create product",
    });
  }
};

// UPDATE PRODUCT
export const updateProductController = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);
    const { name, price } = req.body;

    const product = await updateProductService(
      id,
      name,
      Number(price)
    );

    res.status(200).json({
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update product",
    });
  }
};

// DELETE PRODUCT
export const deleteProductController = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    await deleteProductService(id);

    res.status(200).json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete product",
    });
  }
};