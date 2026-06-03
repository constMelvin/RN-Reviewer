import { authMiddleware } from "@/middlewares/auth-middleware";
import { Hono } from "hono";
import {
	createAgendaController,
	getAgendaController,
	getMissedController,
	markDoneController,
} from "./agenda.controller";
import { zValidator } from "@hono/zod-validator";
import { AgendaParamsSchema, CreateAgendaSchema } from "./dto/agenda.dto";
import { BadRequestError } from "@/utils/errors";

export const agendaRoutes = new Hono()
	.use("*", authMiddleware)
	.get("/", getAgendaController)
	.get("/missed", getMissedController)
	.post(
		"/",
		zValidator("json", CreateAgendaSchema, (res) => {
			if (!res.success) throw new BadRequestError("Title is required.");
		}),
		(c) => createAgendaController(c, c.req.valid("json"))
	)
	.patch(
		"/:id/done",
		zValidator("param", AgendaParamsSchema, (res) => {
			if (!res.success) throw new BadRequestError("Invalid agenda ID.");
		}),
		(c) => markDoneController(c, c.req.valid("param"))
	);
