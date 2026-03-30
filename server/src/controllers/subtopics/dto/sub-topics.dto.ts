import z from "zod";

export const CreateValueSchema = z.object({
	topics: z.string().min(1, "topics is required"),
	deadline: z.string().min(1, "deadline is required"),
	links: z.string().min(1, "links is required"),
});
