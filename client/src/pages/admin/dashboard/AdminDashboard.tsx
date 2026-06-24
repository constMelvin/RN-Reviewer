import React, { useState } from 'react'
import {
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import {
  Users, Activity, TrendingUp, TrendingDown, AlertTriangle,
  AlertCircle, Info, CheckCircle2, ArrowUpRight, BookOpen,
  CreditCard, FolderTree, UserCog, Zap, Clock,
} from 'lucide-react'
import {
  useAdminDashboardStats,
  useAdminActivityChart,
  useAdminRecentActivity,
} from '@/hooks/admin/use-admin-dashboard'
import { useSystemHealth } from '@/hooks/admin/use-admin-monitoring'
import { useActiveAlerts } from '@/hooks/admin/use-admin-security'
import AdminLayout from '../layout/AdminLayout'

/* ── Reusable sub-components ── */

function Card({ className = '', children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={`rounded-2xl border border-slate-200/70 bg-white/80 shadow-sm backdrop-blur-sm transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-900/60 ${className}`}>
      {children}
    </div>
  )
}

function SectionHeading({ eyebrow, title, action }: { eyebrow?: string; title: string; action?: React.ReactNode }) {
  return (
    <div className="mb-4 flex items-end justify-between">
      <div>
        {eyebrow && (
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600/70 dark:text-blue-400/70"
            style={{ fontFamily: '"Lexend", "Inter", sans-serif' }}
          >
            {eyebrow}
          </p>
        )}
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white"
          style={{ fontFamily: '"Lexend", "Inter", sans-serif' }}
        >
          {title}
        </h2>
      </div>
      {action}
    </div>
  )
}

function Badge({ tone = 'slate', children }: { tone?: 'slate' | 'emerald' | 'teal' | 'blue' | 'amber' | 'rose'; children: React.ReactNode }) {
  const tones: Record<string, string> = {
    slate: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
    emerald: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',
    teal: 'bg-teal-50 text-teal-700 dark:bg-teal-500/10 dark:text-teal-400',
    blue: 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400',
    amber: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400',
    rose: 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400',
  }
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${tones[tone]}`}>
      {children}
    </span>
  )
}

function Sparkline({ data, color }: { data: { x: number; y: number }[]; color: string }) {
  return (
    <ResponsiveContainer width="100%" height={36}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id={`grad-${color}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.35} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area type="monotone" dataKey="y" stroke={color} fill={`url(#grad-${color})`} strokeWidth={2} dot={false} />
      </AreaChart>
    </ResponsiveContainer>
  )
}

function formatNumber(n: number): string {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M'
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'K'
  return n.toLocaleString()
}

