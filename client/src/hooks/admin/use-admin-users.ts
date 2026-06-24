import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/utils/api'

export type AdminUser = {
  id: string
  name: string
  email: string
  username: string | null
  displayUsername: string | null
  image: string | null
  role: string | null
  emailVerified: boolean
  themeColor: string | null
  createdAt: string
  updatedAt: string
}

export type UserDetailData = AdminUser & {
  sessions: Array<{
    id: string
    createdAt: string
    expiresAt: string
    ipAddress: string | null
    userAgent: string | null
  }>
  stats: {
    scores: number
    books: number
    tasks: number
    avgScorePercent: number
  }
  recentScores: Array<{
    scoreId: string
    examType: string
    subject: string
    score: number
    scoreTotal: number
    percent: number
  }>
  recentActivity: Array<{
    id: string
    action: string
    entity_type: string | null
    created_at: string
    ip_address: string | null
  }>
}

export function useAdminUsers(
  page: number = 1,
  limit: number = 20,
  search?: string,
  role?: string
) {
  return useQuery({
    queryKey: ['admin', 'users', page, limit, search, role],
    queryFn: async () => {
      const params = new URLSearchParams()
      params.set('page', page.toString())
      params.set('limit', limit.toString())
      if (search) params.set('search', search)
      if (role) params.set('role', role)

      const { data } = await api.get(`/v1/admin/users?${params}`)
      return data as {
        users: AdminUser[]
        total: number
        page: number
        limit: number
        totalPages: number
      }
    },
    refetchInterval: 30_000,
  })
}

export function useAdminUserDetail(userId: string | null) {
  return useQuery({
    queryKey: ['admin', 'users', userId],
    queryFn: async () => {
      if (!userId) return null
      const { data } = await api.get(`/v1/admin/users/${userId}`)
      return data as UserDetailData
    },
    enabled: !!userId,
  })
}

export function useAdminOnlineUsers() {
  return useQuery({
    queryKey: ['admin', 'users', 'online'],
    queryFn: async () => {
      const { data } = await api.get('/v1/admin/users/online')
      return data as Array<{
        sessionId: string
        userId: string
        createdAt: string
        expiresAt: string
        ipAddress: string | null
        userAgent: string | null
        userName: string
        userEmail: string
        userRole: string | null
        userImage: string | null
      }>
    },
    refetchInterval: 10_000,
  })
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: string }) => {
      const { data } = await api.patch(`/v1/admin/users/${userId}/role`, { role })
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] })
    },
  })
}

export function useDeleteUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (userId: string) => {
      const { data } = await api.delete(`/v1/admin/users/${userId}`)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] })
    },
  })
}
