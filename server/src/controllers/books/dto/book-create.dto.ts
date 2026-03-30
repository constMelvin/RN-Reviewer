import z from "zod";

export const CreateBookSchema = z.object({
	book_title: z.string().min(1, "Book Title is required."),
	book_type: z.string().min(1, "Book Type is required."),
});

export type CreateBookInput = z.infer<typeof CreateBookSchema>;
