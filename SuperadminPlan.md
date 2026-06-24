# Super Admin Dashboard — Full Rebuild with Monitoring & Security

Rebuild the super admin dashboard from a static mockup into a **real-time, data-driven command center** with user activity monitoring, database monitoring, server/traffic monitoring, and security auditing.

## Current State Analysis

Your existing [super-admin-page.tsx](file:///c:/Users/MLVN/Desktop/FutureRn/client/src/pages/super-admin-page.tsx) is a **1,252-line single-file component** with:
- All hardcoded/static data (no API calls)
- No actual monitoring capabilities
- No real-time data feeds
- Everything in one monolithic file

Your backend ([index.ts](file:///c:/Users/MLVN/Desktop/FutureRn/server/src/index.ts)) has **zero admin-specific API endpoints** — only user CRUD, books, tasks, topics, scores, and agenda routes.

---

## User Review Required

> [!IMPORTANT]
> **Breaking Change**: The existing `super-admin-page.tsx` will be replaced entirely with a new multi-page, component-based architecture. The route `/super-admin/dashboard` will remain the same.

> [!WARNING]
> **Database Migration Required**: New tables (`audit_logs`, `admin_activity_logs`, `system_metrics_snapshots`) will be added. You'll need to run `db:generate` and `db:push` after implementation.

> [!IMPORTANT]
> **Role-Based Access**: All new admin API endpoints will be gated behind a `superAdminMiddleware` that checks `user.role === 'super_admin'`. Make sure your database has at least one user with `role = 'super_admin'`.

---

## Open Questions

> [!IMPORTANT]
> **1. Real-time Updates**: Do you want true WebSocket-based live updates (server pushes data to dashboard), or is polling every 10–30 seconds acceptable? WebSockets add complexity but give instant updates.

> [!IMPORTANT]
> **2. Data Retention**: How long should audit logs and activity logs be retained? Options:
> - 30 days (lightweight)
> - 90 days (recommended)
> - 1 year (heavy — needs archiving strategy)

> [!IMPORTANT]
> **3. Notification System**: Do you want security alerts (brute force login, unusual traffic) to also send email/push notifications, or just show on the dashboard?

> [!IMPORTANT]
> **4. User Activity Scope**: "Monitor all user activities" — should this include:
> - Login/logout events only?
> - All CRUD operations (create book, add topic, submit score, etc.)?
> - Page views / navigation tracking?
> - All of the above?

---

## Proposed Changes

The rebuild is organized into 5 layers: **Database → Backend APIs → Middleware → Frontend Components → Dashboard Pages**.

---

### 1. Database Layer — New Schema Tables

#### [MODIFY] [schema.ts](file:///c:/Users/MLVN/Desktop/FutureRn/server/src/db/schema.ts)

Add 3 new tables:

**`audit_logs`** — Tracks every significant user action across the platform
```ts
{
  id, user_id, action, entity_type, entity_id, 
  metadata (jsonb), ip_address, user_agent, created_at
}
```
- Actions: `LOGIN`, `LOGOUT`, `CREATE_BOOK`, `UPDATE_TOPIC`, `SUBMIT_SCORE`, `REGISTER`, `FAILED_LOGIN`, etc.
- `metadata` stores action-specific details (e.g., score value, book title changed)

**`system_metrics_snapshots`** — Periodic server health snapshots (captured every 60s)
```ts
{
  id, cpu_usage, memory_usage, memory_total, heap_used, heap_total,
  active_connections, requests_per_minute, avg_response_time_ms,
  error_count, uptime_seconds, db_pool_size, db_pool_available,
  db_query_count, created_at
}
```

**`security_events`** — Dedicated table for security-relevant events
```ts
{
  id, event_type, severity (critical/warning/info), 
  source_ip, user_id (nullable), details, resolved, resolved_by, created_at
}
```
- Event types: `BRUTE_FORCE_ATTEMPT`, `RATE_LIMIT_EXCEEDED`, `SUSPICIOUS_AGENT`, `CONCURRENT_SESSIONS`, `UNUSUAL_ACTIVITY_PATTERN`

---

### 2. Backend — Admin API Endpoints

#### [NEW] `server/src/controllers/admin/` directory

All endpoints prefixed with `/api/v1/admin/` and protected by super admin middleware.

#### [NEW] admin-routes.ts
```
GET  /api/v1/admin/dashboard/stats      — KPI summary (total users, active sessions, revenue, etc.)
GET  /api/v1/admin/dashboard/activity    — Platform activity chart data (registrations, logins, exam attempts by day)
```

#### [NEW] admin-users.routes.ts
```
GET  /api/v1/admin/users                 — Paginated user list with search/filter
GET  /api/v1/admin/users/:id             — Single user detail with activity history
GET  /api/v1/admin/users/:id/activity    — User's complete activity log
GET  /api/v1/admin/users/online          — Currently active sessions
PATCH /api/v1/admin/users/:id/role       — Change user role
DELETE /api/v1/admin/users/:id           — Suspend/delete user
```

#### [NEW] admin-monitoring.routes.ts
```
GET  /api/v1/admin/monitoring/server     — Real-time server metrics (CPU, memory, uptime)
GET  /api/v1/admin/monitoring/database   — DB connection pool stats, table sizes, slow queries
GET  /api/v1/admin/monitoring/traffic    — Request rate, error rate, response times (from snapshots)
GET  /api/v1/admin/monitoring/health     — Combined health check for all services
```

#### [NEW] admin-security.routes.ts
```
GET  /api/v1/admin/security/events       — Paginated security events
GET  /api/v1/admin/security/alerts       — Active unresolved alerts
PATCH /api/v1/admin/security/events/:id  — Resolve/dismiss alert
GET  /api/v1/admin/audit-logs            — Paginated audit logs with filters
```

---

### 3. Backend — Middleware & Services

#### [NEW] `server/src/middlewares/super-admin-middleware.ts`
- Verifies the current session user has `role === 'super_admin'`
- Returns 403 Forbidden otherwise

#### [NEW] `server/src/middlewares/audit-middleware.ts`
- Global middleware that automatically logs significant API calls to `audit_logs`
- Captures: user ID, action type, IP, user agent, request body summary
- Runs on all mutating endpoints (POST, PATCH, PUT, DELETE)

#### [NEW] `server/src/services/admin/` directory

**`monitoring.service.ts`** — Server Monitoring
- `getServerMetrics()` — Uses `Bun.nanoseconds()`, `process.memoryUsage()`, `os.cpus()`, `os.freemem()` for real metrics
- `getDatabaseMetrics()` — Queries `pg_stat_activity`, `pg_database_size()`, `pg_stat_user_tables` for real DB stats
- `getTrafficMetrics()` — Aggregates from `system_metrics_snapshots` table

**`security.service.ts`** — Security Analysis
- `detectBruteForce()` — Checks for >5 failed logins from same IP in 15 min
- `detectConcurrentSessions()` — Flags users with >3 active sessions
- `getSecurityEvents()` — Paginated query with severity filters

**`analytics.service.ts`** — Dashboard Analytics
- `getDashboardStats()` — Aggregates user counts, active sessions, scores
- `getActivityChart()` — Groups registrations/logins/score-submissions by day
- `getUserGrowth()` — New registrations over time

#### [NEW] `server/src/services/admin/metrics-collector.ts`
- Background job (runs every 60 seconds) that captures system metrics snapshots
- Stores CPU, memory, request counts, error rates into `system_metrics_snapshots`
- Prunes old snapshots (keeps last 7 days)

---

### 4. Frontend — Component Architecture

Break the monolithic super admin page into a multi-page dashboard with shared layout.

#### [NEW] `client/src/pages/admin/` directory structure:
```
admin/
├── layout/
│   ├── AdminLayout.tsx          — Sidebar + header + main content shell
│   ├── AdminSidebar.tsx         — Navigation sidebar (extracted from current)
│   └── AdminHeader.tsx          — Top bar with search, notifications, theme toggle
├── dashboard/
│   ├── AdminDashboard.tsx       — Main overview page (KPIs + charts)
│   ├── KpiCards.tsx             — 4 top-level stat cards with sparklines
│   ├── ActivityChart.tsx        — Platform activity line chart
│   └── LiveFeed.tsx             — Real-time activity feed
├── users/
│   ├── UserManagement.tsx       — User list with search, filter, pagination
│   ├── UserDetail.tsx           — Individual user activity drill-down
│   └── OnlineUsers.tsx          — Currently active sessions view
├── monitoring/
│   ├── ServerMonitoring.tsx     — CPU, memory, uptime gauges (real data)
│   ├── DatabaseMonitoring.tsx   — DB pool, table sizes, connection count
│   ├── TrafficMonitoring.tsx    — Requests/min, error rate, response time charts
│   └── SystemHealth.tsx         — Service status overview (API, DB, cache)
├── security/
│   ├── SecurityCenter.tsx       — Security events & alerts dashboard
│   ├── AuditLogs.tsx            — Searchable, filterable audit log viewer
│   └── SecurityAlertCard.tsx    — Individual alert card component
└── shared/
    ├── AdminCard.tsx            — Reusable glassmorphic card
    ├── AdminBadge.tsx           — Status badge component
    ├── AdminTable.tsx           — Reusable data table with sort/filter
    ├── GaugeChart.tsx           — Circular gauge for CPU/memory
    ├── StatusIndicator.tsx      — Animated dot indicator (healthy/warning/critical)
    └── SectionHeading.tsx       — Section title with eyebrow text
```

---

### 5. Frontend — Hooks & Data Layer

#### [NEW] `client/src/hooks/admin/` directory:
```
use-admin-dashboard.ts    — Fetches KPIs, activity data (auto-refresh every 30s)
use-admin-users.ts        — User list with pagination, search, filtering
use-admin-monitoring.ts   — Server/DB/traffic metrics (auto-refresh every 10s)
use-admin-security.ts     — Security events and audit logs
use-admin-live-feed.ts    — Live activity feed (polling every 5s)
```

Each hook uses `@tanstack/react-query` with appropriate `refetchInterval` for auto-refresh.

---

### 6. Frontend — Route Registration

#### [MODIFY] `client/src/routes/_protected/super-admin/` directory

Add new route files for each admin sub-page:
```
dashboard.tsx         — (existing, update to use new AdminDashboard)
users.tsx             — User management page
monitoring.tsx        — Server/DB monitoring page  
security.tsx          — Security & audit logs page
```

#### [MODIFY] [routes.ts](file:///c:/Users/MLVN/Desktop/FutureRn/server/src/controllers/routes.ts)
- Add `.route("/admin", adminRoutes)` to register all admin API routes

---

### 7. Dashboard Design — Visual Sections

The rebuilt dashboard will have these sections (each a navigable page):

#### **📊 Dashboard (Overview)**
| Section | Data Source | Refresh |
|---------|-----------|---------|
| KPI Cards (Users, Active, Revenue, Readiness) | `/admin/dashboard/stats` | 30s |
| Platform Activity Chart | `/admin/dashboard/activity` | 60s |
| Live Activity Feed | `/admin/audit-logs?limit=10` | 5s |
| Quick Alerts Banner | `/admin/security/alerts` | 30s |

#### **👥 User Management**
| Feature | Description |
|---------|------------|
| User Table | Paginated list with name, email, role, status, last login, created date |
| Search & Filter | By name, email, role, date range |
| User Detail Drawer | Click a user → see their full activity log, sessions, scores |
| Online Users | Real-time view of active sessions with IP, user agent, duration |
| Role Management | Change user roles (student → admin → super_admin) |
| Bulk Actions | Suspend, delete, export |

#### **🖥️ Server Monitoring**
| Metric | How Collected |
|--------|--------------|
| CPU Usage | `os.cpus()` — real OS metrics |
| Memory Usage | `process.memoryUsage()` + `os.totalmem()` |
| Uptime | `process.uptime()` |
| Avg Response Time | Tracked via middleware counter |
| Requests/min | Middleware counter, stored in snapshots |
| Error Rate | Count of 4xx/5xx responses |

#### **🗄️ Database Monitoring**
| Metric | How Collected |
|--------|--------------|
| Connection Pool | `pg_stat_activity` count |
| Database Size | `pg_database_size()` |
| Table Row Counts | `pg_stat_user_tables` |
| Active Queries | `pg_stat_activity` where state = 'active' |
| Slow Queries | Queries > 1000ms from `pg_stat_statements` (if available) |

#### **🔒 Security Center**
| Feature | Description |
|---------|------------|
| Alert Feed | Critical/Warning/Info security events |
| Failed Login Tracker | IPs with repeated failures |
| Session Anomalies | Users with concurrent sessions from different IPs |
| Audit Log Viewer | Filterable log of all user actions |
| Rate Limit Monitor | IPs hitting rate limits |

---

### 8. Additional Suggestions (Safety & Operations)

These are extra features I recommend for a production admin dashboard:

| Feature | Priority | Description |
|---------|----------|-------------|
| **IP Geolocation** | Medium | Show login locations on a map (use free ip-api.com) |
| **Auto-ban Rules** | High | Automatically block IPs after 10 failed logins in 30 min |
| **Session Kill** | High | Force-logout a user from the admin panel |
| **Data Export** | Medium | Export audit logs, user data as CSV |
| **Maintenance Mode** | Medium | Toggle to put the app in maintenance mode |
| **Error Tracking** | High | Log and display server errors with stack traces |
| **Backup Status** | Low | Show last database backup time and status |
| **User Impersonation** | Low | Log in as a user to debug their issues (with audit trail) |

---

## Verification Plan

### Automated Tests
```bash
# Run database migration
cd server && bun run db:generate && bun run db:push

# Verify API health
curl http://localhost:8080/api/health

# Verify admin endpoints respond (with auth)
curl http://localhost:8080/api/v1/admin/dashboard/stats
curl http://localhost:8080/api/v1/admin/monitoring/server
curl http://localhost:8080/api/v1/admin/monitoring/database
```

### Manual Verification
- Login as super admin → verify dashboard loads with real data
- Check that server metrics (CPU, memory) update in real-time
- Check that database metrics show actual pool connections and DB size
- Verify audit logs are being created when users perform actions
- Verify non-admin users get 403 when trying to access admin endpoints
- Test on mobile viewport to confirm responsive layout
- Test dark mode toggle across all admin pages
