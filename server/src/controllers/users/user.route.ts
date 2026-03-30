import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { createUserController } from "./create-user";
import { loginUserController } from "./login-user";
import { signOutUser } from "./sign-out";
import { CreateUserValueSchema, LoginUserValueSchema } from "./dto/user.dto";
import { BadRequestError } from "@/utils/errors";


const userRoutes = new Hono()
	.post(
		"/register",
		zValidator("json", CreateUserValueSchema, (result) => {
			if (!result.success)
				throw new BadRequestError("All fields are required.");
		}),
		(c) => createUserController(c, c.req.valid("json"))
	)
	.post(
		"/login",
		zValidator("json", LoginUserValueSchema, (result) => {
			if (!result.success)
				throw new BadRequestError("All fields are required1.");
		}),
		(c) => loginUserController(c, c.req.valid("json"))
	)
	.post("/logout", signOutUser);

export default userRoutes;
