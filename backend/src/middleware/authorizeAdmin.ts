import { Response, NextFunction } from "express";
import { AuthRequest } from "./authMiddleware";

export const authorizeAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Check whether user is authenticated
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required"
      });
    }

    // Check whether user has ADMIN role
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Admin access required"
      });
    }

    // Allow admin to continue
    next();

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Authorization failed"
    });
  }
};