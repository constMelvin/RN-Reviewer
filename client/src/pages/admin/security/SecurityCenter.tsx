import React, { useState } from 'react'
import {
  ShieldCheck, AlertTriangle, AlertCircle, Info, Shield,
  CheckCircle2, Search, RefreshCw, ChevronLeft, ChevronRight,
} from 'lucide-react'
import {
  useSecurityEvents, useActiveAlerts, useResolveSecurityEvent,
  useRunSecurityScan,
} from '@/hooks/admin/use-admin-security'
import AdminLayout from '../layout/AdminLayout'

function Card({ className = '', children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={`rounded-2xl border border-slate-200/70 bg-white/80 shadow-sm backdrop-blur-sm transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-900/60 ${className}`}>
      {children}
    </div>
  )
}

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

const severityConfig: Record<string, { icon: typeof AlertTriangle; bg: string; text: string; badge: string }> = {
  critical: {
    icon: AlertTriangle,
    bg: 'bg-rose-50 dark:bg-rose-500/10',
    text: 'text-rose-500',
    badge: 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400',
  },
  warning: {
    icon: AlertCircle,
    bg: 'bg-amber-50 dark:bg-amber-500/10',
    text: 'text-amber-500',
    badge: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400',
  },
  info: {
    icon: Info,
    bg: 'bg-blue-50 dark:bg-blue-500/10',
    text: 'text-blue-500',
    badge: 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400',
  },
}

