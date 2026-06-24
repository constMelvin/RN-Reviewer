import { Hono } from "hono";
import type { HonoEnv } from "@/@types/hono";
import { superAdminMiddleware } from "@/middlewares/super-admin-middleware";
import {
	getDashboardStats,
	getActivityChartData,
	getRecentActivity,
	getUserGrowthData,
} from "@/services/admin/analytics.service";

export const adminDashboardRoutes = new Hono<HonoEnv>()
	.use("*", superAdminMiddleware)

	// GET /admin/dashboard/stats
	.get("/stats", async (c) => {
		const stats = await getDashboardStats();
		return c.json(stats);
	})

	// GET /admin/dashboard/activity?days=7
	.get("/activity", async (c) => {
		const days = parseInt(c.req.query("days") || "7");
		const data = await getActivityChartData(days);
		return c.json(data);
	})

	// GET /admin/dashboard/recent?limit=15
	.get("/recent", async (c) => {
		const limit = parseInt(c.req.query("limit") || "15");
		const data = await getRecentActivity(limit);
		return c.json(data);
	})

	// GET /admin/dashboard/growth?days=30
	.get("/growth", async (c) => {
		const days = parseInt(c.req.query("days") || "30");
		const data = await getUserGrowthData(days);
		return c.json(data);
	});
