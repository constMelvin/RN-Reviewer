import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { createDbClient } from "../db/create-db-client"; // your drizzle instance
import { openAPI, username } from "better-auth/plugins";
import { envConfig } from "../env";



export const auth = betterAuth({
	database: drizzleAdapter(createDbClient(), {
		provider: "pg", // or "mysql", "sqlite"
	}),
	emailAndPassword: { enabled: true },
	plugins: [openAPI(), username()],
	trustedOrigins: ["http://localhost:3000"],
	socialProviders: {
		google: {
			clientId: envConfig.GOOGLE_CLIENT_ID,
			clientSecret: envConfig.GOOGLE_CLIENT_SECRET,
		},
	},
});
