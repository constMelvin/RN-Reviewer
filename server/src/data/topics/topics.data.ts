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
};
