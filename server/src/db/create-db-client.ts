import { Pool } from "pg";
import { envConfig } from "../env";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema";

export const pool = new Pool({
	connectionString: envConfig.DATABASE_URL,
	max: 10,
	idleTimeoutMillis: 30000,
});

export function createDbClient() {
	const dbClient = drizzle(pool, { schema, casing: "snake_case" });

	return dbClient;
}

export type DbClient = ReturnType<typeof createDbClient>;
