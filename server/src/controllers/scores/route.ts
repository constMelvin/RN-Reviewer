import { authMiddleware } from "@/middlewares/auth-middleware";
import { Hono } from "hono";
import { createScoreController, getScoreController } from "./scores.controller";
import { zValidator } from "@hono/zod-validator";
import { CreateScoreSchema } from "./dto/scores.dto";
import { BadRequestError } from "@/utils/errors";

export const scoreRoutes = new Hono()
	.use("*", authMiddleware)
	.get("/", getScoreController)
	.post(
		"/",
		zValidator("json", CreateScoreSchema, (res) => {
			if (!res.success)
				throw new BadRequestError(
					"Error on Routes: Input Fields is Required."
				);
		}),
		(c) => createScoreController(c, c.req.valid("json"))
	);
