import type { CreateScoreInput } from '@/@types/score'
import { SCORE_KEY } from '@/constant/queryKeys'
import { api } from '@/utils/api'
// import { api } from '@/lib/api'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { sileo } from 'sileo'

export type ScoreItem = {
  score_id: string
  score: number
  score_total: number
  user_id: string
  subject: string
  exam_type: string
}

type TContext = {
  previousScore: ScoreItem[]
}

export function useScore() {
  return useQuery<ScoreItem[], Error>({
    queryKey: SCORE_KEY,
    queryFn: async () => {
      const { data } = await api.get('/v1/score')
      return data
    },
  })
}

export function useCreateScore() {
  const queryClient = useQueryClient()
  return useMutation<ScoreItem, Error, CreateScoreInput, TContext>({
    mutationFn: async (createScore: CreateScoreInput) => {
      const { data } = await api.post('/v1/score', createScore)
      return data
    },
    onMutate: async (createScore: CreateScoreInput) => {
      await queryClient.cancelQueries({ queryKey: SCORE_KEY })
      const previousScore =
        queryClient.getQueryData<ScoreItem[]>(SCORE_KEY) || []

      queryClient.setQueryData<ScoreItem[]>(SCORE_KEY, [
        ...previousScore,
        {
          score_id: Date.now().toString(),
          score: createScore.score,
          score_total: createScore.score_total,
          user_id: 'Tempp',
          subject: createScore.subject,
          exam_type: createScore.exam_type,
        },
      ])
      return { previousScore }
    },
    onError(_err, _title, context) {
      queryClient.setQueryData(SCORE_KEY, context?.previousScore)
      sileo.error({
        description: _err.message,
      })
    },
    onSuccess: (data) =>
      sileo.success({
        description: `Score on ${data.exam_type}, Subject: ${data.subject} `,
        title: 'Add a Score to Tracker',
      }),
    onSettled: () => queryClient.invalidateQueries({ queryKey: SCORE_KEY }),
  })
}

export function useEditScore() {
  const queryClient = useQueryClient()
  return useMutation<ScoreItem, Error, Partial<ScoreItem>, TContext>({
    mutationFn: async (editScore: Partial<ScoreItem>) => {
      const { data } = await api.put('/v1/score', editScore)
      return data
    },
    onMutate: async (editScore: Partial<ScoreItem>) => {
      await queryClient.cancelQueries({ queryKey: SCORE_KEY })
      const previousScore =
        queryClient.getQueryData<ScoreItem[]>(SCORE_KEY) || []

      queryClient.setQueryData<ScoreItem[]>(SCORE_KEY, (old) =>
        old?.map((s) => (s.score_id === editScore.score_id ? { ...s, ...editScore } : s))
      )
      return { previousScore }
    },
    onError(_err, _title, context) {
      queryClient.setQueryData(SCORE_KEY, context?.previousScore)
      sileo.error({
        description: _err.message,
      })
    },
    onSuccess: (data) =>
      sileo.success({
        description: `Score updated on ${data.exam_type}, Subject: ${data.subject} `,
        title: 'Score Updated',
      }),
    onSettled: () => queryClient.invalidateQueries({ queryKey: SCORE_KEY }),
  })
}

export function useDeleteScore() {
  const queryClient = useQueryClient()
  return useMutation<ScoreItem, Error, string, TContext>({
    mutationFn: async (score_id: string) => {
      const { data } = await api.delete(`/v1/score/${score_id}`)
      return data
    },
    onMutate: async (score_id: string) => {
      await queryClient.cancelQueries({ queryKey: SCORE_KEY })
      const previousScore =
        queryClient.getQueryData<ScoreItem[]>(SCORE_KEY) || []

      queryClient.setQueryData<ScoreItem[]>(SCORE_KEY, (old) =>
        old?.filter((s) => s.score_id !== score_id)
      )
      return { previousScore }
    },
    onError(_err, _title, context) {
      queryClient.setQueryData(SCORE_KEY, context?.previousScore)
      sileo.error({
        description: _err.message,
      })
    },
    onSuccess: () =>
      sileo.success({
        description: 'Score deleted successfully',
        title: 'Score Deleted',
      }),
    onSettled: () => queryClient.invalidateQueries({ queryKey: SCORE_KEY }),
  })
}
