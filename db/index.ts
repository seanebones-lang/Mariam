import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

export type Db = ReturnType<typeof drizzle<typeof schema>>;

const globalForPool = globalThis as unknown as {
  __mbbPgPool?: Pool;
};

let _db: Db | null = null;

function getPool(): Pool | null {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) return null;
  if (!globalForPool.__mbbPgPool) {
    globalForPool.__mbbPgPool = new Pool({
      connectionString: url,
      max: process.env.NODE_ENV === "production" ? 5 : 10,
      idleTimeoutMillis: 20_000,
      connectionTimeoutMillis: 10_000,
    });
  }
  return globalForPool.__mbbPgPool;
}

export function getDb(): Db | null {
  const pool = getPool();
  if (!pool) return null;
  if (!_db) {
    _db = drizzle(pool, { schema });
  }
  return _db;
}

export { schema };
