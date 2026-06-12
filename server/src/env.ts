import z from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().default(8080),
  DATABASE_URL: z.string(),
  BETTER_AUTH_SECRET: z.string(),
  BETTER_AUTH_URL: z.string(),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  FRONTEND_URL: z.string(),
  OAUTH_PROXY_SECRET: z.string(),
});

export const envConfig = envSchema.parse(process.env);

export type EnvConfig = z.infer<typeof envSchema>;
