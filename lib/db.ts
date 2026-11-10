import { Pool } from "pg";

const globalForPg = globalThis as unknown as { pgPool?: Pool };
export const pool = globalForPg.pgPool ?? new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : undefined,
  max: 5,
  idleTimeoutMillis: 10_000,
  connectionTimeoutMillis: 5_000
});
if (process.env.NODE_ENV !== "production") globalForPg.pgPoolcredit_wallets
