import { createDbClient } from "@/db/create-db-client";
import {
	user,
	session,
	scores,
	books,
	book_topics,
	task,
	audit_logs,
} from "@/db/schema";
import { count, eq, gte, sql, desc, and } from "drizzle-orm";

const db = createDbClient();

export async function getDashboardStats() {
	const now = new Date();
	const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
	const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

	// Total users
	const [totalUsersResult] = await db
		.select({ count: count() })
		.from(user);

	// New users today
	const [newTodayResult] = await db
		.select({ count: count() })
		.from(user)
		.where(gte(user.createdAt, today));

	// Active sessions (not expired)
	const [activeSessionsResult] = await db
		.select({ count: count() })
		.from(session)
		.where(gte(session.expiresAt, now));

	// Total scores submitted
	const [totalScoresResult] = await db
		.select({ count: count() })
		.from(scores);

	// Average score (percentage)
	const [avgScoreResult] = await db
		.select({
			avgPercent: sql<number>`COALESCE(AVG(CASE WHEN score_total > 0 THEN (score::float / score_total::float * 100) ELSE 0 END), 0)`,
		})
		.from(scores);

	// Total books
	const [totalBooksResult] = await db
		.select({ count: count() })
		.from(books);

	// Total tasks
	const [totalTasksResult] = await db
		.select({ count: count() })
		.from(task);

	// User role breakdown
	const roleBreakdown = await db
		.select({
			role: user.role,
			count: count(),
		})
		.from(user)
		.groupBy(user.role);

	// Registrations last 30 days
	const [recentRegistrations] = await db
		.select({ count: count() })
		.from(user)
		.where(gte(user.createdAt, thirtyDaysAgo));

	return {
		totalUsers: totalUsersResult?.count ?? 0,
		newUsersToday: newTodayResult?.count ?? 0,
		activeSessions: activeSessionsResult?.count ?? 0,
		totalScores: totalScoresResult?.count ?? 0,
		avgReadinessScore: Math.round(avgScoreResult?.avgPercent ?? 0),
		totalBooks: totalBooksResult?.count ?? 0,
		totalTasks: totalTasksResult?.count ?? 0,
		roleBreakdown: roleBreakdown.reduce(
			(acc, r) => {
				acc[r.role || "unknown"] = r.count;
				return acc;
			},
			{} as Record<string, number>
		),
		recentRegistrations: recentRegistrations?.count ?? 0,
	};
}

export async function getActivityChartData(days: number = 7) {
	const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

	// Registrations per day
	const registrations = await db
		.select({
			date: sql<string>`DATE(created_at)`,
			count: count(),
		})
		.from(user)
		.where(gte(user.createdAt, startDate))
		.groupBy(sql`DATE(created_at)`)
		.orderBy(sql`DATE(created_at)`);

	// Logins per day (from audit logs)
	const logins = await db
		.select({
			date: sql<string>`DATE(created_at)`,
			count: count(),
		})
		.from(audit_logs)
		.where(
			and(
				gte(audit_logs.created_at, startDate),
				eq(audit_logs.action, "LOGIN")
			)
		)
		.groupBy(sql`DATE(created_at)`)
		.orderBy(sql`DATE(created_at)`);

	// Score submissions per day
	const scoreSubmissions = await db
		.select({
			date: sql<string>`DATE(created_at)`,
			count: count(),
		})
		.from(audit_logs)
		.where(
			and(
				gte(audit_logs.created_at, startDate),
				eq(audit_logs.action, "SUBMIT_SCORE")
			)
		)
		.groupBy(sql`DATE(created_at)`)
		.orderBy(sql`DATE(created_at)`);

	// Build a combined dataset for all days
	const result: Array<{
		date: string;
		registrations: number;
		logins: number;
		scoreSubmissions: number;
	}> = [];

	for (let i = 0; i < days; i++) {
		const d = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
		const dateStr = d.toISOString().split("T")[0];

		result.push({
			date: dateStr,
			registrations:
				registrations.find((r) => r.date === dateStr)?.count ?? 0,
			logins: logins.find((r) => r.date === dateStr)?.count ?? 0,
			scoreSubmissions:
				scoreSubmissions.find((r) => r.date === dateStr)?.count ?? 0,
		});
	}

	return result;
}

export async function getRecentActivity(limit: number = 15) {
	const logs = await db
		.select({
			id: audit_logs.id,
			action: audit_logs.action,
			entity_type: audit_logs.entity_type,
			ip_address: audit_logs.ip_address,
			method: audit_logs.method,
			path: audit_logs.path,
			status_code: audit_logs.status_code,
			created_at: audit_logs.created_at,
			user_id: audit_logs.user_id,
			userName: user.name,
			userEmail: user.email,
		})
		.from(audit_logs)
		.leftJoin(user, eq(audit_logs.user_id, user.id))
		.orderBy(desc(audit_logs.created_at))
		.limit(limit);

	return logs;
}

export async function getUserGrowthData(days: number = 30) {
	const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

	const growth = await db
		.select({
			date: sql<string>`DATE(created_at)`,
			count: count(),
		})
		.from(user)
		.where(gte(user.createdAt, startDate))
		.groupBy(sql`DATE(created_at)`)
		.orderBy(sql`DATE(created_at)`);

	return growth;
}
