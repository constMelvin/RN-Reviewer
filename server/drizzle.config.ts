import "dotenv/config";
import { defineConfig } from "drizzle-kit";
import { envConfig } from "./src/env";

export default defineConfig({
	out: "./src/db/migrations",
	schema: "./src/db/schema.ts",
	dialect: "postgresql",
	dbCredentials: {
		url: envConfig.DATABASE_URL,
	},
});
