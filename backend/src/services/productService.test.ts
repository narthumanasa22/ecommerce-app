import {
  getProductsService,
  createProductService,
  updateProductService,
  deleteProductService,
} from "./productService";

import {
  findAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../repositories/productRepository";

// Mock Repository
jest.mock("../repositories/productRepository");

describe("Product Service Unit Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // TEST 1: Get All Products
  test("should get all products", async () => {
    const mockProducts = [
      { id: 1, name: "Laptop", price: 50000 },
      { id: 2, name: "Phone", price: 20000 },
    ];

    (findAllProducts as jest.Mock).mockResolvedValue(mockProducts);

    const result = await getProductsService();

    expect(result).toEqual(mockProducts);
    expect(findAllProducts).toHaveBeenCalledTimes(1);
  });

  // TEST 2: Create Product
  test("should create a product", async () => {
    const mockProduct = {
      id: 3,
      name: "Keyboard",
      price: 1500,
    };

    (createProduct as jest.Mock).mockResolvedValue(mockProduct);

    const result = await createProductService("Keyboard", 1500);

    expect(result).toEqual(mockProduct);
    expect(createProduct).toHaveBeenCalledWith("Keyboard", 1500);
  });

  // TEST 3: Update Product
  test("should update a product", async () => {
    const mockProduct = {
      id: 1,
      name: "Updated Laptop",
      price: 60000,
    };

    (updateProduct as jest.Mock).mockResolvedValue(mockProduct);

    const result = await updateProductService(
      1,
      "Updated Laptop",
      60000
    );

    expect(result).toEqual(mockProduct);
    expect(updateProduct).toHaveBeenCalledWith(
      1,
      "Updated Laptop",
      60000
    );
  });

  // TEST 4: Delete Product
  test("should delete a product", async () => {
    const mockResult = { id: 1, name: "Laptop" };

    (deleteProduct as jest.Mock).mockResolvedValue(mockResult);

    const result = await deleteProductService(1);

    expect(result).toEqual(mockResult);
    expect(deleteProduct).toHaveBeenCalledWith(1);
  });
});