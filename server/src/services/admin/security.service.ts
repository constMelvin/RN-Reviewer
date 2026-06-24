import { createDbClient } from "@/db/create-db-client";
import { security_events, audit_logs, session, user } from "@/db/schema";
import { count, eq, gte, desc, and, sql, ne } from "drizzle-orm";

const db = createDbClient();

// ─── Get Security Events ───
export async function getSecurityEvents(
	page: number = 1,
	limit: number = 20,
	severity?: string,
	resolved?: boolean
) {
	const offset = (page - 1) * limit;
	const conditions: any[] = [];

	if (severity) {
		conditions.push(eq(security_events.severity, severity));
	}
	if (resolved !== undefined) {
		conditions.push(eq(security_events.resolved, resolved));
	}

	const where = conditions.length > 0 ? and(...conditions) : undefined;

	const events = await db
		.select({
			id: security_events.id,
			event_type: security_events.event_type,
			severity: security_events.severity,
			source_ip: security_events.source_ip,
			user_id: security_events.user_id,
			details: security_events.details,
			resolved: security_events.resolved,
			resolved_by: security_events.resolved_by,
			resolved_at: security_events.resolved_at,
			created_at: security_events.created_at,
			userName: user.name,
		})
		.from(security_events)
		.leftJoin(user, eq(security_events.user_id, user.id))
		.where(where)
		.orderBy(desc(security_events.created_at))
		.limit(limit)
		.offset(offset);

	const [totalResult] = await db
		.select({ count: count() })
		.from(security_events)
		.where(where);

	return {
		events,
		total: totalResult?.count ?? 0,
		page,
		limit,
		totalPages: Math.ceil((totalResult?.count ?? 0) / limit),
	};
}

// ─── Get Active Alerts (unresolved) ───
export async function getActiveAlerts() {
	const alerts = await db
		.select({
			id: security_events.id,
			event_type: security_events.event_type,
			severity: security_events.severity,
			source_ip: security_events.source_ip,
			details: security_events.details,
			created_at: security_events.created_at,
			userName: user.name,
		})
		.from(security_events)
		.leftJoin(user, eq(security_events.user_id, user.id))
		.where(eq(security_events.resolved, false))
		.orderBy(desc(security_events.created_at))
		.limit(50);

	const countBySeverity = await db
		.select({
			severity: security_events.severity,
			count: count(),
		})
		.from(security_events)
		.where(eq(security_events.resolved, false))
		.groupBy(security_events.severity);

	return {
		alerts,
		counts: countBySeverity.reduce(
			(acc, r) => {
				acc[r.severity] = r.count;
				return acc;
			},
			{} as Record<string, number>
		),
	};
}

// ─── Resolve a Security Event ───
export async function resolveSecurityEvent(
	eventId: string,
	resolvedByUserId: string
) {
	const [updated] = await db
		.update(security_events)
		.set({
			resolved: true,
			resolved_by: resolvedByUserId,
			resolved_at: new Date(),
		})
		.where(eq(security_events.id, eventId))
		.returning();

	return updated;
}

// ─── Detect Brute Force (>5 failed logins from same IP in 15 min) ───
export async function detectBruteForce() {
	const fifteenMinAgo = new Date(Date.now() - 15 * 60 * 1000);

	const suspiciousIps = await db
		.select({
			ip_address: audit_logs.ip_address,
			count: count(),
		})
		.from(audit_logs)
		.where(
			and(
				eq(audit_logs.action, "FAILED_LOGIN"),
				gte(audit_logs.created_at, fifteenMinAgo)
			)
		)
		.groupBy(audit_logs.ip_address)
		.having(sql`count(*) >= 5`);

	// Create security events for new detections
	for (const ip of suspiciousIps) {
		// Check if already flagged recently
		const [existing] = await db
			.select({ id: security_events.id })
			.from(security_events)
			.where(
				and(
					eq(security_events.event_type, "BRUTE_FORCE_ATTEMPT"),
					eq(
						security_events.source_ip,
						ip.ip_address || ""
					),
					gte(security_events.created_at, fifteenMinAgo),
					eq(security_events.resolved, false)
				)
			)
			.limit(1);

		if (!existing) {
			await db.insert(security_events).values({
				event_type: "BRUTE_FORCE_ATTEMPT",
				severity: "critical",
				source_ip: ip.ip_address,
				details: `${ip.count} failed login attempts from IP ${ip.ip_address} in the last 15 minutes`,
			});
		}
	}

	return suspiciousIps;
}

// ─── Detect Concurrent Sessions ───
export async function detectConcurrentSessions() {
	const now = new Date();

	const usersWithManySessions = await db
		.select({
			userId: session.userId,
			sessionCount: count(),
			userName: user.name,
		})
		.from(session)
		.leftJoin(user, eq(session.userId, user.id))
		.where(gte(session.expiresAt, now))
		.groupBy(session.userId, user.name)
		.having(sql`count(*) >= 3`);

	for (const u of usersWithManySessions) {
		const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
		const [existing] = await db
			.select({ id: security_events.id })
			.from(security_events)
			.where(
				and(
					eq(security_events.event_type, "CONCURRENT_SESSIONS"),
					eq(security_events.user_id, u.userId),
					gte(security_events.created_at, oneHourAgo),
					eq(security_events.resolved, false)
				)
			)
			.limit(1);

		if (!existing) {
			await db.insert(security_events).values({
				event_type: "CONCURRENT_SESSIONS",
				severity: "warning",
				user_id: u.userId,
				details: `User "${u.userName}" has ${u.sessionCount} active sessions`,
			});
		}
	}

	return usersWithManySessions;
}

// ─── Get Audit Logs ───
export async function getAuditLogs(
	page: number = 1,
	limit: number = 30,
	filters?: {
		userId?: string;
		action?: string;
		startDate?: string;
		endDate?: string;
	}
) {
	const offset = (page - 1) * limit;
	const conditions: any[] = [];

	if (filters?.userId) {
		conditions.push(eq(audit_logs.user_id, filters.userId));
	}
	if (filters?.action) {
		conditions.push(eq(audit_logs.action, filters.action));
	}
	if (filters?.startDate) {
		conditions.push(
			gte(audit_logs.created_at, new Date(filters.startDate))
		);
	}
	if (filters?.endDate) {
		const endDate = new Date(filters.endDate);
		endDate.setHours(23, 59, 59, 999);
		conditions.push(sql`${audit_logs.created_at} <= ${endDate}`);
	}

	const where = conditions.length > 0 ? and(...conditions) : undefined;

	const logs = await db
		.select({
			id: audit_logs.id,
			user_id: audit_logs.user_id,
			action: audit_logs.action,
			entity_type: audit_logs.entity_type,
			entity_id: audit_logs.entity_id,
			metadata: audit_logs.metadata,
			ip_address: audit_logs.ip_address,
			user_agent: audit_logs.user_agent,
			method: audit_logs.method,
			path: audit_logs.path,
			status_code: audit_logs.status_code,
			created_at: audit_logs.created_at,
			userName: user.name,
			userEmail: user.email,
		})
		.from(audit_logs)
		.leftJoin(user, eq(audit_logs.user_id, user.id))
		.where(where)
		.orderBy(desc(audit_logs.created_at))
		.limit(limit)
		.offset(offset);

	const [totalResult] = await db
		.select({ count: count() })
		.from(audit_logs)
		.where(where);

	return {
		logs,
		total: totalResult?.count ?? 0,
		page,
		limit,
		totalPages: Math.ceil((totalResult?.count ?? 0) / limit),
	};
}
