import { Hono } from "hono";
import type { HonoEnv } from "@/@types/hono";
import { superAdminMiddleware } from "@/middlewares/super-admin-middleware";
import {
	getSecurityEvents,
	getActiveAlerts,
	resolveSecurityEvent,
	getAuditLogs,
	detectBruteForce,
	detectConcurrentSessions,
} from "@/services/admin/security.service";

export const adminSecurityRoutes = new Hono<HonoEnv>()
	.use("*", superAdminMiddleware)

	// GET /admin/security/events?page=1&limit=20&severity=&resolved=
	.get("/events", async (c) => {
		const page = parseInt(c.req.query("page") || "1");
		const limit = parseInt(c.req.query("limit") || "20");
		const severity = c.req.query("severity") || undefined;
		const resolvedStr = c.req.query("resolved");
		const resolved =
			resolvedStr === "true"
				? true
				: resolvedStr === "false"
					? false
					: undefined;

		const data = await getSecurityEvents(page, limit, severity, resolved);
		return c.json(data);
	})

	// GET /admin/security/alerts
	.get("/alerts", async (c) => {
		const data = await getActiveAlerts();
		return c.json(data);
	})

	// PATCH /admin/security/events/:id/resolve
	.patch("/events/:id/resolve", async (c) => {
		const id = c.req.param("id");
		const currentUser = c.get("user");

		const updated = await resolveSecurityEvent(id, currentUser.id);
		if (!updated) {
			return c.json({ error: "Event not found" }, 404);
		}
		return c.json(updated);
	})

	// GET /admin/security/audit-logs?page=1&limit=30&userId=&action=&startDate=&endDate=
	.get("/audit-logs", async (c) => {
		const page = parseInt(c.req.query("page") || "1");
		const limit = parseInt(c.req.query("limit") || "30");
		const filters = {
			userId: c.req.query("userId") || undefined,
			action: c.req.query("action") || undefined,
			startDate: c.req.query("startDate") || undefined,
			endDate: c.req.query("endDate") || undefined,
		};

		const data = await getAuditLogs(page, limit, filters);
		return c.json(data);
	})

	// POST /admin/security/scan — Run security scans
	.post("/scan", async (c) => {
		const bruteForce = await detectBruteForce();
		const concurrentSessions = await detectConcurrentSessions();

		return c.json({
			message: "Security scan completed",
			findings: {
				bruteForceAttempts: bruteForce.length,
				concurrentSessions: concurrentSessions.length,
			},
		});
	});
