import type { Context } from "hono";
import {
	type CreateTopicInput,
	CreateTopicSchema,
	type UpdateTopicInput,
	UpdateTopicSchema,
	type DeleteTopicInput,
	DeleteTopicSchema,
} from "./dto/topics.dto";
import { TopicsService } from "@/services/topics.services";

export const createTopics = async (c: Context, body: CreateTopicInput) => {
	const dbClient = c.get("dbClient");
	const validated = CreateTopicSchema.parse(body);

	const createdTopics = await TopicsService.createHandler({
		dbClient,
		values: validated,
	});

	return c.json(createdTopics, 201);
};

export const updateTopics = async (c: Context, body: UpdateTopicInput) => {
	const dbClient = c.get("dbClient");
	const validated = UpdateTopicSchema.parse(body);

	const updated = await TopicsService.updateHandler({
		dbClient,
		values: validated,
	});

	return c.json(updated, 200);
};

export const deleteTopic = async (c: Context, body: DeleteTopicInput) => {
	const dbClient = c.get("dbClient");
	const validated = DeleteTopicSchema.parse(body);

	const deleted = await TopicsService.deleteHandler({
		dbClient,
		topic_id: validated.topic_id,
	});

	return c.json(deleted, 200);
};

