
import { prisma } from "../prisma";

export const findByEmail = async (email: string) => {
  return await prisma.user.findUnique({
    where: {
      email,
    },
  });
};

export const findById = async (id: number) => {
  return await prisma.user.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });
};

export const createUser = async (data: {
  name: string;
  email: string;
  password: string;
}) => {
  return await prisma.user.create({
    data,
  });
};
