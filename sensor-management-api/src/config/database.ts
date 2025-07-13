import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

export const createDatabasePool = (): Pool => {
  const connectionString =
    process.env["DATABASE_URL"] ||
    "postgres://user:pass@postgres:5432/sensordb";

  return new Pool({
    connectionString,
    ssl:
      process.env["NODE_ENV"] === "production"
        ? { rejectUnauthorized: false }
        : false,
  });
};
