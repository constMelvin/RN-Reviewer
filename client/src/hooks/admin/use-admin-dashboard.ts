import { useQuery } from '@tanstack/react-query'
import { api } from '@/utils/api'

export function useAdminDashboardStats() {
  return useQuery({
    queryKey: ['admin', 'dashboard', 'stats'],
    queryFn: async () => {
      const { data } = await api.get('/v1/admin/dashboard/stats')
      return data
    },
    refetchInterval: 30_000,
  })
}

export function useAdminActivityChart(days: number = 7) {
  return useQuery({
    queryKey: ['admin', 'dashboard', 'activity', days],
    queryFn: async () => {
      const { data } = await api.get(`/v1/admin/dashboard/activity?days=${days}`)
      return data as Array<{
        date: string
        registrations: number
        logins: number
        scoreSubmissions: number
      }>
    },
    refetchInterval: 60_000,
  })
}

export function useAdminRecentActivity(limit: number = 15) {
  return useQuery({
    queryKey: ['admin', 'dashboard', 'recent', limit],
    queryFn: async () => {
      const { data } = await api.get(`/v1/admin/dashboard/recent?limit=${limit}`)
      return data as Array<{
        id: string
        action: string
        entity_type: string | null
        ip_address: string | null
        method: string | null
        path: string | null
        status_code: number | null
        created_at: string
        user_id: string | null
        userName: string | null
        userEmail: string | null
      }>
    },
    refetchInterval: 5_000,
  })
}

export function useAdminUserGrowth(days: number = 30) {
  return useQuery({
    queryKey: ['admin', 'dashboard', 'growth', days],
    queryFn: async () => {
      const { data } = await api.get(`/v1/admin/dashboard/growth?days=${days}`)
      return data as Array<{ date: string; count: number }>
    },
    refetchInterval: 60_000,
  })
}
