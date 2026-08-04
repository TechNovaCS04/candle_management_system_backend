import { Sequelize, Options } from "sequelize";
import { env } from "./env";

function usesSupabase(databaseUrl: string): boolean {
  return databaseUrl.includes("supabase");
}

function buildSequelizeOptions(): Options {
  const isSupabase = usesSupabase(env.DATABASE_URL);
  const requireSsl = env.NODE_ENV === "production" || isSupabase;

  return {
    dialect: "postgres",
    logging: env.NODE_ENV === "development" ? console.log : false,
    dialectOptions: requireSsl
      ? {
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
        }
      : {},
    // Conservative pool for Supabase PgBouncer (transaction / session pooler)
    pool: {
      max: isSupabase ? 5 : 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  };
}

export const sequelize = new Sequelize(env.DATABASE_URL, buildSequelizeOptions());

export async function generateSequentialId(
  prefix: string,
  seqName: string,
  padLength = 4
): Promise<string> {
  const [[{ nextval }]] = (await sequelize.query(
    `SELECT nextval('${seqName}') as nextval`
  )) as [{ nextval: string }[], unknown];
 
  return `${prefix}-${String(nextval).padStart(padLength, "0")}`;
}

export async function connectDatabase(): Promise<void> {
  await sequelize.authenticate();
  console.log("Database connection established.");
}
