import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/utils/api'

export type SecurityEvent = {
  id: string
  event_type: string
  severity: string
  source_ip: string | null
  user_id: string | null
  details: string | null
  resolved: boolean
  resolved_by: string | null
  resolved_at: string | null
  created_at: string
  userName: string | null
}

export type AuditLog = {
  id: string
  user_id: string | null
  action: string
  entity_type: string | null
  entity_id: string | null
  metadata: any
  ip_address: string | null
  user_agent: string | null
  method: string | null
  path: string | null
  status_code: number | null
  created_at: string
  userName: string | null
  userEmail: string | null
}

export function useSecurityEvents(
  page: number = 1,
  limit: number = 20,
  severity?: string,
  resolved?: boolean
) {
  return useQuery({
    queryKey: ['admin', 'security', 'events', page, limit, severity, resolved],
    queryFn: async () => {
      const params = new URLSearchParams()
      params.set('page', page.toString())
      params.set('limit', limit.toString())
      if (severity) params.set('severity', severity)
      if (resolved !== undefined) params.set('resolved', String(resolved))

      const { data } = await api.get(`/v1/admin/security/events?${params}`)
      return data as {
        events: SecurityEvent[]
        total: number
        page: number
        limit: number
        totalPages: number
      }
    },
    refetchInterval: 30_000,
  })
}

export function useActiveAlerts() {
  return useQuery({
    queryKey: ['admin', 'security', 'alerts'],
    queryFn: async () => {
      const { data } = await api.get('/v1/admin/security/alerts')
      return data as {
        alerts: SecurityEvent[]
        counts: Record<string, number>
      }
    },
    refetchInterval: 15_000,
  })
}

export function useResolveSecurityEvent() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (eventId: string) => {
      const { data } = await api.patch(`/v1/admin/security/events/${eventId}/resolve`)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'security'] })
    },
  })
}

export function useAuditLogs(
  page: number = 1,
  limit: number = 30,
  filters?: {
    userId?: string
    action?: string
    startDate?: string
    endDate?: string
  }
) {
  return useQuery({
    queryKey: ['admin', 'security', 'audit-logs', page, limit, filters],
    queryFn: async () => {
      const params = new URLSearchParams()
      params.set('page', page.toString())
      params.set('limit', limit.toString())
      if (filters?.userId) params.set('userId', filters.userId)
      if (filters?.action) params.set('action', filters.action)
      if (filters?.startDate) params.set('startDate', filters.startDate)
      if (filters?.endDate) params.set('endDate', filters.endDate)

      const { data } = await api.get(`/v1/admin/security/audit-logs?${params}`)
      return data as {
        logs: AuditLog[]
        total: number
        page: number
        limit: number
        totalPages: number
      }
    },
    refetchInterval: 15_000,
  })
}

export function useRunSecurityScan() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async () => {
      const { data } = await api.post('/v1/admin/security/scan')
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'security'] })
    },
  })
}
