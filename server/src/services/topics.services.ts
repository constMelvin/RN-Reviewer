import {
	type CreateTopicsArgs,
	type DeleteTopicArgs,
	TopicsData,
	type UpdateTopicArgs,
} from "@/data/topics/topics.data";
import { BadRequestError } from "@/utils/errors";

export const TopicsService = {
	createHandler: async ({ dbClient, values }: CreateTopicsArgs) => {
		if (
			!values.book_id ||
			!values.topics ||
			!values.deadline ||
			!values.links
		)
			throw new BadRequestError("All inputs are required.");
		return TopicsData.createTopic({ dbClient, values });
	},
	updateHandler: async ({ dbClient, values }: UpdateTopicArgs) => {
		if (!values.topic_id)
			throw new BadRequestError("topic_id is required.");
		return TopicsData.updateTopic({ dbClient, values });
	},
	deleteHandler: async ({ dbClient, topic_id }: DeleteTopicArgs) => {
		if (!topic_id)
			throw new BadRequestError("topic_id is required.");
		return TopicsData.deleteTopic({ dbClient, topic_id });
	},
};

