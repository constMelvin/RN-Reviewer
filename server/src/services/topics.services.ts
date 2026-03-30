import { CreateTopicsArgs, TopicsData } from "@/data/topics/topics.data";
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
};
