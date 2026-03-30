import { type Context, Hono } from "hono";
import { existsSync, readdirSync, readFileSync } from "fs";
import type { HonoEnv } from "./@types/hono";
import { serveStatic } from "hono/bun";
import { auth } from "./lib/auth";
import { logger } from "hono/logger";
import { errorHandlerMiddleware } from "./middlewares/error-handler";
import {
	relaxedLimiter,
	securityMiddleware,
} from "./middlewares/securityMiddleware";
import userRoutes from "./controllers/users/user.route";
import { cors } from "hono/cors";
import { rootRoutes } from "./controllers/routes";
import path from "path";

const app = new Hono<HonoEnv>()

	/* ---------- GLOBAL MIDDLEWARE ---------- */
	.use("*", securityMiddleware)
	.use("*", relaxedLimiter)
	.use(
		"*",
		cors({
			origin: ["http://localhost:3000", "http://192.168.2.4:3000"],
			credentials: true,
		})
	)
	.use(logger())

	/* ---------- API ROUTES ---------- */
	.on(["POST", "GET"], "/api/auth/**", (c) => auth.handler(c.req.raw))
	.route("/api/user", userRoutes)
	.route("/api/v1", rootRoutes)
	.get("/api/health", relaxedLimiter, (c: Context) => {
		return c.json({ message: "Server is up and healthy." }, 200);
	});

/* ---------- STATIC ASSETS + SPA FALLBACK ---------- */

if (process.env.NODE_ENV === "production") {
	console.log("production mode");

	const distPath = path.resolve(process.cwd(), "client/dist");

	console.log("📁 Serving from:", distPath);

	// Add explicit favicon route
	app.get("/favicon.ico", async (c) => {
		const filePath = path.join(distPath, "favicon.ico");
		if (existsSync(filePath)) {
			const fileBuffer = readFileSync(filePath);
			return c.body(fileBuffer, 200, {
				"Content-Type": "image/x-icon",
			});
		}
		return c.notFound();
	});

	// Serve static files with proper MIME types
	app.get("*", async (c, next) => {
		const reqPath = c.req.path;

		// Skip API routes
		if (reqPath.startsWith("/api")) {
			return next();
		}

		// Check for static file extensions
		const ext = reqPath.split(".").pop()?.toLowerCase();

		// Define MIME types
		const mimeTypes: Record<string, string> = {
			png: "image/png",
			jpg: "image/jpeg",
			jpeg: "image/jpeg",
			gif: "image/gif",
			svg: "image/svg+xml",
			webp: "image/webp",
			ico: "image/x-icon",
			css: "text/css",
			js: "application/javascript",
			json: "application/json",
			woff: "font/woff",
			woff2: "font/woff2",
		};

		if (ext && mimeTypes[ext]) {
			const filePath = path.join(distPath, reqPath);

			if (existsSync(filePath)) {
				const fileBuffer = readFileSync(filePath);
				return c.body(fileBuffer, 200, {
					"Content-Type": mimeTypes[ext],
					"Cache-Control":
						ext === "html"
							? "no-cache"
							: "public, max-age=31536000",
				});
			}
		}

		// Fallback to index.html for SPA routes
		return serveStatic({ root: distPath, path: "index.html" })(c, next);
	});
}

/* ---------- ERROR HANDLER ---------- */
app.onError(errorHandlerMiddleware);

export type AppType = typeof app;
export default app;
