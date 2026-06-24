import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { createDbClient } from "../db/create-db-client";
import { openAPI, username } from "better-auth/plugins";
import { envConfig } from "../env";


const frontendUrls = envConfig.FRONTEND_URL.split(",").map(u => u.trim());
const primaryFrontend = frontendUrls[0];
const isProduction = process.env.NODE_ENV === "production";

export const auth = betterAuth({
    database: drizzleAdapter(createDbClient(), {
        provider: "pg",
    }),
    emailAndPassword: { enabled: true },
    plugins: [openAPI(), username()],
    trustedOrigins: [
        "http://localhost:3000",
        ...envConfig.FRONTEND_URL.split(",").map(u => u.trim()),
    ],
    trustHost: true,
    baseURL: envConfig.BETTER_AUTH_URL,
    advanced: {
        useSecureCookies: isProduction,
        crossSubDomainCookies: {
            enabled: false,
        },
        defaultCookieAttributes: {
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax",
            httpOnly: true,
            path: "/",
        },
    },
    socialProviders: {
        google: {
            prompt: "select_account",
            clientId: envConfig.GOOGLE_CLIENT_ID,
            clientSecret: envConfig.GOOGLE_CLIENT_SECRET,
            redirectURI: `${primaryFrontend}/api/auth/callback/google`,
        },
    },
});
