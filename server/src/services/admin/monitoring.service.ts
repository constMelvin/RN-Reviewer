import os from "os";
import { createDbClient } from "@/db/create-db-client";
import { pool } from "@/db/create-db-client";
import { system_metrics_snapshots } from "@/db/schema";
import { sql, desc, gte } from "drizzle-orm";

const db = createDbClient();

// ─── Request tracking (updated by metrics middleware) ───
let requestCount = 0;
let errorCount = 0;
let totalResponseTime = 0;
let responseTimeCount = 0;

export function trackRequest(responseTimeMs: number, isError: boolean) {
	requestCount++;
	totalResponseTime += responseTimeMs;
	responseTimeCount++;
	if (isError) errorCount++;
}

export function resetRequestCounters() {
	const data = {
		requestCount,
		errorCount,
		avgResponseTime:
			responseTimeCount > 0 ? totalResponseTime / responseTimeCount : 0,
	};
	requestCount = 0;
	errorCount = 0;
	totalResponseTime = 0;
	responseTimeCount = 0;
	return data;
}

// ─── CPU Usage Calculation ───
let previousCpuUsage: { idle: number; total: number } | null = null;

function getCpuUsage(): number {
	const cpus = os.cpus();
	let idle = 0;
	let total = 0;

	for (const cpu of cpus) {
		idle += cpu.times.idle;
		total +=
			cpu.times.user +
			cpu.times.nice +
			cpu.times.sys +
			cpu.times.irq +
			cpu.times.idle;
	}

	if (previousCpuUsage) {
		const idleDelta = idle - previousCpuUsage.idle;
		const totalDelta = total - previousCpuUsage.total;
		previousCpuUsage = { idle, total };

		if (totalDelta === 0) return 0;
		return Math.round((1 - idleDelta / totalDelta) * 100);
	}

	previousCpuUsage = { idle, total };
	return 0;
}

// ─── Live Server Metrics ───
export async function getServerMetrics() {
	const memUsage = process.memoryUsage();
	const totalMem = os.totalmem();
	const freeMem = os.freemem();
	const usedMem = totalMem - freeMem;

	return {
		cpu: {
			usage: getCpuUsage(),
			cores: os.cpus().length,
			model: os.cpus()[0]?.model || "Unknown",
		},
		memory: {
			used: Math.round(usedMem / 1024 / 1024), // MB
			total: Math.round(totalMem / 1024 / 1024), // MB
			percentage: Math.round((usedMem / totalMem) * 100),
		},
		heap: {
			used: Math.round(memUsage.heapUsed / 1024 / 1024), // MB
			total: Math.round(memUsage.heapTotal / 1024 / 1024), // MB
			percentage: Math.round(
				(memUsage.heapUsed / memUsage.heapTotal) * 100
			),
		},
		uptime: {
			process: Math.round(process.uptime()),
			system: Math.round(os.uptime()),
		},
		platform: {
			os: `${os.type()} ${os.release()}`,
			arch: os.arch(),
			hostname: os.hostname(),
			nodeVersion: process.version,
		},
	};
}

// ─── Database Metrics ───
export async function getDatabaseMetrics() {
	try {
		// Pool stats
		const poolStats = {
			totalCount: pool.totalCount,
			idleCount: pool.idleCount,
			waitingCount: pool.waitingCount,
		};

		// Database size
		const dbSizeResult = await pool.query(
			`SELECT pg_size_pretty(pg_database_size(current_database())) as size,
					pg_database_size(current_database()) as size_bytes`
		);

		// Active connections
		const activeConnResult = await pool.query(
			`SELECT count(*) as count FROM pg_stat_activity WHERE state = 'active'`
		);

		// Total connections
		const totalConnResult = await pool.query(
			`SELECT count(*) as count FROM pg_stat_activity`
		);

		// Table sizes and row counts
		const tableStatsResult = await pool.query(
			`SELECT 
				schemaname,
				relname as table_name,
				n_live_tup as row_count,
				pg_size_pretty(pg_total_relation_size(relid)) as total_size,
				pg_total_relation_size(relid) as size_bytes
			FROM pg_stat_user_tables 
			ORDER BY pg_total_relation_size(relid) DESC
			LIMIT 20`
		);

		// Database uptime
		const uptimeResult = await pool.query(
			`SELECT now() - pg_postmaster_start_time() as uptime`
		);

		return {
			pool: poolStats,
			database: {
				size: dbSizeResult.rows[0]?.size || "Unknown",
				sizeBytes: parseInt(dbSizeResult.rows[0]?.size_bytes || "0"),
			},
			connections: {
				active: parseInt(activeConnResult.rows[0]?.count || "0"),
				total: parseInt(totalConnResult.rows[0]?.count || "0"),
			},
			tables: tableStatsResult.rows.map((r: any) => ({
				name: r.table_name,
				rowCount: parseInt(r.row_count || "0"),
				size: r.total_size,
				sizeBytes: parseInt(r.size_bytes || "0"),
			})),
			uptime: uptimeResult.rows[0]?.uptime || "Unknown",
		};
	} catch (err) {
		console.error("[Monitoring] Failed to get DB metrics:", err);
		return {
			pool: { totalCount: 0, idleCount: 0, waitingCount: 0 },
			database: { size: "Error", sizeBytes: 0 },
			connections: { active: 0, total: 0 },
			tables: [],
			uptime: "Unknown",
		};
	}
}

