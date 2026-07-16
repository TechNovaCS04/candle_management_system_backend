import { NextFunction, Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { authService } from "../services/auth.service";

export async function register(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const result = await authService.register(req.body);
    res.status(201).json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
}

export async function login(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const result = await authService.login(req.body);
    res.json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
}

export async function logout(_req: AuthRequest, res: Response) {
  res.json({ success: true, message: "Logged out successfully" });
}

export async function me(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const admin = await authService.me(req.user!.id);
    res.json({ success: true, admin });
  } catch (err) {
    next(err);
  }
}

export async function changePassword(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const result = await authService.changePassword(
      req.user!.id,
      req.body.currentPassword,
      req.body.newPassword
    );
    res.json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
}
