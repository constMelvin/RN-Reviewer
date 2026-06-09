import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { createDbClient } from "../db/create-db-client";
import { oAuthProxy, openAPI, username } from "better-auth/plugins";
import { envConfig } from "../env";

export const auth = betterAuth({
    database: drizzleAdapter(createDbClient(), {
        provider: "pg",
    }),
    emailAndPassword: { enabled: true },
    plugins: [openAPI(), username(), oAuthProxy({
        productionURL: envConfig.BETTER_AUTH_URL,
        secret: envConfig.OAUTH_PROXY_SECRET,
    })],
    trustedOrigins: [
        "http://localhost:3000",
        ...envConfig.FRONTEND_URL.split(",").map(u => u.trim()),
    ],
    trustHost: true,
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
            redirectURI: `${envConfig.BETTER_AUTH_URL}/api/auth/callback/google`,
        },
    },
});
