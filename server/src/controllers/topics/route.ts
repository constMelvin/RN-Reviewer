import { authMiddleware } from "@/middlewares/auth-middleware";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import {
	CreateTopicSchema,
	UpdateTopicSchema,
	DeleteTopicSchema,
} from "./dto/topics.dto";
import { BadRequestError } from "@/utils/errors";
import { createTopics, updateTopics, deleteTopic } from "./topics.controller";

export const topicsRoutes = new Hono()
	.use("*", authMiddleware)
	.post(
		"/create-topics",
		zValidator("json", CreateTopicSchema, (result) => {
			if (!result.success)
				throw new BadRequestError("All inputs are required to fill.");
		}),
		(c) => createTopics(c, c.req.valid("json"))
	)
	.patch(
		"/update-topics",
		zValidator("json", UpdateTopicSchema, (result) => {
			if (!result.success)
				throw new BadRequestError("topic_id and at least one field are required.");
		}),
		(c) => updateTopics(c, c.req.valid("json"))
	)
	.delete(
		"/delete-topics",
		zValidator("json", DeleteTopicSchema, (result) => {
			if (!result.success)
				throw new BadRequestError("topic_id is required.");
		}),
		(c) => deleteTopic(c, c.req.valid("json"))
	);

