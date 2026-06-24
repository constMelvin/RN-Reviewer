import { book_subtopics } from "@/db/schema";
import type { InferSelectModel } from "drizzle-orm";
import z from "zod";

export const CreateSubTopicsSchema = z.object({
	topics: z.string().min(1),
	deadline: z.string().min(1),
	links: z.string().min(1),
	topic_id: z.uuidv4(),
});

export const SubTopicSchema = z.object({
	topics: z.string(),
	deadline: z.string(),
	links: z.string().nullable(),
	topic_id: z.string(),
	subtopic_id: z.string(),
	done: z.boolean().nullable(),
	status: z.string().nullable(),
});

export const UpdateSubTopicSchema = z.object({
	subtopic_id: z.string(),
	status: z.string().nullable()
});

export const UpdateSubTopicDetailsSchema = z.object({
	subtopic_id: z.string().uuid(),
	topics: z.string().min(1).optional(),
	deadline: z.string().min(1).optional(),
	links: z.string().optional(),
});

export const DeleteSubTopicSchema = z.object({
	subtopic_id: z.string().uuid(),
});

type SupTopic = InferSelectModel<typeof book_subtopics>;

export type UpdateSubTopicStatus = Pick<SupTopic, "status" | "subtopic_id">;
export type CreateSubTopicsInput = z.infer<typeof CreateSubTopicsSchema>;
export type UpdateSubTopicDetailsInput = z.infer<typeof UpdateSubTopicDetailsSchema>;
export type DeleteSubTopicInput = z.infer<typeof DeleteSubTopicSchema>;

