import { connectDatabase, sequelize } from "../config/database";
import { env } from "../config/env";
import { User } from "../models";
import { hashPassword } from "../utils/auth";

async function seed() {
  await connectDatabase();

  const email = env.SEED_ADMIN_EMAIL;
  const password = env.SEED_ADMIN_PASSWORD;

  const existing = await User.findOne({ where: { email } });
  if (existing) {
    console.log("Admin user already exists:", existing.email);
  } else {
    const password_hash = await hashPassword(password);
    const admin = await User.create({
      name: "Sangeetha Admin",
      email,
      password_hash,
    });
    console.log(`Seeded admin: ${admin.email} (password from SEED_ADMIN_PASSWORD)`);
  }

  await sequelize.close();
}

seed().catch(async (err) => {
  console.error("Seed failed:", err);
  await sequelize.close();
  process.exit(1);
});
