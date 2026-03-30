import {
	BookData,
	CreateBookArgs,
	GetAllBooksArgs,
} from "@/data/books/books.data";

export const BookService = {
	createHandler: async ({ dbClient, values }: CreateBookArgs) => {
		return await BookData.create({ dbClient, values });
	},
	getAllBooksHandler: async ({ dbClient, user_id }: GetAllBooksArgs) => {
		return await BookData.getAllBooks({ dbClient, user_id });
	},
};
