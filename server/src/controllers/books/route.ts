import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { CreateBookSchema } from "./dto/book-create.dto";
import { BadRequestError } from "@/utils/errors";
import { createBooks } from "./create-books";
import { getAllBooksByUser } from "./get-all-books";
import { authMiddleware } from "@/middlewares/auth-middleware";

export const bookRoutes = new Hono()
	.use("*", authMiddleware)
	.get("/", getAllBooksByUser)
	.post(
		"/create-books",
		zValidator("json", CreateBookSchema, (result) => {
			if (!result.success)
				throw new BadRequestError("All inputs are required to fill.");
		}),
		(c) => createBooks(c, c.req.valid("json"))
	);
