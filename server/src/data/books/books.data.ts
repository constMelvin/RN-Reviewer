import { type CreateBookInput } from "@/controllers/books/dto/book-create.dto";
import {type DbClient } from "@/db/create-db-client";
import { books } from "@/db/schema";
import { eq, type InferInsertModel } from "drizzle-orm";

export type CreateBookArgs = {
	dbClient: DbClient;
	values: {
		book_id: string;
		book_title: string;
		book_type: string;
		user_id: string;
	};
};
export type GetAllBooksArgs = {
	dbClient: DbClient;
	user_id: string;
};

export const BookData = {
	create: async ({ dbClient, values }: CreateBookArgs) => {
		return dbClient.insert(books).values(values).returning();
	},
	getAllBooks: async ({ dbClient, user_id }: GetAllBooksArgs) => {
		return dbClient.query.books.findMany({
			where: eq(books.user_id, user_id),
			with: {
				topics: {
					with: {
						subtopics: true,
					},
				},
			},
		});
	},
};
