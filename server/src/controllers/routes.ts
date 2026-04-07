import { Hono } from "hono";
import { taskRoutes } from "./tasks/route";
import { bookRoutes } from "./books/route";
import { topicsRoutes } from "./topics/route";
import { subTopicsRoutes } from "./subtopics/route";
import { agendaRoutes } from "./agenda/route";
import { scoreRoutes } from "./scores/route";

export const rootRoutes = new Hono()
	.route("/books", bookRoutes)
	.route("/tasks", taskRoutes)
	.route("/topic", topicsRoutes)
	.route("/sub-topics", subTopicsRoutes)
	.route("/agenda", agendaRoutes)
	.route("/score", scoreRoutes);
