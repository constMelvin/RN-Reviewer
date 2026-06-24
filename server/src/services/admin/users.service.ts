import { createDbClient } from "@/db/create-db-client";
import { user, session, scores, books, task, audit_logs } from "@/db/schema";
import { count, eq, desc, sql, gte, like, or, and } from "drizzle-orm";

const db = createDbClient();

const scorePercentExpr = sql<number>`CASE WHEN ${scores.score_total} > 0 THEN (${scores.score}::float / ${scores.score_total}::float * 100) ELSE 0 END`;

export async function getUsers(
	page: number = 1,
	limit: number = 20,
	search?: string,
	role?: string
) {
	const offset = (page - 1) * limit;
	const conditions: any[] = [];

	if (search) {
		conditions.push(
			or(
				like(user.name, `%${search}%`),
				like(user.email, `%${search}%`),
				like(user.username, `%${search}%`)
			)
		);
	}
	if (role) {
		conditions.push(eq(user.role, role));
	}

	const where = conditions.length > 0 ? and(...conditions) : undefined;

	const users = await db
		.select({
			id: user.id,
			name: user.name,
			email: user.email,
			username: user.username,
			displayUsername: user.displayUsername,
			image: user.image,
			role: user.role,
			emailVerified: user.emailVerified,
			themeColor: user.themeColor,
			createdAt: user.createdAt,
			updatedAt: user.updatedAt,
		})
		.from(user)
		.where(where)
		.orderBy(desc(user.createdAt))
		.limit(limit)
		.offset(offset);

	const [totalResult] = await db
		.select({ count: count() })
		.from(user)
		.where(where);

	return {
		users,
		total: totalResult?.count ?? 0,
		page,
		limit,
		totalPages: Math.ceil((totalResult?.count ?? 0) / limit),
	};
}

export async function getUserDetail(userId: string) {
	const [userData] = await db
		.select()
		.from(user)
		.where(eq(user.id, userId))
		.limit(1);

	if (!userData) return null;

	// Get active sessions
	const sessions = await db
		.select({
			id: session.id,
			createdAt: session.createdAt,
			expiresAt: session.expiresAt,
			ipAddress: session.ipAddress,
			userAgent: session.userAgent,
		})
		.from(session)
		.where(eq(session.userId, userId))
		.orderBy(desc(session.createdAt))
		.limit(10);

	// Get score count
	const [scoreCount] = await db
		.select({ count: count() })
		.from(scores)
		.where(eq(scores.user_id, userId));

	// Get book count
	const [bookCount] = await db
		.select({ count: count() })
		.from(books)
		.where(eq(books.user_id, userId));

	// Get task count
	const [taskCount] = await db
		.select({ count: count() })
		.from(task)
		.where(eq(task.user_id, userId));

	// Get recent activity
	const recentActivity = await db
		.select()
		.from(audit_logs)
		.where(eq(audit_logs.user_id, userId))
		.orderBy(desc(audit_logs.created_at))
		.limit(20);

	// Get recent scores
	const recentScores = await db
		.select({
			scoreId: scores.score_id,
			examType: scores.exam_type,
			subject: scores.subject,
			score: scores.score,
			scoreTotal: scores.score_total,
			percent: scorePercentExpr,
		})
		.from(scores)
		.where(eq(scores.user_id, userId))
		.orderBy(desc(scores.score_id))
		.limit(20);

	const [avgScoreResult] = await db
		.select({
			avgPercent: sql<number>`COALESCE(AVG(${scorePercentExpr}), 0)`,
		})
		.from(scores)
		.where(eq(scores.user_id, userId));

	return {
		...userData,
		sessions,
		stats: {
			scores: scoreCount?.count ?? 0,
			books: bookCount?.count ?? 0,
			tasks: taskCount?.count ?? 0,
			avgScorePercent: Math.round(avgScoreResult?.avgPercent ?? 0),
		},
		recentScores: recentScores.map((r) => ({
			...r,
			percent: Math.round(r.percent),
		})),
		recentActivity,
	};
}

export async function getOnlineUsers() {
	const now = new Date();

	const onlineSessions = await db
		.select({
			sessionId: session.id,
			userId: session.userId,
			createdAt: session.createdAt,
			expiresAt: session.expiresAt,
			ipAddress: session.ipAddress,
			userAgent: session.userAgent,
			userName: user.name,
			userEmail: user.email,
			userRole: user.role,
			userImage: user.image,
		})
		.from(session)
		.innerJoin(user, eq(session.userId, user.id))
		.where(gte(session.expiresAt, now))
		.orderBy(desc(session.createdAt));

	return onlineSessions;
}

export async function updateUserRole(userId: string, newRole: string) {
	const validRoles = ["student", "admin", "super_admin"];
	if (!validRoles.includes(newRole)) {
		throw new Error(`Invalid role: ${newRole}`);
	}

	const [updated] = await db
		.update(user)
		.set({ role: newRole })
		.where(eq(user.id, userId))
		.returning();

	return updated;
}

export async function deleteUser(userId: string) {
	const [deleted] = await db
		.delete(user)
		.where(eq(user.id, userId))
		.returning();

	return deleted;
}
