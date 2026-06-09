export const auth = betterAuth({
    database: drizzleAdapter(createDbClient(), {
        provider: "pg",
    }),
    emailAndPassword: { enabled: true },
    plugins: [openAPI(), username()],
    trustedOrigins: [
        "http://localhost:3000",
        ...envConfig.FRONTEND_URL.split(","),
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
