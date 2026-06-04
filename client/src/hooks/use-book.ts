import type { Books, BooksInput } from '@/@types/books'
import { BOOKS_KEY } from '@/constant/queryKeys'
import { api } from '@/utils/api'
// import { client } from '@/lib/client'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

type BResponse = Books
type BContext = {
  previousBooks: Books[]
}

export function useBooks() {
  return useQuery<Books[], Error>({
    queryKey: BOOKS_KEY,
    queryFn: async () => {
      // const res = await client.api.v1.books.$get()
      const { data } = await api.get("/v1/books");
      return data.books as Books[]
    },
  })
}

export function useCreateBook() {
  const queryClient = useQueryClient()

  return useMutation<BResponse, Error, BooksInput, BContext>({
    mutationFn: async (bookInput: BooksInput) => {
      try {
        // const res = await client.api.v1.books['create-books'].$post({
        //   json: bookInput,
        // })

        const res = await api.post("/v1/books/create-books", bookInput);
        return res.data as Books
      } catch (error: any) {
        throw error.response?.data?.message || 'Something went wrong'
      }
    },
    onMutate: async (bookInput: BooksInput) => {
      await queryClient.cancelQueries({ queryKey: BOOKS_KEY })
      const previousBooks = queryClient.getQueryData<Books[]>(BOOKS_KEY) || []

      const tempId = `temp-${Date.now()}`
      queryClient.setQueryData<Books[]>(BOOKS_KEY, [
        ...previousBooks,
        {
          book_id: tempId,
          book_title: bookInput.book_title,
          book_type: bookInput.book_type,
          user_id: 'tempID',
          topics: [],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      return { previousBooks }
    },
    onError(_err, _bookInput, context) {
      if (context?.previousBooks) {
        queryClient.setQueryData(BOOKS_KEY, context.previousBooks)
      }
    },

    onSettled: () => queryClient.invalidateQueries({ queryKey: BOOKS_KEY }),
  })
}
