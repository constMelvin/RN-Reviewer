import type { BookTopics } from '@/@types/books'
import { BOOKS_KEY } from '@/constant/queryKeys'
import { api } from '@/utils/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'

type TResponse = BookTopics[]
type TInput = {
  book_id: string
  topics: string
  deadline: string
  links: string
}

export function useCreateTopics() {
  const queryClient = useQueryClient()

  return useMutation<TResponse, Error, TInput>({
    mutationFn: async (topics: TInput) => {
      try {
        // const res = await client.api.v1.topic['create-topics'].$post({
        //   json: topics,
        // })

        // return await res.json()

        const { data } = await api.post("/v1/topic/create-topics", topics);
        return data;
      } catch (error: any) {
        throw error.response?.data?.message || 'Something went wrong'
      }
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: BOOKS_KEY }),
  })
}
