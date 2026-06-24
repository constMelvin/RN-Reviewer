import z from "zod";

export const CreateTopicSchema = z.object({
	topics: z.string().min(1),
	deadline: z.string().min(1),
	links: z.string(),
	book_id: z.uuid(),
});

export const UpdateTopicSchema = z.object({
	topic_id: z.uuid(),
	topics: z.string().min(1).optional(),
	deadline: z.string().min(1).optional(),
	links: z.string().optional(),
});

export const DeleteTopicSchema = z.object({
	topic_id: z.uuid(),
});

export type CreateTopicInput = z.infer<typeof CreateTopicSchema>;
export type UpdateTopicInput = z.infer<typeof UpdateTopicSchema>;
export type DeleteTopicInput = z.infer<typeof DeleteTopicSchema>;

