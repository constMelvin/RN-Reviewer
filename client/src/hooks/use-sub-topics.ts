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

type UDetailsInput = {
  subtopic_id: string
  topics?: string
  deadline?: string
  links?: string
}

type DInput = {
  subtopic_id: string
}

export function useCreateSubTopics() {
  const queryClient = useQueryClient()

  return useMutation<TResponse, Error, TInput>({
    mutationFn: async (topics: TInput) => {
      try {
        const res = await api.post('/v1/sub-topics/create-sub-topics', topics)
        return res.data
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
        const { data } = await api.patch(
          '/v1/sub-topics/update-sub-topics',
          updateStatus,
        )
        return data
      } catch (error: any) {
        throw error.response?.data?.message || 'Something went wrong'
      }
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: BOOKS_KEY }),
  })
}

export function useUpdateSubTopicsDetails() {
  const queryClient = useQueryClient()

  return useMutation<TResponse, Error, UDetailsInput>({
    mutationFn: async (input: UDetailsInput) => {
      try {
        const { data } = await api.patch(
          '/v1/sub-topics/update-sub-topics-details',
          input,
        )
        return data
      } catch (error: any) {
        throw error.response?.data?.message || 'Something went wrong'
      }
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: BOOKS_KEY }),
  })
}

export function useDeleteSubTopics() {
  const queryClient = useQueryClient()

  return useMutation<TResponse, Error, DInput>({
    mutationFn: async (input: DInput) => {
      try {
        const { data } = await api.delete('/v1/sub-topics/delete-sub-topics', {
          data: input,
        })
        return data
      } catch (error: any) {
        throw error.response?.data?.message || 'Something went wrong'
      }
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: BOOKS_KEY }),
  })
}

