import type { Context } from "hono";

import { isUserLogin } from "@/utils/isUserLogin";
import { ForbiddenError } from "@/utils/errors";
import { SubTopicsService } from "@/services/sub-topics.services";
import {
	type CreateSubTopicsInput,
	CreateSubTopicsSchema,
	UpdateSubTopicSchema,
	type UpdateSubTopicStatus,
	UpdateSubTopicDetailsSchema,
	type UpdateSubTopicDetailsInput,
	DeleteSubTopicSchema,
	type DeleteSubTopicInput,
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

export const updateSubTopicDetails = async (
	c: Context,
	body: UpdateSubTopicDetailsInput
) => {
	const dbClient = c.get("dbClient");
	const user = c.get("user");
	const verifyUser = await isUserLogin(c, user.id);

	if (!verifyUser)
		throw new ForbiddenError("Please login first!");

	const validated = UpdateSubTopicDetailsSchema.parse(body);

	const updated = await SubTopicsService.updateSubTopicDetailsHandler({
		dbClient,
		values: validated,
	});
	return c.json(updated, 200);
};

export const deleteSubTopic = async (
	c: Context,
	body: DeleteSubTopicInput
) => {
	const dbClient = c.get("dbClient");
	const user = c.get("user");
	const verifyUser = await isUserLogin(c, user.id);

	if (!verifyUser)
		throw new ForbiddenError("Please login first!");

	const validated = DeleteSubTopicSchema.parse(body);

	const deleted = await SubTopicsService.deleteSubTopicHandler({
		dbClient,
		subtopic_id: validated.subtopic_id,
	});
	return c.json(deleted, 200);
};

