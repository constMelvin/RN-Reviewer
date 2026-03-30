import type { Context } from "hono";

import { isUserLogin } from "@/utils/isUserLogin";
import { ForbiddenError } from "@/utils/errors";
import { SubTopicsService } from "@/services/sub-topics.services";
import {
	type CreateSubTopicsInput,
	CreateSubTopicsSchema,
	UpdateSubTopicSchema,
	type UpdateSubTopicStatus,
} from "./sub-topics.dto";

export const createSubtopicsController = async (
	c: Context,
	body: CreateSubTopicsInput
) => {
	const dbClient = c.get("dbClient");
	const user = c.get("user");

	const verifyUser = await isUserLogin(c, user.id);

	if (!verifyUser)
		throw new ForbiddenError(
			"User not forbidden to create subtopics. Please login first!!"
		);
	const validated = CreateSubTopicsSchema.parse(body);

	const createdSubTopics = await SubTopicsService.createSubTopicsHandler({
		dbClient,
		values: validated,
	});

	return c.json(createdSubTopics, 201);
};

export const updateStatus = async (c: Context, body: UpdateSubTopicStatus) => {
	const dbClient = c.get("dbClient");
	const user = c.get("user");
	const verifyUser = await isUserLogin(c, user.id);

	if (!verifyUser)
		throw new ForbiddenError(
			"User not forbidden to create subtopics. Please login first!!"
		);
	const validated = UpdateSubTopicSchema.parse(body);

	const values = {
		...validated,
		done: validated.status === "Mastered" ? true : false,
	};

	const updatedStatus = await SubTopicsService.updateSubTopicHandler({
		dbClient,
		values,
	});
	return c.json(updatedStatus, 200);
};
