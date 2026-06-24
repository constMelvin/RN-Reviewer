import { createDbClient } from "@/db/create-db-client";
import { user, scores, audit_logs } from "@/db/schema";
import { count, eq, desc, sql, and, like, or } from "drizzle-orm";

const db = createDbClient();

const percentExpr = sql<number>`CASE WHEN ${scores.score_total} > 0 THEN (${scores.score}::float / ${scores.score_total}::float * 100) ELSE 0 END`;

export async function getScoreOverview() {
	const [totals] = await db
		.select({
			totalScores: count(),
			avgPercent: sql<number>`COALESCE(AVG(${percentExpr}), 0)`,
			passingCount: sql<number>`COUNT(*) FILTER (WHERE ${percentExpr} >= 75)`,
			failingCount: sql<number>`COUNT(*) FILTER (WHERE ${percentExpr} < 75 AND ${scores.score_total} > 0)`,
			studentsWithScores: sql<number>`COUNT(DISTINCT ${scores.user_id})`,
		})
		.from(scores);

	const [studentCount] = await db
		.select({ count: count() })
		.from(user)
		.where(eq(user.role, "student"));

	const totalScores = totals?.totalScores ?? 0;
	const passingCount = Number(totals?.passingCount ?? 0);

	return {
		totalScores,
		avgPercent: Math.round(totals?.avgPercent ?? 0),
		passRate: totalScores > 0 ? Math.round((passingCount / totalScores) * 100) : 0,
		passingCount,
		failingCount: Number(totals?.failingCount ?? 0),
		studentsWithScores: Number(totals?.studentsWithScores ?? 0),
		totalStudents: studentCount?.count ?? 0,
	};
}

export async function getScoresList(options: {
	page?: number;
	limit?: number;
	search?: string;
	examType?: string;
	subject?: string;
	minPercent?: number;
	maxPercent?: number;
}) {
	const page = options.page ?? 1;
	const limit = options.limit ?? 20;
	const offset = (page - 1) * limit;
	const conditions: ReturnType<typeof eq>[] = [];

	if (options.examType) {
		conditions.push(eq(scores.exam_type, options.examType));
	}
	if (options.subject) {
		conditions.push(like(scores.subject, `%${options.subject}%`));
	}
	if (options.minPercent !== undefined) {
		conditions.push(sql`${percentExpr} >= ${options.minPercent}`);
	}
	if (options.maxPercent !== undefined) {
		conditions.push(sql`${percentExpr} <= ${options.maxPercent}`);
	}
	if (options.search) {
		conditions.push(
			or(
				like(user.name, `%${options.search}%`),
				like(user.email, `%${options.search}%`),
				like(user.username, `%${options.search}%`),
				like(scores.subject, `%${options.search}%`),
				like(scores.exam_type, `%${options.search}%`)
			)!
		);
	}

	const where = conditions.length > 0 ? and(...conditions) : undefined;

	const rows = await db
		.select({
			scoreId: scores.score_id,
			examType: scores.exam_type,
			subject: scores.subject,
			score: scores.score,
			scoreTotal: scores.score_total,
			percent: percentExpr,
			userId: scores.user_id,
			userName: user.name,
			userEmail: user.email,
			userUsername: user.username,
			userRole: user.role,
		})
		.from(scores)
		.innerJoin(user, eq(scores.user_id, user.id))
		.where(where)
		.orderBy(desc(scores.score_id))
		.limit(limit)
		.offset(offset);

	const [totalResult] = await db
		.select({ count: count() })
		.from(scores)
		.innerJoin(user, eq(scores.user_id, user.id))
		.where(where);

	const total = totalResult?.count ?? 0;

	return {
		scores: rows.map((r) => ({
			...r,
			percent: Math.round(r.percent),
		})),
		total,
		page,
		limit,
		totalPages: Math.ceil(total / limit),
	};
}

