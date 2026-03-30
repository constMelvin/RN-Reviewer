import type { Context } from "hono";
import { type CreateTopicInput, CreateTopicSchema } from "./dto/topics.dto";
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
