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

type UInput = {
  topic_id: string
  topics?: string
  deadline?: string
  links?: string
}

type DInput = {
  topic_id: string
}

export function useCreateTopics() {
  const queryClient = useQueryClient()

  return useMutation<TResponse, Error, TInput>({
    mutationFn: async (topics: TInput) => {
      try {
        const { data } = await api.post("/v1/topic/create-topics", topics);
        return data;
      } catch (error: any) {
        throw error.response?.data?.message || 'Something went wrong'
      }
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: BOOKS_KEY }),
  })
}

export function useUpdateTopics() {
  const queryClient = useQueryClient()

  return useMutation<TResponse, Error, UInput>({
    mutationFn: async (input: UInput) => {
      try {
        const { data } = await api.patch("/v1/topic/update-topics", input);
        return data;
      } catch (error: any) {
        throw error.response?.data?.message || 'Something went wrong'
      }
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: BOOKS_KEY }),
  })
}

export function useDeleteTopics() {
  const queryClient = useQueryClient()

  return useMutation<TResponse, Error, DInput>({
    mutationFn: async (input: DInput) => {
      try {
        const { data } = await api.delete("/v1/topic/delete-topics", { data: input });
        return data;
      } catch (error: any) {
        throw error.response?.data?.message || 'Something went wrong'
      }
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: BOOKS_KEY }),
  })
}
