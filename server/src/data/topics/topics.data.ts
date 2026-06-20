import { type DbClient } from "@/db/create-db-client";
import { book_topics } from "@/db/schema";
import { eq, type InferInsertModel } from "drizzle-orm";

export type CreateTopicsArgs = {
	dbClient: DbClient;
	values: InferInsertModel<typeof book_topics>;
};

export type GetAllTopicsArgs = {
	dbClient: DbClient;
	book_id: string;
};

export type UpdateTopicArgs = {
	dbClient: DbClient;
	values: {
		topic_id: string;
		topics?: string;
		deadline?: string;
		links?: string;
	};
};

export type DeleteTopicArgs = {
	dbClient: DbClient;
	topic_id: string;
};

export const TopicsData = {
	createTopic: async ({ dbClient, values }: CreateTopicsArgs) => {
		return dbClient.insert(book_topics).values(values).returning();
	},
	getAllTopic: async ({ book_id, dbClient }: GetAllTopicsArgs) => {
		return dbClient
			.select()
			.from(book_topics)
			.where(eq(book_topics.book_id, book_id));
	},
	updateTopic: async ({ dbClient, values }: UpdateTopicArgs) => {
		const { topic_id, ...fields } = values;
		return dbClient
			.update(book_topics)
			.set({ ...fields, updated_at: new Date() })
			.where(eq(book_topics.topic_id, topic_id))
			.returning();
	},
	deleteTopic: async ({ dbClient, topic_id }: DeleteTopicArgs) => {
		return dbClient
			.delete(book_topics)
			.where(eq(book_topics.topic_id, topic_id))
			.returning();
	},
};
