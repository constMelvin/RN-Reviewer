import { useCallback, useMemo, useState } from 'react'
import { useActiveAlerts, useResolveSecurityEvent } from '@/hooks/admin/use-admin-security'
import { useSystemHealth } from '@/hooks/admin/use-admin-monitoring'
import { useAtRiskStudents, useScoreOverview } from '@/hooks/admin/use-admin-scores'

const READ_STORAGE_KEY = 'admin-notifications-read'

export type NotificationSeverity = 'critical' | 'warning' | 'info'

export type AdminNotification = {
  id: string
  type: 'security' | 'health' | 'scores'
  title: string
  message: string
  severity: NotificationSeverity
  createdAt: string
  href: string
  eventId?: string
  dismissible: boolean
}

function loadReadIds(): Set<string> {
  if (typeof window === 'undefined') return new Set()
  try {
    const raw = localStorage.getItem(READ_STORAGE_KEY)
    if (!raw) return new Set()
    return new Set(JSON.parse(raw) as string[])
  } catch {
    return new Set()
  }
}

function saveReadIds(ids: Set<string>) {
  localStorage.setItem(READ_STORAGE_KEY, JSON.stringify([...ids]))
}

export function useAdminNotifications() {
  const [readIds, setReadIds] = useState<Set<string>>(loadReadIds)
  const { data: alertsData, isLoading: alertsLoading } = useActiveAlerts()
  const { data: health } = useSystemHealth()
  const { data: atRisk } = useAtRiskStudents()
  const { data: scoreOverview } = useScoreOverview()
  const resolveEvent = useResolveSecurityEvent()

  const notifications = useMemo(() => {
    const items: AdminNotification[] = []

    alertsData?.alerts.forEach((alert) => {
      items.push({
        id: `security-${alert.id}`,
        type: 'security',
        title: alert.event_type.replace(/_/g, ' '),
        message: alert.details || `Security event from ${alert.source_ip || 'unknown IP'}`,
        severity:
          alert.severity === 'critical'
            ? 'critical'
            : alert.severity === 'warning'
              ? 'warning'
              : 'info',
        createdAt: alert.created_at,
        href: '/super-admin/security',
        eventId: alert.id,
        dismissible: true,
      })
    })

    if (health && health.overall !== 'healthy') {
      const degraded = health.checks.filter((c) => c.status !== 'healthy')
      const healthKey = degraded.map((c) => c.service).sort().join(',')
      items.push({
        id: `health-${health.overall}-${healthKey}`,
        type: 'health',
        title: health.overall === 'down' ? 'System down' : 'System degraded',
        message: degraded.map((c) => `${c.service}: ${c.details}`).join(' · '),
        severity: health.overall === 'down' ? 'critical' : 'warning',
        createdAt: health.timestamp,
        href: '/super-admin/monitoring',
        dismissible: true,
      })
    }

    if (atRisk && atRisk.length > 0) {
      items.push({
        id: `scores-at-risk-${atRisk.length}-${atRisk.map((s) => s.userId).sort().join(',')}`,
        type: 'scores',
        title: `${atRisk.length} at-risk student${atRisk.length > 1 ? 's' : ''}`,
        message: `Students averaging below 75%: ${atRisk
          .slice(0, 3)
          .map((s) => s.userName)
          .join(', ')}${atRisk.length > 3 ? '…' : ''}`,
        severity: 'warning',
        createdAt: new Date().toISOString(),
        href: '/super-admin/scores',
        dismissible: true,
      })
    }

    if (scoreOverview && scoreOverview.failingCount > 0) {
      items.push({
        id: `scores-failing-${scoreOverview.failingCount}-${scoreOverview.passRate}`,
        type: 'scores',
        title: `${scoreOverview.failingCount} failing score entries`,
        message: `${scoreOverview.passRate}% pass rate across ${scoreOverview.totalScores} submissions`,
        severity: scoreOverview.passRate < 50 ? 'critical' : 'info',
        createdAt: new Date().toISOString(),
        href: '/super-admin/scores',
        dismissible: true,
      })
    }

    return items.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
  }, [alertsData, health, atRisk, scoreOverview])

  const unreadNotifications = useMemo(
    () => notifications.filter((n) => !readIds.has(n.id)),
    [notifications, readIds],
  )

  const unreadCount = unreadNotifications.length

  const markAsRead = useCallback((id: string) => {
    setReadIds((prev) => {
      const next = new Set(prev)
      next.add(id)
      saveReadIds(next)
      return next
    })
  }, [])

  const markAllAsRead = useCallback(() => {
    setReadIds((prev) => {
      const next = new Set(prev)
      notifications.forEach((n) => next.add(n.id))
      saveReadIds(next)
      return next
    })
  }, [notifications])

  const resolveNotification = async (notification: AdminNotification) => {
    markAsRead(notification.id)
    if (notification.eventId) {
      await resolveEvent.mutateAsync(notification.eventId)
    }
  }

  const viewNotification = (notification: AdminNotification) => {
    markAsRead(notification.id)
  }

  return {
    notifications: unreadNotifications,
    unreadCount,
    isLoading: alertsLoading,
    markAsRead,
    markAllAsRead,
    viewNotification,
    resolveNotification,
    isResolving: resolveEvent.isPending,
  }
}
