import { config } from "dotenv";
import z from "zod";

config();

// Env Schema
const envSchema = z.object({
	PORT: z.coerce.number().default(4001),
	DATABASE_URL: z.string(),
	BETTER_AUTH_SECRET: z.string(),
	BETTER_AUTH_URL: z.string(),
	GOOGLE_CLIENT_ID: z.string(),
	GOOGLE_CLIENT_SECRET: z.string(),
	FRONTEND_URL: z.string(),
});

export const envConfig = envSchema.parse({
	PORT: process.env.PORT,
	DATABASE_URL: process.env.DATABASE_URL,
	BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
	BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
	GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
	GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
	FRONTEND_URL: process.env.FRONTEND_URL,
});

export type EnvConfig = z.infer<typeof envSchema>;
