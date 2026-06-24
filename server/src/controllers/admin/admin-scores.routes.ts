import { Hono } from "hono";
import type { HonoEnv } from "@/@types/hono";
import { superAdminMiddleware } from "@/middlewares/super-admin-middleware";
import {
	getScoreOverview,
	getScoresList,
	getScoresByExamType,
	getScoresBySubject,
	getAtRiskStudents,
	getScoreLeaderboard,
	getRecentScoreSubmissions,
	getUserScores,
	getExamTypes,
} from "@/services/admin/scores-analytics.service";

export const adminScoresRoutes = new Hono<HonoEnv>()
	.use("*", superAdminMiddleware)

	.get("/overview", async (c) => {
		const data = await getScoreOverview();
		return c.json(data);
	})

	.get("/list", async (c) => {
		const data = await getScoresList({
			page: parseInt(c.req.query("page") || "1"),
			limit: parseInt(c.req.query("limit") || "20"),
			search: c.req.query("search") || undefined,
			examType: c.req.query("examType") || undefined,
			subject: c.req.query("subject") || undefined,
			minPercent: c.req.query("minPercent")
				? parseInt(c.req.query("minPercent")!)
				: undefined,
			maxPercent: c.req.query("maxPercent")
				? parseInt(c.req.query("maxPercent")!)
				: undefined,
		});
		return c.json(data);
	})

	.get("/by-exam-type", async (c) => {
		const data = await getScoresByExamType();
		return c.json(data);
	})

	.get("/by-subject", async (c) => {
		const limit = parseInt(c.req.query("limit") || "15");
		const data = await getScoresBySubject(limit);
		return c.json(data);
	})

	.get("/at-risk", async (c) => {
		const limit = parseInt(c.req.query("limit") || "10");
		const data = await getAtRiskStudents(limit);
		return c.json(data);
	})

	.get("/leaderboard", async (c) => {
		const limit = parseInt(c.req.query("limit") || "10");
		const data = await getScoreLeaderboard(limit);
		return c.json(data);
	})

	.get("/recent", async (c) => {
		const limit = parseInt(c.req.query("limit") || "20");
		const data = await getRecentScoreSubmissions(limit);
		return c.json(data);
	})

	.get("/exam-types", async (c) => {
		const data = await getExamTypes();
		return c.json(data);
	})

	.get("/user/:userId", async (c) => {
		const limit = parseInt(c.req.query("limit") || "50");
		const data = await getUserScores(c.req.param("userId"), limit);
		return c.json(data);
	});
