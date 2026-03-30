
import { BookService } from "@/services/book.services";
import { UnauthorizedError } from "@/utils/errors";
import type { Context } from "hono";

export const getAllBooksByUser = async (c: Context) => {
	const user = c.get("user");
	const dbClient = c.get("dbClient");
	// const dbClient = createDbClient();

	if (!user)
		throw new UnauthorizedError("User not found or Unauthorized user.");

	// const books = await BookService.getAllBooksHandler({
	// 	dbClient,
	// 	user_id: "PTtK0XY25QMyaO8NHYrizorOgugn1urz",
	// });

	const books = await BookService.getAllBooksHandler({
		dbClient,
		user_id: user.id,
	});

	return c.json({ message: "Book successfully fetch.", books }, 200);
};