function formatUptime(seconds: number): string {
  const d = Math.floor(seconds / 86400)
  const h = Math.floor((seconds % 86400) / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  if (d > 0) return `${d}d ${h}h`
  if (h > 0) return `${h}h ${m}m`
  return `${m}m`
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

const actionIcons: Record<string, typeof BookOpen> = {
  LOGIN: UserCog,
  LOGOUT: UserCog,
  REGISTER: Users,
  CREATE_BOOK: BookOpen,
  UPDATE_BOOK: BookOpen,
  DELETE_BOOK: BookOpen,
  CREATE_TOPIC: FolderTree,
  UPDATE_TOPIC: FolderTree,
  SUBMIT_SCORE: CheckCircle2,
  CREATE_TASK: Activity,
  UPDATE_TASK: Activity,
  CREATE_AGENDA: Clock,
}

const actionTones: Record<string, string> = {
  LOGIN: 'bg-blue-600',
  LOGOUT: 'bg-slate-500',
  REGISTER: 'bg-emerald-500',
  CREATE_BOOK: 'bg-teal-500',
  SUBMIT_SCORE: 'bg-emerald-500',
  DELETE_BOOK: 'bg-rose-500',
  CREATE_TASK: 'bg-blue-600',
}

const sparkline = (seed: number): { x: number; y: number }[] =>
  Array.from({ length: 12 }, (_, i) => ({
    x: i,
    y: 40 + Math.round(Math.sin(i / 1.3 + seed) * 18 + (i % 3 === 0 ? seed * 2 : 0)),
  }))

/* ── Main Dashboard ── */

export default function AdminDashboard() {
  const [range, setRange] = useState<'7' | '30' | '90'>('7')
  const { data: stats, isLoading: statsLoading } = useAdminDashboardStats()
  const { data: activity } = useAdminActivityChart(parseInt(range))
  const { data: recentFeed } = useAdminRecentActivity(10)
  const { data: health } = useSystemHealth()
  const { data: alertsData } = useActiveAlerts()

  const kpis = [
    {
      label: 'Total Users',
      value: stats ? formatNumber(stats.totalUsers) : '—',
      trend: stats ? `+${stats.newUsersToday} today` : '',
      up: true,
      icon: Users,
      spark: sparkline(1),
      color: '#2563eb',
    },
    {
      label: 'Active Sessions',
      value: stats ? formatNumber(stats.activeSessions) : '—',
      trend: 'Live',
      up: true,
      icon: Activity,
      spark: sparkline(2),
      color: '#0d9488',
    },
    {
      label: 'Avg. Score',
      value: stats ? `${stats.avgReadinessScore}%` : '—',
      trend: 'Readiness',
      up: (stats?.avgReadinessScore ?? 0) >= 70,
      icon: Zap,
      spark: sparkline(3),
      color: '#10b981',
    },
    {
      label: 'Total Scores',
      value: stats ? formatNumber(stats.totalScores) : '—',
      trend: `${stats?.totalBooks ?? 0} books`,
      up: true,
      icon: CheckCircle2,
      spark: sparkline(4),
      color: '#8b5cf6',
    },
  ]

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Alert Banner */}
        {alertsData && alertsData.alerts.length > 0 && (
          <div className="rounded-xl border border-amber-200 bg-amber-50/80 px-4 py-3 dark:border-amber-900/50 dark:bg-amber-500/10">
            <div className="flex items-center gap-2 text-sm font-medium text-amber-700 dark:text-amber-400">
              <AlertTriangle size={16} />
              {alertsData.alerts.length} active security alert{alertsData.alerts.length > 1 ? 's' : ''} —{' '}
              <span className="font-normal text-amber-600 dark:text-amber-300">
                {alertsData.alerts[0]?.details}
              </span>
            </div>
          </div>
        )}

        {/* KPI Cards */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {kpis.map(({ label, value, trend, up, icon: Icon, spark, color }) => (
            <Card key={label} className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-400">{label}</p>
                  <p className="mt-1 text-2xl font-semibold" style={{ fontFamily: '"Lexend", "Inter", sans-serif' }}>
                    {statsLoading ? (
                      <span className="inline-block h-7 w-20 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
                    ) : value}
                  </p>
                </div>
                <div
                  className="grid h-9 w-9 place-items-center rounded-xl"
                  style={{ backgroundColor: `${color}1a`, color }}
                >
                  <Icon size={18} />
                </div>
              </div>
              <div className="mt-2 flex items-center gap-1 text-xs font-medium">
                {up ? (
                  <TrendingUp size={13} className="text-emerald-500" />
                ) : (
                  <TrendingDown size={13} className="text-rose-500" />
                )}
                <span className={up ? 'text-emerald-500' : 'text-rose-500'}>{trend}</span>
              </div>
              <div className="mt-1 -ml-1 -mr-1">
                <Sparkline data={spark} color={color} />
              </div>
            </Card>
          ))}
        </section>

        {/* System Health Strip */}
        {health && (
          <section>
            <Card className="px-4 py-3">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <span className={`relative flex h-2.5 w-2.5`}>
                    <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${
                      health.overall === 'healthy' ? 'bg-emerald-400' : health.overall === 'degraded' ? 'bg-amber-400' : 'bg-rose-400'
                    }`} />
                    <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${
                      health.overall === 'healthy' ? 'bg-emerald-500' : health.overall === 'degraded' ? 'bg-amber-500' : 'bg-rose-500'
                    }`} />
                  </span>
                  System {health.overall === 'healthy' ? 'Healthy' : health.overall === 'degraded' ? 'Degraded' : 'Down'}
                </div>
                <div className="flex flex-wrap gap-3">
                  {health.checks.map((c) => (
                    <Badge
                      key={c.service}
                      tone={c.status === 'healthy' ? 'emerald' : c.status === 'degraded' ? 'amber' : 'rose'}
                    >
                      {c.service}: {c.status}
                      {c.latencyMs !== undefined && ` (${c.latencyMs}ms)`}
                    </Badge>
                  ))}
                </div>
              </div>
            </Card>
          </section>
        )}

        {/* Platform Activity Chart */}
        <section>
          <Card className="p-4 sm:p-6">
            <SectionHeading
              eyebrow="Analytics"
              title="Platform Activity"
              action={
                <div className="flex gap-1 rounded-xl border border-slate-200 p-1 dark:border-slate-800">
                  {(['7', '30', '90'] as const).map((r) => (
                    <button
                      key={r}
                      onClick={() => setRange(r)}
                      className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
                        range === r
                          ? 'bg-blue-600 text-white'
                          : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                      }`}
                    >
                      {r}D
                    </button>
                  ))}
                </div>
              }
            />
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={activity || []}>
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false}
                  tickFormatter={(v: string) => {
                    const d = new Date(v)
                    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                  }}
                />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="registrations" name="Registrations" stroke="#2563eb" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="logins" name="Logins" stroke="#0d9488" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="scoreSubmissions" name="Score Submissions" stroke="#10b981" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </section>

        {/* Live Feed + Role Breakdown */}
        <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* Live Feed */}
          <Card className="flex flex-col p-4 sm:p-6 lg:col-span-2">
            <SectionHeading eyebrow="Realtime" title="Live Activity Feed" />
            {(!recentFeed || recentFeed.length === 0) ? (
              <div className="flex flex-1 items-center justify-center py-8 text-sm text-slate-400">
                No recent activity yet. Actions will appear here in real-time.
              </div>
            ) : (
              <ul className="space-y-3">
                {recentFeed.map((entry) => {
                  const Icon = actionIcons[entry.action] || Activity
                  const bgClass = actionTones[entry.action] || 'bg-blue-600'
                  return (
                    <li key={entry.id} className="flex items-start gap-3">
                      <div className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-white ${bgClass}`}>
                        <Icon size={14} />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm">
                          <span className="font-medium">{entry.userName || 'System'}</span>{' '}
                          <span className="text-slate-400">{entry.action.replace(/_/g, ' ').toLowerCase()}</span>
                        </p>
                        <p className="text-xs text-slate-400">{timeAgo(entry.created_at)}</p>
                      </div>
                    </li>
                  )
                })}
              </ul>
            )}
            <div className="mt-auto flex items-center gap-1.5 pt-4 text-xs text-emerald-500">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              Polling live updates every 5s
            </div>
          </Card>

          {/* Role Breakdown */}
          <Card className="p-4 sm:p-6">
            <SectionHeading eyebrow="Directory" title="User Roles" />
            {stats?.roleBreakdown && (
              <div className="space-y-3">
                {Object.entries(stats.roleBreakdown).map(([role, count]) => (
                  <div
                    key={role}
                    className="flex items-center justify-between rounded-xl border border-slate-100 px-3 py-2.5 dark:border-slate-800"
                  >
                    <div className="flex items-center gap-2">
                      <span className={`h-2.5 w-2.5 rounded-full ${
                        role === 'super_admin' ? 'bg-rose-500' : role === 'admin' ? 'bg-amber-400' : 'bg-emerald-500'
                      }`} />
                      <span className="text-sm font-medium capitalize">{role.replace(/_/g, ' ')}</span>
                    </div>
                    <span className="text-sm font-semibold" style={{ fontFamily: '"Lexend", "Inter", sans-serif' }}>
                      {formatNumber(count as number)}
                    </span>
                  </div>
                ))}
              </div>
            )}
            {stats && (
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-slate-100 p-3 dark:border-slate-800">
                  <p className="text-xs text-slate-400">Books</p>
                  <p className="mt-1 text-lg font-semibold" style={{ fontFamily: '"Lexend", "Inter", sans-serif' }}>
                    {formatNumber(stats.totalBooks)}
                  </p>
                </div>
                <div className="rounded-xl border border-slate-100 p-3 dark:border-slate-800">
                  <p className="text-xs text-slate-400">Tasks</p>
                  <p className="mt-1 text-lg font-semibold" style={{ fontFamily: '"Lexend", "Inter", sans-serif' }}>
                    {formatNumber(stats.totalTasks)}
                  </p>
                </div>
              </div>
            )}
          </Card>
        </section>
      </div>
    </AdminLayout>
  )
}