export default function SecurityCenter() {
  const [page, setPage] = useState(1)
  const [severityFilter, setSeverityFilter] = useState('')
  const [showResolved, setShowResolved] = useState(false)

  const { data: eventsData } = useSecurityEvents(
    page, 20,
    severityFilter || undefined,
    showResolved ? undefined : false
  )
  const { data: alertsData } = useActiveAlerts()
  const resolveEvent = useResolveSecurityEvent()
  const runScan = useRunSecurityScan()

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold" style={{ fontFamily: '"Lexend", "Inter", sans-serif' }}>
              Security Center
            </h2>
            <p className="text-sm text-slate-400">
              Monitor security events, threats, and platform safety
            </p>
          </div>
          <button
            onClick={() => runScan.mutate()}
            disabled={runScan.isPending}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            <RefreshCw size={15} className={runScan.isPending ? 'animate-spin' : ''} />
            Run Security Scan
          </button>
        </div>

        {/* Alert summary */}
        {alertsData && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              { severity: 'critical', label: 'Critical', color: 'rose' },
              { severity: 'warning', label: 'Warnings', color: 'amber' },
              { severity: 'info', label: 'Info', color: 'blue' },
            ].map(({ severity, label, color }) => (
              <Card key={severity} className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`grid h-10 w-10 place-items-center rounded-xl bg-${color}-50 text-${color}-600 dark:bg-${color}-500/10 dark:text-${color}-400`}>
                    {severity === 'critical' ? <AlertTriangle size={20} /> :
                     severity === 'warning' ? <AlertCircle size={20} /> :
                     <Info size={20} />}
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">{label}</p>
                    <p className="text-2xl font-semibold" style={{ fontFamily: '"Lexend", "Inter", sans-serif' }}>
                      {alertsData.counts[severity] || 0}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Active Alerts */}
        {alertsData && alertsData.alerts.length > 0 && (
          <Card className="p-4 sm:p-6">
            <div className="mb-4 flex items-center gap-2">
              <ShieldCheck size={18} className="text-rose-500" />
              <h3 className="text-sm font-semibold">Active Alerts ({alertsData.alerts.length})</h3>
            </div>
            <ul className="space-y-2.5">
              {alertsData.alerts.slice(0, 5).map((alert) => {
                const config = severityConfig[alert.severity] || severityConfig.info
                const Icon = config.icon
                return (
                  <li key={alert.id} className="flex items-center gap-3 rounded-xl border border-slate-100 px-3 py-2.5 dark:border-slate-800">
                    <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg ${config.bg} ${config.text}`}>
                      <Icon size={14} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm">{alert.details || alert.event_type.replace(/_/g, ' ')}</p>
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <span>{timeAgo(alert.created_at)}</span>
                        {alert.source_ip && <span>· IP: {alert.source_ip}</span>}
                        {alert.userName && <span>· User: {alert.userName}</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.badge}`}>
                        {alert.severity}
                      </span>
                      <button
                        onClick={() => resolveEvent.mutate(alert.id)}
                        className="rounded-lg p-1.5 text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10"
                        title="Resolve"
                      >
                        <CheckCircle2 size={15} />
                      </button>
                    </div>
                  </li>
                )
              })}
            </ul>
          </Card>
        )}

        {/* Filters */}
        <Card className="p-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex gap-1 rounded-xl border border-slate-200 p-1 dark:border-slate-800">
              {['', 'critical', 'warning', 'info'].map((s) => (
                <button
                  key={s}
                  onClick={() => { setSeverityFilter(s); setPage(1) }}
                  className={`rounded-lg px-3 py-1 text-xs font-medium transition-colors ${
                    severityFilter === s
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                  }`}
                >
                  {s || 'All'}
                </button>
              ))}
            </div>
            <label className="flex items-center gap-2 text-sm text-slate-400">
              <input
                type="checkbox"
                checked={showResolved}
                onChange={(e) => setShowResolved(e.target.checked)}
                className="rounded border-slate-300"
              />
              Show resolved
            </label>
          </div>
        </Card>

        {/* Events list */}
        <Card className="p-4 sm:p-6">
          <h3 className="mb-4 text-sm font-semibold">Security Events</h3>
          {!eventsData || eventsData.events.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400">
              <Shield size={32} className="mb-3 opacity-50" />
              <p className="text-sm">No security events found</p>
              <p className="mt-1 text-xs">Run a security scan to detect potential threats</p>
            </div>
          ) : (
            <>
              <ul className="space-y-2">
                {eventsData.events.map((evt) => {
                  const config = severityConfig[evt.severity] || severityConfig.info
                  const Icon = config.icon
                  return (
                    <li key={evt.id} className="flex items-center gap-3 rounded-xl border border-slate-100 px-3 py-2.5 dark:border-slate-800">
                      <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg ${config.bg} ${config.text}`}>
                        <Icon size={14} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium">{evt.event_type.replace(/_/g, ' ')}</p>
                        <p className="text-xs text-slate-400">{evt.details}</p>
                        <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                          <span>{timeAgo(evt.created_at)}</span>
                          {evt.source_ip && <span>· {evt.source_ip}</span>}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {evt.resolved ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                            <CheckCircle2 size={12} /> Resolved
                          </span>
                        ) : (
                          <button
                            onClick={() => resolveEvent.mutate(evt.id)}
                            className="rounded-lg border border-slate-200 px-2 py-1 text-xs font-medium text-slate-500 hover:bg-slate-100 dark:border-slate-800 dark:hover:bg-slate-800/60"
                          >
                            Resolve
                          </button>
                        )}
                      </div>
                    </li>
                  )
                })}
              </ul>

              {eventsData.totalPages > 1 && (
                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
                  <span className="text-xs text-slate-400">
                    Page {eventsData.page} of {eventsData.totalPages}
                  </span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page <= 1}
                      className="rounded-lg border border-slate-200 p-1.5 text-slate-500 hover:bg-slate-100 disabled:opacity-40 dark:border-slate-800"
                    >
                      <ChevronLeft size={15} />
                    </button>
                    <button
                      onClick={() => setPage((p) => Math.min(eventsData.totalPages, p + 1))}
                      disabled={page >= eventsData.totalPages}
                      className="rounded-lg border border-slate-200 p-1.5 text-slate-500 hover:bg-slate-100 disabled:opacity-40 dark:border-slate-800"
                    >
                      <ChevronRight size={15} />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </Card>
      </div>
    </AdminLayout>
  )
}
