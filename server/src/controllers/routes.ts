import { Hono } from "hono";
import { taskRoutes } from "./tasks/route";
import { bookRoutes } from "./books/route";
import { topicsRoutes } from "./topics/route";
import { subTopicsRoutes } from "./subtopics/route";
import { agendaRoutes } from "./agenda/route";
import { scoreRoutes } from "./scores/route";
import { adminDashboardRoutes } from "./admin/admin-dashboard.routes";
import { adminUsersRoutes } from "./admin/admin-users.routes";
import { adminMonitoringRoutes } from "./admin/admin-monitoring.routes";
import { adminSecurityRoutes } from "./admin/admin-security.routes";
import { adminScoresRoutes } from "./admin/admin-scores.routes";

export const rootRoutes = new Hono()
	.route("/books", bookRoutes)
	.route("/tasks", taskRoutes)
	.route("/topic", topicsRoutes)
	.route("/sub-topics", subTopicsRoutes)
	.route("/agenda", agendaRoutes)
	.route("/score", scoreRoutes)
	.route("/admin/dashboard", adminDashboardRoutes)
	.route("/admin/users", adminUsersRoutes)
	.route("/admin/monitoring", adminMonitoringRoutes)
	.route("/admin/security", adminSecurityRoutes)
	.route("/admin/scores", adminScoresRoutes);
