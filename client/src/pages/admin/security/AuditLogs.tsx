import React, { useState } from 'react'
import {
  ClipboardList, Search, ChevronLeft, ChevronRight, Filter,
  Clock, Globe, Monitor as MonitorIcon,
} from 'lucide-react'
import { useAuditLogs, type AuditLog } from '@/hooks/admin/use-admin-security'
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

const actionColors: Record<string, string> = {
  LOGIN: 'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400',
  LOGOUT: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
  REGISTER: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400',
  CREATE_BOOK: 'bg-teal-100 text-teal-700 dark:bg-teal-500/15 dark:text-teal-400',
  CREATE_TOPIC: 'bg-teal-100 text-teal-700 dark:bg-teal-500/15 dark:text-teal-400',
  SUBMIT_SCORE: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400',
  DELETE_BOOK: 'bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-400',
  DELETE_TOPIC: 'bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-400',
  FAILED_LOGIN: 'bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-400',
  UPDATE_THEME: 'bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-400',
}

const statusColors: Record<string, string> = {
  '2': 'text-emerald-500',
  '3': 'text-blue-500',
  '4': 'text-amber-500',
  '5': 'text-rose-500',
}

function getStatusColor(code: number | null): string {
  if (!code) return 'text-slate-400'
  return statusColors[String(code)[0]] || 'text-slate-400'
}

const allActions = [
  'LOGIN', 'LOGOUT', 'REGISTER', 'CREATE_BOOK', 'UPDATE_BOOK', 'DELETE_BOOK',
  'CREATE_TOPIC', 'UPDATE_TOPIC', 'DELETE_TOPIC', 'CREATE_SUBTOPIC',
  'SUBMIT_SCORE', 'DELETE_SCORE', 'CREATE_TASK', 'UPDATE_TASK', 'DELETE_TASK',
  'CREATE_AGENDA', 'UPDATE_AGENDA', 'UPDATE_THEME',
]

export default function AuditLogsPage() {
  const [page, setPage] = useState(1)
  const [actionFilter, setActionFilter] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const { data: logsData, isLoading } = useAuditLogs(page, 30, {
    action: actionFilter || undefined,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
  })

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold" style={{ fontFamily: '"Lexend", "Inter", sans-serif' }}>
              Audit Logs
            </h2>
            <p className="text-sm text-slate-400">
              Complete activity log across all users · {logsData?.total ?? 0} total entries
            </p>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-sm transition-colors ${
              showFilters
                ? 'border-blue-300 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-500/10 dark:text-blue-400'
                : 'border-slate-200 text-slate-500 hover:bg-slate-100 dark:border-slate-800 dark:hover:bg-slate-800/60'
            }`}
          >
            <Filter size={15} />
            Filters
          </button>
        </div>

        {/* Filters */}
        {showFilters && (
          <Card className="p-4">
            <div className="flex flex-wrap items-end gap-3">
              <div>
                <label className="mb-1 block text-xs text-slate-400">Action</label>
                <select
                  value={actionFilter}
                  onChange={(e) => { setActionFilter(e.target.value); setPage(1) }}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
                >
                  <option value="">All Actions</option>
                  {allActions.map((a) => (
                    <option key={a} value={a}>{a.replace(/_/g, ' ')}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs text-slate-400">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => { setStartDate(e.target.value); setPage(1) }}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-slate-400">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => { setEndDate(e.target.value); setPage(1) }}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
                />
              </div>
              <button
                onClick={() => {
                  setActionFilter('')
                  setStartDate('')
                  setEndDate('')
                  setPage(1)
                }}
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-500 hover:bg-slate-100 dark:border-slate-800 dark:hover:bg-slate-800/60"
              >
                Clear
              </button>
            </div>
          </Card>
        )}

        {/* Log entries */}
        <Card className="p-4 sm:p-6">
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-16 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />
              ))}
            </div>
          ) : !logsData || logsData.logs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400">
              <ClipboardList size={32} className="mb-3 opacity-50" />
              <p className="text-sm">No audit logs found</p>
              <p className="mt-1 text-xs">Logs will appear as users perform actions on the platform</p>
            </div>
          ) : (
            <>
              <div className="space-y-2 overflow-y-auto pr-2 max-h-[380px]">
                {logsData.logs.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-start gap-3 rounded-xl border border-slate-100 px-4 py-3 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/30"
                  >
                    {/* Action badge */}
                    <span className={`inline-flex shrink-0 items-center rounded-lg px-2 py-1 text-[10px] font-semibold uppercase tracking-wide ${actionColors[log.action] || 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'}`}>
                      {log.action.replace(/_/g, ' ')}
                    </span>

                    {/* Details */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{log.userName || 'System'}</span>
                        {log.userEmail && (
                          <span className="text-xs text-slate-400">{log.userEmail}</span>
                        )}
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                          <Clock size={11} />
                          {timeAgo(log.created_at)}
                        </span>
                        {log.ip_address && (
                          <span className="flex items-center gap-1">
                            <Globe size={11} />
                            {log.ip_address}
                          </span>
                        )}
                        {log.method && log.path && (
                          <span className="font-mono">
                            <span className={getStatusColor(log.status_code)}>
                              {log.status_code}
                            </span>{' '}
                            {log.method} {log.path}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Timestamp */}
                    <span className="shrink-0 text-xs text-slate-400">
                      {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {logsData.totalPages > 1 && (
                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
                  <span className="text-xs text-slate-400">
                    Page {logsData.page} of {logsData.totalPages} ({logsData.total} entries)
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
                      onClick={() => setPage((p) => Math.min(logsData.totalPages, p + 1))}
                      disabled={page >= logsData.totalPages}
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
