
import "dotenv/config";

import { PrismaClient } from "./generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL!;

const adapter = new PrismaPg({ connectionString });

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding products...");

  const products = [
    { name: "Laptop", price: 50000 },
    { name: "Phone", price: 25000 },
    { name: "Headphones", price: 3000 },
    { name: "Keyboard", price: 1500 },
    { name: "Mouse", price: 800 },
  ];

  for (const product of products) {
    const existing = await prisma.product.findFirst({
      where: { name: product.name },
    });

    if (!existing) {
      await prisma.product.create({
        data: product,
      });
    }
  }

  const allProducts = await prisma.product.findMany({
    orderBy: { id: "asc" },
  });

  console.log("Products ready ✅");
  console.log(allProducts);
}

main()
  .catch((error) => {
    console.error("Seed failed ❌", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
