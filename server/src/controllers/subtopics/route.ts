import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";

import { BadRequestError } from "@/utils/errors";
import {
	createSubtopicsController,
	updateStatus,
} from "./sub-topics.controller";
import { authMiddleware } from "@/middlewares/auth-middleware";
import { CreateSubTopicsSchema, UpdateSubTopicSchema } from "./sub-topics.dto";

export const subTopicsRoutes = new Hono()
	.use("*", authMiddleware)
	.post(
		"/create-sub-topics",
		zValidator("json", CreateSubTopicsSchema, (result) => {
			if (!result.success) throw new BadRequestError("No data found.");
		}),
		(c) => createSubtopicsController(c, c.req.valid("json"))
	)
	.patch(
		"/update-sub-topics",
		zValidator("json", UpdateSubTopicSchema, (res) => {
			if (!res.success) throw new BadRequestError("No data found.");
		}),
		(c) => updateStatus(c, c.req.valid("json"))
	);
