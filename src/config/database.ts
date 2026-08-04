import { Sequelize, Options } from "sequelize";
import { env } from "./env";

function usesSupabase(databaseUrl: string): boolean {
  return databaseUrl.includes("supabase");
}

/**
 * Parse a postgres connection URI into Sequelize constructor args.
 * Avoids Sequelize treating non-postgres schemes (e.g. https://) as dialects.
 */
function parseDatabaseUrl(databaseUrl: string) {
  const url = new URL(databaseUrl);
  const database = url.pathname.replace(/^\//, "") || "postgres";
  const port = url.port ? Number(url.port) : 5432;

  return {
    database,
    username: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    host: url.hostname,
    port,
  };
}

function buildSequelizeOptions(host: string, port: number): Options {
  const isSupabase = usesSupabase(env.DATABASE_URL);
  const requireSsl = env.NODE_ENV === "production" || isSupabase;

  return {
    host,
    port,
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
    pool: {
      max: isSupabase ? 5 : 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  };
}

const { database, username, password, host, port } = parseDatabaseUrl(env.DATABASE_URL);

export const sequelize = new Sequelize(
  database,
  username,
  password,
  buildSequelizeOptions(host, port)
);

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
