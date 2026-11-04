import {
  findAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../repositories/productRepository";

// GET ALL PRODUCTS
export const getProductsService = async () => {
  return await findAllProducts();
};

// CREATE PRODUCT
export const createProductService = async (
  name: string,
  price: number
) => {
  return await createProduct(name, price);
};

// UPDATE PRODUCT
export const updateProductService = async (
  id: number,
  name: string,
  price: number
) => {
  return await updateProduct(id, name, price);
};

// DELETE PRODUCT
export const deleteProductService = async (id: number) => {
  return await deleteProduct(id);
};