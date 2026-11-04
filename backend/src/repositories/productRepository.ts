import { prisma } from "../prisma";

// GET ALL PRODUCTS
export const findAllProducts = async () => {
  return await prisma.product.findMany({
    orderBy: {
      id: "asc"
    }
  });
};

// CREATE PRODUCT
export const createProduct = async (
  name: string,
  price: number
) => {
  return await prisma.product.create({
    data: {
      name: name,
      price: price
    }
  });
};

// UPDATE PRODUCT
export const updateProduct = async (
  id: number,
  name: string,
  price: number
) => {
  return await prisma.product.update({
    where: {
      id: id
    },
    data: {
      name: name,
      price: price
    }
  });
};

// DELETE PRODUCT
export const deleteProduct = async (id: number) => {
  return await prisma.product.delete({
    where: {
      id: id
    }
  });
};