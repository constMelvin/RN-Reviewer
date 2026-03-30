import { auth } from "@/lib/auth";
import type { Context } from "hono";
import { type CreateUserInput, CreateUserValueSchema } from "./dto/user.dto";
import { BadRequestError } from "@/utils/errors";

export const createUserController = async (
	c: Context,
	body: CreateUserInput
) => {
	const validation = CreateUserValueSchema.safeParse(body);

	if (!validation.success) {
		throw new BadRequestError("No data found from the body.");
	}
	const { email, name, password, username } =
		validation.data;
	const data = await auth.api.signUpEmail({
		body: {
			email,
			name,
			password,
			username,
		},
	});

	return c.json(
		{
			message: "Account Created. Proceed to login page",
			data,
		},
		201
	);
};
