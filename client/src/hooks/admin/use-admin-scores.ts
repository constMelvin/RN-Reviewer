import { useQuery } from '@tanstack/react-query'
import { api } from '@/utils/api'

export type ScoreOverview = {
  totalScores: number
  avgPercent: number
  passRate: number
  passingCount: number
  failingCount: number
  studentsWithScores: number
  totalStudents: number
}

export type ScoreRecord = {
  scoreId: string
  examType: string
  subject: string
  score: number
  scoreTotal: number
  percent: number
  userId: string
  userName: string
  userEmail: string
  userUsername: string | null
  userRole: string | null
}

export type ExamTypeStats = {
  examType: string
  count: number
  avgPercent: number
  passRate: number
}

export type SubjectStats = {
  subject: string
  count: number
  avgPercent: number
}

export type StudentScoreSummary = {
  userId: string
  userName: string
  userEmail: string
  userUsername: string | null
  scoreCount: number
  avgPercent: number
  lowestPercent?: number
  highestPercent?: number
}

export type RecentScoreSubmission = {
  id: string
  userId: string | null
  userName: string | null
  userEmail: string | null
  metadata: Record<string, unknown> | null
  createdAt: string
}

export function useScoreOverview() {
  return useQuery({
    queryKey: ['admin', 'scores', 'overview'],
    queryFn: async () => {
      const { data } = await api.get('/v1/admin/scores/overview')
      return data as ScoreOverview
    },
    refetchInterval: 30_000,
  })
}

export function useAdminScoresList(
  page: number,
  limit: number,
  search?: string,
  examType?: string,
  minPercent?: number,
  maxPercent?: number,
) {
  return useQuery({
    queryKey: ['admin', 'scores', 'list', page, limit, search, examType, minPercent, maxPercent],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      })
      if (search) params.set('search', search)
      if (examType) params.set('examType', examType)
      if (minPercent !== undefined) params.set('minPercent', String(minPercent))
      if (maxPercent !== undefined) params.set('maxPercent', String(maxPercent))

      const { data } = await api.get(`/v1/admin/scores/list?${params}`)
      return data as {
        scores: ScoreRecord[]
        total: number
        page: number
        limit: number
        totalPages: number
      }
    },
    refetchInterval: 30_000,
  })
}

export function useScoresByExamType() {
  return useQuery({
    queryKey: ['admin', 'scores', 'by-exam-type'],
    queryFn: async () => {
      const { data } = await api.get('/v1/admin/scores/by-exam-type')
      return data as ExamTypeStats[]
    },
    refetchInterval: 60_000,
  })
}

export function useScoresBySubject() {
  return useQuery({
    queryKey: ['admin', 'scores', 'by-subject'],
    queryFn: async () => {
      const { data } = await api.get('/v1/admin/scores/by-subject')
      return data as SubjectStats[]
    },
    refetchInterval: 60_000,
  })
}

export function useAtRiskStudents() {
  return useQuery({
    queryKey: ['admin', 'scores', 'at-risk'],
    queryFn: async () => {
      const { data } = await api.get('/v1/admin/scores/at-risk?limit=10')
      return data as StudentScoreSummary[]
    },
    refetchInterval: 60_000,
  })
}

export function useScoreLeaderboard() {
  return useQuery({
    queryKey: ['admin', 'scores', 'leaderboard'],
    queryFn: async () => {
      const { data } = await api.get('/v1/admin/scores/leaderboard?limit=10')
      return data as StudentScoreSummary[]
    },
    refetchInterval: 60_000,
  })
}

export function useRecentScoreSubmissions() {
  return useQuery({
    queryKey: ['admin', 'scores', 'recent'],
    queryFn: async () => {
      const { data } = await api.get('/v1/admin/scores/recent?limit=15')
      return data as RecentScoreSubmission[]
    },
    refetchInterval: 30_000,
  })
}

export function useExamTypes() {
  return useQuery({
    queryKey: ['admin', 'scores', 'exam-types'],
    queryFn: async () => {
      const { data } = await api.get('/v1/admin/scores/exam-types')
      return data as string[]
    },
    staleTime: 60_000,
  })
}
