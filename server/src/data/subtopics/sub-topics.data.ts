import { type DbClient } from "@/db/create-db-client";
import { book_subtopics, book_topics } from "@/db/schema";
import { eq, type InferInsertModel } from "drizzle-orm";

export type CreateSubTopicsArgs = {
	dbClient: DbClient;
	values: InferInsertModel<typeof book_subtopics>;
};
export type UpdateSubTopicsArgs = {
	dbClient: DbClient;
	values: {
		subtopic_id: string;
		status: string | null;
		done: boolean;
	};
};

export type UpdateSubTopicDetailsArgs = {
	dbClient: DbClient;
	values: {
		subtopic_id: string;
		topics?: string;
		deadline?: string;
		links?: string;
	};
};

export type DeleteSubTopicArgs = {
	dbClient: DbClient;
	subtopic_id: string;
};

export const SubTopicsData = {
	createSubTopic: async ({ dbClient, values }: CreateSubTopicsArgs) => {
		const newSubtopic = await dbClient
			.insert(book_subtopics)
			.values(values)
			.returning();

		if (newSubtopic[0]?.topic_id) {
			await dbClient
				.update(book_topics)
				.set({ done: false })
				.where(eq(book_topics.topic_id, newSubtopic[0].topic_id));
		}

		return newSubtopic;
	},
	updateSubTopic: async ({ dbClient, values }: UpdateSubTopicsArgs) => {
		const updatedSubTopic = await dbClient
			.update(book_subtopics)
			.set(values)
			.where(eq(book_subtopics.subtopic_id, values.subtopic_id))
			.returning();

		const allSubtopics = await dbClient
			.select()
			.from(book_subtopics)
			.where(eq(book_subtopics.topic_id, updatedSubTopic[0].topic_id));
		const allMastered =
			allSubtopics.length > 0 &&
			allSubtopics.every((st) => st.status === "Mastered");

		await dbClient
			.update(book_topics)
			.set({ done: allMastered })
			.where(eq(book_topics.topic_id, updatedSubTopic[0].topic_id));
		return updatedSubTopic;
	},
	updateSubTopicDetails: async ({
		dbClient,
		values,
	}: UpdateSubTopicDetailsArgs) => {
		const { subtopic_id, ...fields } = values;
		return dbClient
			.update(book_subtopics)
			.set(fields)
			.where(eq(book_subtopics.subtopic_id, subtopic_id))
			.returning();
	},
	deleteSubTopic: async ({ dbClient, subtopic_id }: DeleteSubTopicArgs) => {
		return dbClient
			.delete(book_subtopics)
			.where(eq(book_subtopics.subtopic_id, subtopic_id))
			.returning();
	},
};

