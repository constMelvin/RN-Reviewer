import React, { useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  LineChart, Line,
} from 'recharts'
import {
  GraduationCap, Trophy, AlertTriangle, Target, Search,
  ChevronLeft, ChevronRight, TrendingUp, ClipboardList, Users,
  CheckCircle2, XCircle,
} from 'lucide-react'
import {
  useScoreOverview,
  useAdminScoresList,
  useScoresByExamType,
  useScoresBySubject,
  useAtRiskStudents,
  useScoreLeaderboard,
  useRecentScoreSubmissions,
  useExamTypes,
} from '@/hooks/admin/use-admin-scores'
import AdminLayout from '../layout/AdminLayout'

function Card({ className = '', children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={`rounded-2xl border border-slate-200/70 bg-white/80 shadow-sm backdrop-blur-sm transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-900/60 ${className}`}>
      {children}
    </div>
  )
}

function Badge({ tone = 'slate', children }: { tone?: string; children: React.ReactNode }) {
  const tones: Record<string, string> = {
    slate: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
    emerald: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',
    blue: 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400',
    amber: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400',
    rose: 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400',
  }
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${tones[tone] || tones.slate}`}>
      {children}
    </span>
  )
}

function PercentBadge({ percent }: { percent: number }) {
  const tone = percent >= 75 ? 'emerald' : percent >= 60 ? 'amber' : 'rose'
  return <Badge tone={tone}>{percent}%</Badge>
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

export default function ScoreMonitoring() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [examFilter, setExamFilter] = useState('')
  const [showFailingOnly, setShowFailingOnly] = useState(false)

  const { data: overview, isLoading: overviewLoading } = useScoreOverview()
  const { data: scoresData, isLoading: scoresLoading } = useAdminScoresList(
    page,
    15,
    search || undefined,
    examFilter || undefined,
    undefined,
    showFailingOnly ? 74 : undefined,
  )
  const { data: byExamType } = useScoresByExamType()
  const { data: bySubject } = useScoresBySubject()
  const { data: atRisk } = useAtRiskStudents()
  const { data: leaderboard } = useScoreLeaderboard()
  const { data: recent } = useRecentScoreSubmissions()
  const { data: examTypes } = useExamTypes()

  const kpiCards = [
    { label: 'Total Scores', value: overview?.totalScores ?? '—', icon: ClipboardList, iconClass: 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400' },
    { label: 'Avg. Readiness', value: overviewLoading ? '—' : `${overview?.avgPercent ?? 0}%`, icon: Target, iconClass: 'bg-teal-50 text-teal-600 dark:bg-teal-500/10 dark:text-teal-400' },
    { label: 'Pass Rate', value: overviewLoading ? '—' : `${overview?.passRate ?? 0}%`, icon: CheckCircle2, iconClass: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' },
    { label: 'At-Risk Scores', value: overview?.failingCount ?? '—', icon: AlertTriangle, iconClass: 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400' },
  ]

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setSearch(searchInput)
    setPage(1)
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold" style={{ fontFamily: '"Lexend", "Inter", sans-serif' }}>
            Score Monitoring
          </h2>
          <p className="text-sm text-slate-400">
            Track student exam performance, readiness scores, and at-risk learners
          </p>
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {kpiCards.map(({ label, value, icon: Icon, iconClass }) => (
            <Card key={label} className="p-4">
              <div className="flex items-center gap-3">
                <div className={`grid h-10 w-10 place-items-center rounded-xl ${iconClass}`}>
                  <Icon size={20} />
                </div>
                <div>
                  <p className="text-xs text-slate-400">{label}</p>
                  <p className="text-xl font-semibold" style={{ fontFamily: '"Lexend", "Inter", sans-serif' }}>
                    {value}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4 text-sm text-slate-500 dark:text-slate-400 lg:grid-cols-3">
          <Card className="p-4 lg:col-span-1">
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
              <Users size={16} />
              <span className="font-medium">Student coverage</span>
            </div>
            <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">
              {overview?.studentsWithScores ?? 0}
              <span className="text-sm font-normal text-slate-400">
                {' '}/ {overview?.totalStudents ?? 0} students
              </span>
            </p>
            <p className="mt-1 text-xs">Students who have submitted at least one score</p>
          </Card>
          <Card className="p-4 lg:col-span-2">
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
              <TrendingUp size={16} />
              <span className="font-medium">Passing vs failing entries</span>
            </div>
            <div className="mt-3 flex gap-6">
              <div>
                <p className="text-2xl font-semibold text-emerald-600 dark:text-emerald-400">
                  {overview?.passingCount ?? 0}
                </p>
                <p className="text-xs text-slate-400">≥ 75% (passing)</p>
              </div>
              <div>
                <p className="text-2xl font-semibold text-rose-600 dark:text-rose-400">
                  {overview?.failingCount ?? 0}
                </p>
                <p className="text-xs text-slate-400">&lt; 75% (needs review)</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <Card className="p-5">
            <h3 className="mb-4 text-sm font-semibold text-slate-700 dark:text-slate-200">
              Average score by exam type
            </h3>
            {byExamType && byExamType.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={byExamType} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-800" />
                  <XAxis dataKey="examType" tick={{ fontSize: 10 }} interval={0} angle={-20} textAnchor="end" height={60} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ borderRadius: 12, border: 'none', fontSize: 12 }}
                    formatter={(v: number) => [`${v}%`, 'Avg']}
                  />
                  <Bar dataKey="avgPercent" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="py-12 text-center text-sm text-slate-400">No score data yet</p>
            )}
          </Card>

          <Card className="p-5">
            <h3 className="mb-4 text-sm font-semibold text-slate-700 dark:text-slate-200">
              Top subjects by submission count
            </h3>
            {bySubject && bySubject.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={bySubject.slice(0, 8)} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-800" />
                  <XAxis dataKey="subject" tick={{ fontSize: 10 }} interval={0} angle={-20} textAnchor="end" height={60} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: 'none', fontSize: 12 }} />
                  <Line type="monotone" dataKey="avgPercent" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="py-12 text-center text-sm text-slate-400">No subject data yet</p>
            )}
          </Card>
        </div>

        {/* At-risk + Leaderboard */}
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <Card className="p-5">
            <div className="mb-4 flex items-center gap-2">
              <AlertTriangle size={16} className="text-rose-500" />
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                At-risk students (avg &lt; 75%)
              </h3>
            </div>
            {!atRisk?.length ? (
              <p className="py-8 text-center text-sm text-slate-400">No at-risk students found</p>
            ) : (
              <div className="space-y-2">
                {atRisk.map((s) => (
                  <div
                    key={s.userId}
                    className="flex items-center justify-between rounded-xl border border-slate-100 px-3 py-2.5 dark:border-slate-800"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{s.userName}</p>
                      <p className="truncate text-xs text-slate-400">{s.userEmail}</p>
                    </div>
                    <div className="text-right shrink-0 ml-3">
                      <PercentBadge percent={s.avgPercent} />
                      <p className="mt-0.5 text-[10px] text-slate-400">{s.scoreCount} scores</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card className="p-5">
            <div className="mb-4 flex items-center gap-2">
              <Trophy size={16} className="text-amber-500" />
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                Top performers
              </h3>
            </div>
            {!leaderboard?.length ? (
              <p className="py-8 text-center text-sm text-slate-400">No leaderboard data yet</p>
            ) : (
              <div className="space-y-2">
                {leaderboard.map((s, i) => (
                  <div
                    key={s.userId}
                    className="flex items-center justify-between rounded-xl border border-slate-100 px-3 py-2.5 dark:border-slate-800"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-amber-50 text-xs font-bold text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">
                        {i + 1}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{s.userName}</p>
                        <p className="truncate text-xs text-slate-400">{s.scoreCount} scores</p>
                      </div>
                    </div>
                    <PercentBadge percent={s.avgPercent} />
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Recent submissions */}
        <Card className="p-5">
          <div className="mb-4 flex items-center gap-2">
            <GraduationCap size={16} className="text-blue-500" />
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Recent score submissions
            </h3>
          </div>
          {!recent?.length ? (
            <p className="py-6 text-center text-sm text-slate-400">
              No recent submissions logged yet
            </p>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {recent.map((r) => (
                <div key={r.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                  <div>
                    <p className="text-sm font-medium">{r.userName ?? 'Unknown user'}</p>
                    <p className="text-xs text-slate-400">{r.userEmail}</p>
                  </div>
                  <span className="text-xs text-slate-400">{timeAgo(r.createdAt)}</span>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* All scores table */}
        <Card className="p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              All score records
            </h3>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => { setShowFailingOnly((v) => !v); setPage(1) }}
                className={`rounded-xl border px-3 py-1.5 text-xs transition-colors ${
                  showFailingOnly
                    ? 'border-rose-300 bg-rose-50 text-rose-700 dark:border-rose-800 dark:bg-rose-500/10 dark:text-rose-400'
                    : 'border-slate-200 text-slate-500 hover:bg-slate-100 dark:border-slate-800 dark:hover:bg-slate-800/60'
                }`}
              >
                <XCircle size={12} className="mr-1 inline" />
                Failing only
              </button>
              <select
                value={examFilter}
                onChange={(e) => { setExamFilter(e.target.value); setPage(1) }}
                className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs dark:border-slate-800 dark:bg-slate-900"
              >
                <option value="">All exam types</option>
                {examTypes?.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              <form onSubmit={handleSearch} className="flex gap-2">
                <div className="relative">
                  <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Search student or subject..."
                    className="rounded-xl border border-slate-200 bg-white py-1.5 pl-8 pr-3 text-xs dark:border-slate-800 dark:bg-slate-900"
                  />
                </div>
                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
                >
                  Search
                </button>
              </form>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-xs text-slate-400 dark:border-slate-800">
                  <th className="pb-3 pr-4 font-medium">Student</th>
                  <th className="pb-3 pr-4 font-medium">Exam</th>
                  <th className="pb-3 pr-4 font-medium">Subject</th>
                  <th className="pb-3 pr-4 font-medium">Score</th>
                  <th className="pb-3 font-medium">%</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800/60">
                {scoresLoading ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-400">Loading...</td>
                  </tr>
                ) : !scoresData?.scores.length ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-400">No scores found</td>
                  </tr>
                ) : (
                  scoresData.scores.map((s) => (
                    <tr key={s.scoreId} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                      <td className="py-3 pr-4">
                        <p className="font-medium">{s.userName}</p>
                        <p className="text-xs text-slate-400">{s.userEmail}</p>
                      </td>
                      <td className="py-3 pr-4 text-slate-600 dark:text-slate-300">{s.examType}</td>
                      <td className="py-3 pr-4 text-slate-600 dark:text-slate-300">{s.subject}</td>
                      <td className="py-3 pr-4 tabular-nums">
                        {s.score}/{s.scoreTotal}
                      </td>
                      <td className="py-3">
                        <PercentBadge percent={s.percent} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {scoresData && scoresData.totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
              <p className="text-xs text-slate-400">
                Page {scoresData.page} of {scoresData.totalPages} · {scoresData.total} total
              </p>
              <div className="flex gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="rounded-lg border border-slate-200 p-1.5 disabled:opacity-40 dark:border-slate-800"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  disabled={page >= scoresData.totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="rounded-lg border border-slate-200 p-1.5 disabled:opacity-40 dark:border-slate-800"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </AdminLayout>
  )
}
