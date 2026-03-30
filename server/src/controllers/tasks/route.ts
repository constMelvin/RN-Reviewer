import { Hono } from "hono";

import { zValidator } from "@hono/zod-validator";
import { BadRequestError } from "@/utils/errors";

import { CreateValueSchema, UpdateValueSchema } from "./dto/tasks.dto";
import {
	createTaskController,
	getAllTaskController,
	updateTaskController,
} from "./tasks.controller";
import { authMiddleware } from "@/middlewares/auth-middleware";

export const taskRoutes = new Hono()
	.use("*", authMiddleware)
	.get("/", getAllTaskController)
	.post(
		"/create-task",
		zValidator("json", CreateValueSchema, (result) => {
			console.log(result.data);
			if (!result.success)
				throw new BadRequestError(
					"All fields are required on creating task."
				);
		}),
		(c) => createTaskController(c, c.req.valid("json"))
	)
	.put(
		"/update-task/:id",
		zValidator("json", UpdateValueSchema, (result) => {
			if (!result.success) throw new BadRequestError("No data found.");
		}),
		(c) => updateTaskController(c, c.req.valid("json"))
	);
