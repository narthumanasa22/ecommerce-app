
import { Request, Response } from "express";

import {
  registerSchema,
  loginSchema
} from "../validators/authvalidator";

import {
  registerUser,
  loginUser
} from "../services/userService";

import { AuthRequest } from "../middleware/authMiddleware";

// REGISTER USER
export const register = async (req: Request, res: Response) => {
  try {
    const validation = registerSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: validation.error.issues
      });
    }

    const { name, email, password } = validation.data;

    const user = await registerUser(name, email, password);

    return res.status(201).json({
      message: "User registered successfully",
      user
    });

  } catch (error: any) {
    if (error.message === "Email already registered") {
      return res.status(409).json({
        message: error.message
      });
    }

    console.error(error);

    return res.status(500).json({
      message: "Internal server error"
    });
  }
};

// LOGIN USER
export const login = async (req: Request, res: Response) => {
  try {
    const validation = loginSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: validation.error.issues
      });
    }

    const { email, password } = validation.data;

    const result = await loginUser(email, password);

    return res.status(200).json({
      message: "Login successful",
      user: result.user,
      token: result.token
    });

  } catch (error: any) {
    if (error.message === "Invalid email or password") {
      return res.status(401).json({
        message: error.message
      });
    }

    console.error(error);

    return res.status(500).json({
      message: "Internal server error"
    });
  }
};

// GET LOGGED-IN USER (PROTECTED ROUTE)
export const getMe = (req: AuthRequest, res: Response) => {
  return res.status(200).json({
    message: "User details fetched successfully",
    user: req.user
  });
};
