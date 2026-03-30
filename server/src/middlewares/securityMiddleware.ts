import type { Context, MiddlewareHandler, Next } from "hono";
import { rateLimiter } from "hono-rate-limiter";

export const securityMiddleware: MiddlewareHandler = async (
	c: Context,
	next: Next
) => {
	c.header("X-Frame-Options", "DENY");
	c.header("X-Content-Type-Options", "nosniff");
	c.header("Referrer-Policy", "no-referrer");
	c.header(
		"Strict-Transport-Security",
		"max-age=31536000; includeSubDomains"
	);
	await next();
};

const getClientKey = (c: any) =>
	c.req.header("x-forwarded-for") ||
	c.req.header("x-real-ip") ||
	c.req.raw.headers.get("CF-Connecting-IP") ||
	"unknown";

export const strictLimiter = rateLimiter({
	windowMs: 15 * 60 * 1000,
	limit: 10,
	standardHeaders: "draft-6",
	keyGenerator: getClientKey,
});

export const mediumLimiter = rateLimiter({
	windowMs: 15 * 60 * 1000,
	limit: 100,
	standardHeaders: "draft-6",
	keyGenerator: getClientKey,
});

export const relaxedLimiter = rateLimiter({
	windowMs: 15 * 60 * 1000,
	limit: 500,
	standardHeaders: "draft-6",
	keyGenerator: getClientKey,
});