// ─── Traffic Metrics (from snapshots) ───
export async function getTrafficMetrics(hours: number = 24) {
	const since = new Date(Date.now() - hours * 60 * 60 * 1000);

	const snapshots = await db
		.select()
		.from(system_metrics_snapshots)
		.where(gte(system_metrics_snapshots.created_at, since))
		.orderBy(desc(system_metrics_snapshots.created_at))
		.limit(60); // max 60 data points

	return snapshots.reverse(); // chronological order
}

// ─── Combined Health Check ───
export async function getSystemHealth() {
	const checks: Array<{
		service: string;
		status: "healthy" | "degraded" | "down";
		details: string;
		latencyMs?: number;
	}> = [];

	// API Server
	checks.push({
		service: "API Server",
		status: "healthy",
		details: `Uptime: ${Math.round(process.uptime() / 60)} minutes`,
	});

	// Database
	try {
		const start = Date.now();
		await pool.query("SELECT 1");
		const latency = Date.now() - start;
		checks.push({
			service: "PostgreSQL",
			status: latency > 500 ? "degraded" : "healthy",
			details: `Connected, pool: ${pool.totalCount}/${pool.idleCount} (total/idle)`,
			latencyMs: latency,
		});
	} catch {
		checks.push({
			service: "PostgreSQL",
			status: "down",
			details: "Connection failed",
		});
	}

	// Memory check
	const memUsage = process.memoryUsage();
	const heapPercent = (memUsage.heapUsed / memUsage.heapTotal) * 100;
	checks.push({
		service: "Memory",
		status: heapPercent > 90 ? "degraded" : "healthy",
		details: `Heap: ${Math.round(heapPercent)}% used (${Math.round(memUsage.heapUsed / 1024 / 1024)}MB / ${Math.round(memUsage.heapTotal / 1024 / 1024)}MB)`,
	});

	// OS Memory
	const totalMem = os.totalmem();
	const freeMem = os.freemem();
	const osMemPercent = ((totalMem - freeMem) / totalMem) * 100;
	checks.push({
		service: "OS Memory",
		status: osMemPercent > 90 ? "degraded" : "healthy",
		details: `${Math.round(osMemPercent)}% used (${Math.round((totalMem - freeMem) / 1024 / 1024)}MB / ${Math.round(totalMem / 1024 / 1024)}MB)`,
	});

	return {
		overall: checks.every((c) => c.status === "healthy")
			? "healthy"
			: checks.some((c) => c.status === "down")
				? "down"
				: "degraded",
		checks,
		timestamp: new Date().toISOString(),
	};
}

// ─── Metrics Snapshot (called periodically) ───
export async function captureMetricsSnapshot() {
	try {
		const cpuUsage = getCpuUsage();
		const memUsage = process.memoryUsage();
		const totalMem = os.totalmem();
		const freeMem = os.freemem();
		const counters = resetRequestCounters();

		let dbPoolSize = 0;
		let dbPoolAvailable = 0;
		try {
			dbPoolSize = pool.totalCount;
			dbPoolAvailable = pool.idleCount;
		} catch {}

		await db.insert(system_metrics_snapshots).values({
			cpu_usage: cpuUsage,
			memory_usage: Math.round(
				((totalMem - freeMem) / totalMem) * 100
			),
			memory_total: Math.round(totalMem / 1024 / 1024),
			heap_used: Math.round(memUsage.heapUsed / 1024 / 1024),
			heap_total: Math.round(memUsage.heapTotal / 1024 / 1024),
			active_connections: pool.totalCount - pool.idleCount,
			requests_per_minute: counters.requestCount,
			avg_response_time_ms: Math.round(counters.avgResponseTime),
			error_count: counters.errorCount,
			uptime_seconds: process.uptime(),
			db_pool_size: dbPoolSize,
			db_pool_available: dbPoolAvailable,
		});
	} catch (err) {
		console.error("[Metrics] Failed to capture snapshot:", err);
	}
}

// ─── Cleanup old snapshots (keep last 7 days) ───
export async function cleanupOldSnapshots() {
	try {
		const sevenDaysAgo = new Date(
			Date.now() - 7 * 24 * 60 * 60 * 1000
		);
		await db
			.delete(system_metrics_snapshots)
			.where(
				sql`${system_metrics_snapshots.created_at} < ${sevenDaysAgo}`
			);
	} catch (err) {
		console.error("[Metrics] Failed to cleanup old snapshots:", err);
	}
}
