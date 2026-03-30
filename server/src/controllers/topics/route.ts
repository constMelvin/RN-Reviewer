import { authMiddleware } from "@/middlewares/auth-middleware";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { CreateTopicSchema } from "./dto/topics.dto";
import { BadRequestError } from "@/utils/errors";
import { createTopics } from "./topics.controller";

export const topicsRoutes = new Hono().use("*", authMiddleware).post(
	"/create-topics",
	zValidator("json", CreateTopicSchema, (result) => {
		if (!result.success)
			throw new BadRequestError("All inputs are required to fill.");
	}),
	(c) => createTopics(c, c.req.valid("json"))
);
