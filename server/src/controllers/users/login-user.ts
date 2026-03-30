

import type { Context } from "hono";
import { type LoginUserInput, LoginUserValueSchema } from "./dto/user.dto";
import { auth } from "@/lib/auth";
import { BadRequestError, UnauthorizedError } from "@/utils/errors";

export const loginUserController = async (c: Context, body: LoginUserInput) => {
	const validation = LoginUserValueSchema.safeParse(body);

	if (!validation.success) {
		throw new BadRequestError("Invalid request body.");
	}

	const { emailOrUsername, password, rememberMe } = validation.data;
	const isEmail = emailOrUsername.includes("@");

	const authResponse = isEmail
		? await auth.api.signInEmail({
				body: { email: emailOrUsername, password, rememberMe },
				headers: c.req.raw.headers,
				asResponse: true,
			})
		: await auth.api.signInUsername({
				body: { username: emailOrUsername, password },
				headers: c.req.raw.headers,
				asResponse: true,
			});

	if (!authResponse.ok) {
		throw new UnauthorizedError("Invalid login credentials.");
	}

	// console.log("data line 32: " + (await authResponse.json()));
	// MUST forward Set-Cookie headers for session persistence
	return new Response(
		JSON.stringify({
			message: "Login successful",
			data: await authResponse.json(),
		}),
		{
			status: authResponse.status,
			headers: authResponse.headers,
		}
	);
};
