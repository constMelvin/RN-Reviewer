import { Hono } from "hono";
import type { HonoEnv } from "@/@types/hono";
import { superAdminMiddleware } from "@/middlewares/super-admin-middleware";
import {
	getServerMetrics,
	getDatabaseMetrics,
	getTrafficMetrics,
	getSystemHealth,
} from "@/services/admin/monitoring.service";

export const adminMonitoringRoutes = new Hono<HonoEnv>()
	.use("*", superAdminMiddleware)

	// GET /admin/monitoring/server
	.get("/server", async (c) => {
		const metrics = await getServerMetrics();
		return c.json(metrics);
	})

	// GET /admin/monitoring/database
	.get("/database", async (c) => {
		const metrics = await getDatabaseMetrics();
		return c.json(metrics);
	})

	// GET /admin/monitoring/traffic?hours=24
	.get("/traffic", async (c) => {
		const hours = parseInt(c.req.query("hours") || "24");
		const data = await getTrafficMetrics(hours);
		return c.json(data);
	})

	// GET /admin/monitoring/health
	.get("/health", async (c) => {
		const health = await getSystemHealth();
		return c.json(health);
	});
