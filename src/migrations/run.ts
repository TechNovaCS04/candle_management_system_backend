import fs from "fs";
import path from "path";
import { connectDatabase, sequelize } from "../config/database";

async function run() {
  await connectDatabase();
  const sqlPath = path.join(__dirname, "001_initial_schema.sql");
  const sql = fs.readFileSync(sqlPath, "utf8");
  await sequelize.query(sql);
  console.log("Migration 001_initial_schema applied successfully.");
  await sequelize.close();
}

run().catch(async (err) => {
  console.error("Migration failed:", err);
  await sequelize.close();
  process.exit(1);
});
