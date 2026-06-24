import { useQuery } from '@tanstack/react-query'
import { api } from '@/utils/api'

export type ServerMetrics = {
  cpu: { usage: number; cores: number; model: string }
  memory: { used: number; total: number; percentage: number }
  heap: { used: number; total: number; percentage: number }
  uptime: { process: number; system: number }
  platform: { os: string; arch: string; hostname: string; nodeVersion: string }
}

export type DatabaseMetrics = {
  pool: { totalCount: number; idleCount: number; waitingCount: number }
  database: { size: string; sizeBytes: number }
  connections: { active: number; total: number }
  tables: Array<{
    name: string
    rowCount: number
    size: string
    sizeBytes: number
  }>
  uptime: string
}

export type SystemHealth = {
  overall: 'healthy' | 'degraded' | 'down'
  checks: Array<{
    service: string
    status: 'healthy' | 'degraded' | 'down'
    details: string
    latencyMs?: number
  }>
  timestamp: string
}

export type MetricsSnapshot = {
  id: string
  cpu_usage: number
  memory_usage: number
  memory_total: number
  heap_used: number
  heap_total: number
  active_connections: number
  requests_per_minute: number
  avg_response_time_ms: number
  error_count: number
  uptime_seconds: number
  db_pool_size: number
  db_pool_available: number
  created_at: string
}

export function useServerMetrics() {
  return useQuery({
    queryKey: ['admin', 'monitoring', 'server'],
    queryFn: async () => {
      const { data } = await api.get('/v1/admin/monitoring/server')
      return data as ServerMetrics
    },
    refetchInterval: 10_000,
  })
}

export function useDatabaseMetrics() {
  return useQuery({
    queryKey: ['admin', 'monitoring', 'database'],
    queryFn: async () => {
      const { data } = await api.get('/v1/admin/monitoring/database')
      return data as DatabaseMetrics
    },
    refetchInterval: 15_000,
  })
}

export function useTrafficMetrics(hours: number = 24) {
  return useQuery({
    queryKey: ['admin', 'monitoring', 'traffic', hours],
    queryFn: async () => {
      const { data } = await api.get(`/v1/admin/monitoring/traffic?hours=${hours}`)
      return data as MetricsSnapshot[]
    },
    refetchInterval: 30_000,
  })
}

export function useSystemHealth() {
  return useQuery({
    queryKey: ['admin', 'monitoring', 'health'],
    queryFn: async () => {
      const { data } = await api.get('/v1/admin/monitoring/health')
      return data as SystemHealth
    },
    refetchInterval: 15_000,
  })
}
