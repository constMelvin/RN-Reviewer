import type { Books, BooksInput } from '@/@types/books'
import { BOOKS_KEY } from '@/constant/queryKeys'
import { client } from '@/lib/client'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

type BResponse = Books
type BContext = {
  previousBooks: Books[]
}

export function useBooks() {
  return useQuery<Books[], Error>({
    queryKey: BOOKS_KEY,
    queryFn: async () => {
      const res = await client.api.v1.books.$get()
      const result = await res.json()
      return result.books as Books[]
    },
  })
}

export function useCreateBook() {
  const queryClient = useQueryClient()

  return useMutation<BResponse, Error, BooksInput, BContext>({
    mutationFn: async (bookInput: BooksInput) => {
      try {
        const res = await client.api.v1.books['create-books'].$post({
          json: bookInput,
        })
        return await res.json()
      } catch (error: any) {
        throw error.response?.data?.message || 'Something went wrong'
      }
    },
    onMutate: async (bookInput: BooksInput) => {
      await queryClient.cancelQueries({ queryKey: BOOKS_KEY })
      const previousBooks = queryClient.getQueryData<Books[]>(BOOKS_KEY) || []

      const tempId = `temp-${Date.now()}`
      console.log(previousBooks)
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
      console.log(previousBooks)
      console.log('onMutate End.')
      return { previousBooks }
    },
    onError(_err, _bookInput, context) {
      if (context?.previousBooks) {
        queryClient.setQueryData(BOOKS_KEY, context.previousBooks)
      }
    },
    onSuccess(data) {
      alert(`${data.book_title} book successfully added.`)
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: BOOKS_KEY }),
  })
}
