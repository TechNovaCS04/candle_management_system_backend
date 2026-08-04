import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().default(4000),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  CORS_ORIGIN: z.string().default("http://localhost:5173"),
  DATABASE_URL: z
    .string()
    .min(1, "DATABASE_URL is required")
    .refine(
      (url) => /^postgres(ql)?:\/\//i.test(url),
      "DATABASE_URL must be a Postgres URI starting with postgresql:// or postgres:// (not https://). In Supabase: Project Settings → Database → Connection string → URI."
    ),
  JWT_SECRET: z.string().min(8, "JWT_SECRET must be at least 8 characters"),
  JWT_EXPIRES_IN: z.string().default("7d"),
  ALLOW_PUBLIC_REGISTER: z
    .string()
    .optional()
    .transform((v) => v !== "false"),
  SEED_ADMIN_EMAIL: z.string().email().default("admin@sangeetha.lk"),
  SEED_ADMIN_PASSWORD: z.string().min(6).default("admin123"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid environment variables:", parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;
