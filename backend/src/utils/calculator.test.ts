import { add, subtract } from "./calculator";

describe("Calculator Unit Tests", () => {
  test("should add two numbers", () => {
    expect(add(10, 20)).toBe(30);
  });

  test("should subtract two numbers", () => {
    expect(subtract(20, 10)).toBe(10);
  });
});