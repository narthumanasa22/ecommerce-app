
import { z } from "zod";

// REGISTER VALIDATION
export const registerSchema = z.object({
  name: z
    .string()
    .min(3, "Name must contain at least 3 characters"),

  email: z
    .string()
    .email("Enter a valid email address"),

  password: z
    .string()
    .min(8, "Password must contain at least 8 characters")
});

// LOGIN VALIDATION
export const loginSchema = z.object({
  email: z
    .string()
    .email("Enter a valid email address"),

  password: z
    .string()
    .min(8, "Password must contain at least 8 characters")
});

// TypeScript types
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
