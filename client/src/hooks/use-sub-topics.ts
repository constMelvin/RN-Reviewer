import type { BookSubTopics } from '@/@types/books'
import { BOOKS_KEY } from '@/constant/queryKeys'
import { api } from '@/utils/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'

type TResponse = BookSubTopics[]
type TInput = {
  topic_id: string
  topics: string
  deadline: string
  links: string
}

type UInput = {
  subtopic_id: string
  status: string | null
}

export function useCreateSubTopics() {
  const queryClient = useQueryClient()

  return useMutation<TResponse, Error, TInput>({
    mutationFn: async (topics: TInput) => {
      try {
        // const res = await client.api.v1['sub-topics'][
        //   'create-sub-topics'
        // ].$post({ json: topics })

        // return await res.json()

        const res = await api.post("/v1/sub-topics", topics);
        return res.data;
      } catch (error: any) {
        throw error.response?.data?.message || 'Something went wrong'
      }
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: BOOKS_KEY }),
  })
}

export function useUpdateSubTopics() {
  const queryClient = useQueryClient()

  return useMutation<TResponse, Error, UInput>({
    mutationFn: async (updateStatus: UInput) => {
      try {
        // const res = await client.api.v1['sub-topics'][
        //   'update-sub-topics'
        // ].$patch({
        //   json: updateStatus,
        // })

        // return await res.json()

        const { data } = await api.patch("/v1/sub-topics", updateStatus);
        return data;
      } catch (error: any) {
        throw error.response?.data?.message || 'Something went wrong'
      }
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: BOOKS_KEY }),
  })
}