export async function getScoresByExamType() {
	const rows = await db
		.select({
			examType: scores.exam_type,
			count: count(),
			avgPercent: sql<number>`COALESCE(AVG(${percentExpr}), 0)`,
			passRate: sql<number>`COALESCE(
				(COUNT(*) FILTER (WHERE ${percentExpr} >= 75)::float / NULLIF(COUNT(*), 0)::float * 100),
				0
			)`,
		})
		.from(scores)
		.groupBy(scores.exam_type)
		.orderBy(desc(count()));

	return rows.map((r) => ({
		examType: r.examType,
		count: r.count,
		avgPercent: Math.round(r.avgPercent),
		passRate: Math.round(r.passRate),
	}));
}

export async function getScoresBySubject(limit: number = 15) {
	const rows = await db
		.select({
			subject: scores.subject,
			count: count(),
			avgPercent: sql<number>`COALESCE(AVG(${percentExpr}), 0)`,
		})
		.from(scores)
		.groupBy(scores.subject)
		.orderBy(desc(count()))
		.limit(limit);

	return rows.map((r) => ({
		subject: r.subject,
		count: r.count,
		avgPercent: Math.round(r.avgPercent),
	}));
}

export async function getAtRiskStudents(limit: number = 10) {
	const rows = await db
		.select({
			userId: scores.user_id,
			userName: user.name,
			userEmail: user.email,
			userUsername: user.username,
			scoreCount: count(),
			avgPercent: sql<number>`COALESCE(AVG(${percentExpr}), 0)`,
			lowestPercent: sql<number>`COALESCE(MIN(${percentExpr}), 0)`,
		})
		.from(scores)
		.innerJoin(user, eq(scores.user_id, user.id))
		.where(eq(user.role, "student"))
		.groupBy(scores.user_id, user.name, user.email, user.username)
		.having(sql`AVG(${percentExpr}) < 75`)
		.orderBy(sql`AVG(${percentExpr}) ASC`)
		.limit(limit);

	return rows.map((r) => ({
		...r,
		avgPercent: Math.round(r.avgPercent),
		lowestPercent: Math.round(r.lowestPercent),
	}));
}

export async function getScoreLeaderboard(limit: number = 10) {
	const rows = await db
		.select({
			userId: scores.user_id,
			userName: user.name,
			userEmail: user.email,
			userUsername: user.username,
			scoreCount: count(),
			avgPercent: sql<number>`COALESCE(AVG(${percentExpr}), 0)`,
			highestPercent: sql<number>`COALESCE(MAX(${percentExpr}), 0)`,
		})
		.from(scores)
		.innerJoin(user, eq(scores.user_id, user.id))
		.where(eq(user.role, "student"))
		.groupBy(scores.user_id, user.name, user.email, user.username)
		.having(sql`COUNT(*) >= 1`)
		.orderBy(desc(sql`AVG(${percentExpr})`))
		.limit(limit);

	return rows.map((r) => ({
		...r,
		avgPercent: Math.round(r.avgPercent),
		highestPercent: Math.round(r.highestPercent),
	}));
}

export async function getRecentScoreSubmissions(limit: number = 20) {
	const logs = await db
		.select({
			id: audit_logs.id,
			userId: audit_logs.user_id,
			userName: user.name,
			userEmail: user.email,
			metadata: audit_logs.metadata,
			createdAt: audit_logs.created_at,
		})
		.from(audit_logs)
		.leftJoin(user, eq(audit_logs.user_id, user.id))
		.where(eq(audit_logs.action, "SUBMIT_SCORE"))
		.orderBy(desc(audit_logs.created_at))
		.limit(limit);

	return logs;
}

export async function getUserScores(userId: string, limit: number = 50) {
	const rows = await db
		.select({
			scoreId: scores.score_id,
			examType: scores.exam_type,
			subject: scores.subject,
			score: scores.score,
			scoreTotal: scores.score_total,
			percent: percentExpr,
		})
		.from(scores)
		.where(eq(scores.user_id, userId))
		.orderBy(desc(scores.score_id))
		.limit(limit);

	return rows.map((r) => ({
		...r,
		percent: Math.round(r.percent),
	}));
}

export async function getExamTypes() {
	const rows = await db
		.selectDistinct({ examType: scores.exam_type })
		.from(scores)
		.orderBy(scores.exam_type);

	return rows.map((r) => r.examType);
}
