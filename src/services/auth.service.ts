import { Op } from "sequelize";
import { env } from "../config/env";
import { User } from "../models";
import { mapAdmin } from "../mappers";
import { AppError, assertFound } from "../utils/AppError";
import { comparePassword, hashPassword, signToken } from "../utils/auth";

export class AuthService {
  async register(input: { name: string; email: string; password: string }) {
    const count = await User.count();
    if (count > 0 && !env.ALLOW_PUBLIC_REGISTER) {
      throw new AppError("Registration is disabled. Contact an administrator.", 403);
    }

    const existing = await User.findOne({ where: { email: input.email.toLowerCase() } });
    if (existing) {
      throw new AppError("Email already registered", 409);
    }

    const user = await User.create({
      name: input.name,
      email: input.email.toLowerCase(),
      password_hash: await hashPassword(input.password),
    });

    const token = signToken({ sub: user.id, email: user.email });
    return { token, admin: mapAdmin(user) };
  }

  async login(input: { email: string; password: string }) {
    const user = await User.findOne({ where: { email: input.email.toLowerCase() } });
    if (!user || !(await comparePassword(input.password, user.password_hash))) {
      throw new AppError("Invalid email or password", 401);
    }
    const token = signToken({ sub: user.id, email: user.email });
    return { token, admin: mapAdmin(user) };
  }

  async me(userId: string) {
    const user = assertFound(await User.findByPk(userId), "User not found");
    return mapAdmin(user);
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = assertFound(await User.findByPk(userId), "User not found");
    if (!(await comparePassword(currentPassword, user.password_hash))) {
      throw new AppError("Current password is incorrect", 400);
    }
    user.password_hash = await hashPassword(newPassword);
    await user.save();
    return { message: "Password updated successfully" };
  }

  async findByEmail(email: string) {
    return User.findOne({ where: { email: { [Op.iLike]: email } } });
  }
}

export const authService = new AuthService();
