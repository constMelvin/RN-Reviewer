import type { Context } from "hono";
import { type CreateBookInput, CreateBookSchema } from "./dto/book-create.dto";

import { v4 as uuidv4 } from "uuid";
import { isUserLogin } from "@/utils/isUserLogin";
import { ForbiddenError } from "@/utils/errors";
import { BookService } from "@/services/book.services";


export const createBooks = async (c: Context, body: CreateBookInput) => {
	const validate = CreateBookSchema.parse(body);
	const dbClient = c.get("dbClient");
	const user = c.get("user");
	const verifyUser = await isUserLogin(c, user.id);

	if (!verifyUser)
		throw new ForbiddenError(
			"User not forbidden to create books. Please login first!!"
		);

	const values = {
		book_id: uuidv4(),
		book_title: validate.book_title,
		book_type: validate.book_type,
		user_id: user.id,
	};

	const createdBook = await BookService.createHandler({ dbClient, values });

	return c.json(createdBook[0], 201);
};
