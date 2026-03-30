import z from "zod";

export const CreateUserValueSchema = z.object({
	name: z.string().min(1),
	email: z.email(),
	password: z.string().min(1),
	username: z.string().min(1),
});

export const LoginUserValueSchema = z.object({
	emailOrUsername: z.string().min(1, "Email or Username is required."),
	password: z.string().min(1),
	rememberMe: z.boolean().default(false),
});

export type CreateUserInput = z.infer<typeof CreateUserValueSchema>;
export type LoginUserInput = z.infer<typeof LoginUserValueSchema>;
