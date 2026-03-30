import z from "zod";

export const CreateTopicSchema = z.object({
	topics: z.string().min(1),
	deadline: z.string().min(1),
	links: z.string(),
	book_id: z.uuid(),
});

export type CreateTopicInput = z.infer<typeof CreateTopicSchema>;
