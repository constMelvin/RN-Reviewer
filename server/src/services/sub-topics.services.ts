import {
	CreateSubTopicsArgs,
	SubTopicsData,
	UpdateSubTopicsArgs,
} from "@/data/subtopics/sub-topics.data";
import { BadRequestError } from "@/utils/errors";

export const SubTopicsService = {
	createSubTopicsHandler: async ({
		dbClient,
		values,
	}: CreateSubTopicsArgs) => {
		if (
			!values.topic_id ||
			!values.topics ||
			!values.links ||
			!values.deadline
		)
			throw new BadRequestError("All fields are required.");
		return SubTopicsData.createSubTopic({ dbClient, values });
	},
	updateSubTopicHandler: async ({
		dbClient,
		values,
	}: UpdateSubTopicsArgs) => {
		if (!values.status || !values.subtopic_id) {
			throw new BadRequestError("All fields are required.");
		}
		return SubTopicsData.updateSubTopic({ dbClient, values });
	},
};
