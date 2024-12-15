// packages/db/src/client.ts
import * as schema from "./schema";
import { drizzle } from "drizzle-orm/d1";
import type { D1Database } from "@cloudflare/workers-types";
import type { DrizzleD1Database } from "drizzle-orm/d1";

// Explicitly type the Drizzle DB with the imported schema
export type DrizzleDB = DrizzleD1Database<typeof schema>;

export function getDB(env: { DB: D1Database }): DrizzleDB {
  return drizzle(env.DB, { schema }) as DrizzleDB;
}