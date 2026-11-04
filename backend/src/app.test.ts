import request from "supertest";
import app from "./app";

describe("API Integration Tests", () => {
  test("GET / should return health check response", async () => {
    const response = await request(app).get("/");

    expect(response.status).toBe(200);

    expect(response.body).toEqual({
      success: true,
      message: "E-Commerce Backend is running 🚀",
    });
  });

  test("GET /invalid should return 404", async () => {
    const response = await request(app).get("/invalid");

    expect(response.status).toBe(404);

    expect(response.body).toEqual({
      success: false,
      message: "Route not found",
    });
  });
});