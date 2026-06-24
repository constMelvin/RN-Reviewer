import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";

import { BadRequestError } from "@/utils/errors";
import {
	createSubtopicsController,
	updateStatus,
	updateSubTopicDetails,
	deleteSubTopic,
} from "./sub-topics.controller";
import { authMiddleware } from "@/middlewares/auth-middleware";
import {
	CreateSubTopicsSchema,
	UpdateSubTopicSchema,
	UpdateSubTopicDetailsSchema,
	DeleteSubTopicSchema,
} from "./sub-topics.dto";

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
	)
	.patch(
		"/update-sub-topics-details",
		zValidator("json", UpdateSubTopicDetailsSchema, (res) => {
			if (!res.success) throw new BadRequestError("subtopic_id is required.");
		}),
		(c) => updateSubTopicDetails(c, c.req.valid("json"))
	)
	.delete(
		"/delete-sub-topics",
		zValidator("json", DeleteSubTopicSchema, (res) => {
			if (!res.success) throw new BadRequestError("subtopic_id is required.");
		}),
		(c) => deleteSubTopic(c, c.req.valid("json"))
	);

