import React from 'react'
import { Link } from '@tanstack/react-router'
import {
  Bell,
  AlertTriangle,
  AlertCircle,
  Info,
  ShieldCheck,
  Server,
  GraduationCap,
  Check,
  ExternalLink,
  CheckCheck,
} from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  useAdminNotifications,
  type AdminNotification,
  type NotificationSeverity,
} from '@/hooks/admin/use-admin-notifications'

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const s = Math.floor(diff / 1000)
  if (s < 60) return 'Just now'
  const m = Math.floor(s / 60)
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

const severityStyles: Record<
  NotificationSeverity,
  { icon: typeof AlertTriangle; dot: string; bg: string }
> = {
  critical: {
    icon: AlertTriangle,
    dot: 'bg-rose-500',
    bg: 'bg-rose-50 dark:bg-rose-500/10',
  },
  warning: {
    icon: AlertCircle,
    dot: 'bg-amber-500',
    bg: 'bg-amber-50 dark:bg-amber-500/10',
  },
  info: {
    icon: Info,
    dot: 'bg-blue-500',
    bg: 'bg-blue-50 dark:bg-blue-500/10',
  },
}

const typeIcons = {
  security: ShieldCheck,
  health: Server,
  scores: GraduationCap,
}

function NotificationItem({
  notification,
  onMarkRead,
  onResolve,
  onView,
  isResolving,
}: {
  notification: AdminNotification
  onMarkRead: (n: AdminNotification) => void
  onResolve: (n: AdminNotification) => void
  onView: (n: AdminNotification) => void
  isResolving: boolean
}) {
  const style = severityStyles[notification.severity]
  const SeverityIcon = style.icon
  const TypeIcon = typeIcons[notification.type]

  return (
    <div className="flex gap-3 rounded-xl border border-slate-100 p-3 dark:border-slate-800">
      <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${style.bg}`}>
        <SeverityIcon size={16} className="text-slate-600 dark:text-slate-300" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-medium leading-tight">{notification.title}</p>
          <span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${style.dot}`} />
        </div>
        <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400 line-clamp-2">
          {notification.message}
        </p>
        <div className="mt-2 flex items-center justify-between gap-2">
          <span className="flex items-center gap-1 text-[10px] text-slate-400">
            <TypeIcon size={10} />
            {timeAgo(notification.createdAt)}
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onMarkRead(notification)}
              className="rounded-lg px-2 py-1 text-[10px] font-medium text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
              title="Mark as read"
            >
              Read
            </button>
            {notification.dismissible && notification.eventId && (
              <button
                type="button"
                disabled={isResolving}
                onClick={() => onResolve(notification)}
                className="rounded-lg px-2 py-1 text-[10px] font-medium text-emerald-600 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-500/10 disabled:opacity-50"
                title="Resolve security event"
              >
                <Check size={12} className="inline" />
              </button>
            )}
            <Link
              to={notification.href}
              onClick={() => onView(notification)}
              className="flex items-center gap-1 rounded-lg px-2 py-1 text-[10px] font-medium text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-500/10"
            >
              View
              <ExternalLink size={10} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AdminNotifications() {
  const {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
    viewNotification,
    resolveNotification,
    isResolving,
  } = useAdminNotifications()

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="relative rounded-xl border border-slate-200 p-2 text-slate-500 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800/60"
          aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}
        >
          <Bell size={18} />
          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 grid min-h-4 min-w-4 place-items-center rounded-full bg-rose-500 px-1 text-[10px] font-semibold text-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="w-[min(100vw-2rem,380px)] rounded-2xl border-slate-200 bg-white p-0 shadow-xl dark:border-slate-800 dark:bg-[#0c1322]"
      >
        <div className="border-b border-slate-100 px-4 py-3 dark:border-slate-800">
          <div className="flex items-center justify-between gap-2">
            <h3
              className="text-sm font-semibold"
              style={{ fontFamily: '"Lexend", "Inter", sans-serif' }}
            >
              Notifications
            </h3>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <>
                  <span className="rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-medium text-rose-600 dark:bg-rose-500/10 dark:text-rose-400">
                    {unreadCount} unread
                  </span>
                  <button
                    type="button"
                    onClick={markAllAsRead}
                    className="flex items-center gap-1 rounded-lg px-2 py-1 text-[10px] font-medium text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-500/10"
                  >
                    <CheckCheck size={12} />
                    Mark all read
                  </button>
                </>
              )}
            </div>
          </div>
          <p className="mt-0.5 text-xs text-slate-400">
            Security alerts, system health, and student score warnings
          </p>
        </div>

        <div className="max-h-[min(60vh,400px)] overflow-y-auto p-3 space-y-2">
          {isLoading ? (
            <div className="space-y-2 py-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-20 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800"
                />
              ))}
            </div>
          ) : notifications.length === 0 ? (
            <div className="py-10 text-center">
              <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full bg-emerald-50 dark:bg-emerald-500/10">
                <Check size={20} className="text-emerald-500" />
              </div>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                All clear
              </p>
              <p className="mt-1 text-xs text-slate-400">
                No unread notifications
              </p>
            </div>
          ) : (
            notifications.map((n) => (
              <NotificationItem
                key={n.id}
                notification={n}
                onMarkRead={(item) => markAsRead(item.id)}
                onResolve={resolveNotification}
                onView={viewNotification}
                isResolving={isResolving}
              />
            ))
          )}
        </div>

        {notifications.length > 0 && (
          <div className="border-t border-slate-100 p-2 dark:border-slate-800">
            <Link
              to="/super-admin/security"
              onClick={() => notifications.forEach((n) => markAsRead(n.id))}
              className="block rounded-xl py-2 text-center text-xs font-medium text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-500/10"
            >
              Open Security Center
            </Link>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
