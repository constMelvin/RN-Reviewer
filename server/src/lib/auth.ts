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
	trustedOrigins: ["http://localhost:3000", envConfig.FRONTEND_URL],
	baseURL: envConfig.BETTER_AUTH_URL,
	advanced: {
		useSecureCookies: true,
		crossSubDomainCookies: {
			enabled: false,
		},
		defaultCookieAttributes: {
			secure: true,
			sameSite: "none",
			httpOnly: true,
			path: "/",
		},
	},
	socialProviders: {
		google: {
			prompt: "select_account",
			clientId: envConfig.GOOGLE_CLIENT_ID,
			clientSecret: envConfig.GOOGLE_CLIENT_SECRET,
			redirectURI: `${envConfig.FRONTEND_URL}/api/auth/callback/google`,
		},
	},
});
