import { NextFunction, Request, Response } from "express";
import { ValidationError } from "sequelize";
import { AppError } from "../utils/AppError";

export function errorMiddleware(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  if (err instanceof ValidationError) {
    return res.status(400).json({
      success: false,
      message: err.errors.map((e) => e.message).join("; "),
    });
  }

  console.error(err);
  return res.status(500).json({
    success: false,
    message: "Internal server error",
  });
}

export function notFoundMiddleware(_req: Request, res: Response) {
  res.status(404).json({ success: false, message: "Route not found" });
}
