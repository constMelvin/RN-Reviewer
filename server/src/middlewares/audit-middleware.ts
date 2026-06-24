import type { Context, MiddlewareHandler, Next } from "hono";
import { createDbClient } from "@/db/create-db-client";
import { audit_logs } from "@/db/schema";
import { auth } from "@/lib/auth";

// Maps HTTP method + path pattern to a human-readable action
function resolveAction(method: string, path: string): string | null {
	const m = method.toUpperCase();

	// Skip GET requests (read-only) and health checks
	if (m === "GET") return null;
	if (path.includes("/health")) return null;
	if (path.includes("/api/auth/")) return null; // Auth handled separately

	// User routes
	if (path.includes("/user/register") && m === "POST") return "REGISTER";
	if (path.includes("/user/login") && m === "POST") return "LOGIN";
	if (path.includes("/user/logout") && m === "POST") return "LOGOUT";
	if (path.includes("/user/theme") && m === "PATCH") return "UPDATE_THEME";

	// Book routes
	if (path.includes("/books") && m === "POST") return "CREATE_BOOK";
	if (path.includes("/books") && m === "PATCH") return "UPDATE_BOOK";
	if (path.includes("/books") && m === "DELETE") return "DELETE_BOOK";

	// Topic routes
	if (path.includes("/topic") && m === "POST") return "CREATE_TOPIC";
	if (path.includes("/topic") && m === "PATCH") return "UPDATE_TOPIC";
	if (path.includes("/topic") && m === "DELETE") return "DELETE_TOPIC";

	// Sub-topic routes
	if (path.includes("/sub-topics") && m === "POST") return "CREATE_SUBTOPIC";
	if (path.includes("/sub-topics") && m === "PATCH") return "UPDATE_SUBTOPIC";
	if (path.includes("/sub-topics") && m === "DELETE") return "DELETE_SUBTOPIC";

	// Task routes
	if (path.includes("/tasks") && m === "POST") return "CREATE_TASK";
	if (path.includes("/tasks") && m === "PATCH") return "UPDATE_TASK";
	if (path.includes("/tasks") && m === "DELETE") return "DELETE_TASK";

	// Score routes
	if (path.includes("/score") && m === "POST") return "SUBMIT_SCORE";
	if (path.includes("/score") && m === "PUT") return "UPDATE_SCORE";
	if (path.includes("/score") && m === "DELETE") return "DELETE_SCORE";

	// Agenda routes
	if (path.includes("/agenda") && m === "POST") return "CREATE_AGENDA";
	if (path.includes("/agenda") && m === "PATCH") return "UPDATE_AGENDA";
	if (path.includes("/agenda") && m === "DELETE") return "DELETE_AGENDA";

	// Admin routes
	if (path.includes("/admin") && m !== "GET") return "ADMIN_ACTION";

	return `${m}_UNKNOWN`;
}

function resolveEntityType(path: string): string | null {
	if (path.includes("/user")) return "user";
	if (path.includes("/books")) return "book";
	if (path.includes("/topic")) return "topic";
	if (path.includes("/sub-topics")) return "subtopic";
	if (path.includes("/tasks")) return "task";
	if (path.includes("/score")) return "score";
	if (path.includes("/agenda")) return "agenda";
	if (path.includes("/admin")) return "admin";
	return null;
}

function getClientIp(c: Context): string {
	return (
		c.req.header("x-forwarded-for") ||
		c.req.header("x-real-ip") ||
		c.req.raw.headers.get("CF-Connecting-IP") ||
		"unknown"
	);
}

export const auditMiddleware: MiddlewareHandler = async (
	c: Context,
	next: Next
) => {
	const method = c.req.method;
	const path = c.req.path;

	// Only audit mutating requests
	const action = resolveAction(method, path);
	if (!action) {
		await next();
		return;
	}

	// Execute the request first
	await next();

	// Log the action asynchronously (don't block the response)
	try {
		let userId: string | null = null;
		try {
			const session = await auth.api.getSession({
				headers: c.req.raw.headers,
			});
			userId = session?.user?.id || null;
		} catch {
			// No session available — that's fine for register/login
		}

		const db = createDbClient();
		await db.insert(audit_logs).values({
			user_id: userId,
			action,
			entity_type: resolveEntityType(path),
			ip_address: getClientIp(c),
			user_agent: c.req.header("user-agent") || null,
			method: method.toUpperCase(),
			path,
			status_code: c.res.status,
		});
	} catch (err) {
		// Silently fail — audit logging should never break the main request
		console.error("[Audit] Failed to log action:", err);
	}
};
