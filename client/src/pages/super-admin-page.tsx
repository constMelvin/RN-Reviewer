import React, { useState, type ReactNode } from 'react'
import { signOut } from '@/lib/auth-client'
import { useNavigate } from '@tanstack/react-router'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  UserCog,
  ShieldCheck,
  BookOpen,
  FolderTree,
  FileSpreadsheet,
  CalendarClock,
  BarChart3,
  LineChart as LineChartIcon,
  CreditCard,
  Banknote,
  Bell,
  Activity,
  ClipboardList,
  Settings,
  Search,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle2,
  Server,
  Database,
  Cloud,
  Mail,
  Cpu,
  MemoryStick,
  Gauge,
  ArrowUpRight,
  Stethoscope,
  Trophy,
  Sparkles,
  LogOut,
  Menu,
  X,
} from 'lucide-react'
import { router } from '@/main'

interface SparklineProps {
  data: { x: number; y: number }[]
  color: string
}
interface ReadinessPulseProps {
  value?: number
}
interface BadgeProps {
  tone?: 'slate' | 'emerald' | 'teal' | 'blue' | 'amber' | 'rose'
  children: ReactNode
}
interface CardProps {
  className?: string
  children: ReactNode
}
interface SectionHeadingProps {
  eyebrow?: string
  title: string
  action?: ReactNode
}
interface ActivityData {
  day: string
  registrations: number
  logins: number
  attempts: number
}

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, active: true },
  { label: 'User Management', icon: Users },
  { label: 'Students', icon: GraduationCap },
  { label: 'Instructors', icon: UserCog },
  { label: 'Admins', icon: ShieldCheck },
  { label: 'Question Bank', icon: BookOpen },
  { label: 'Categories', icon: FolderTree },
  { label: 'Exams', icon: FileSpreadsheet },
  { label: 'Exam Schedules', icon: CalendarClock },
  { label: 'Exam Analytics', icon: BarChart3 },
  { label: 'Student Analytics', icon: LineChartIcon },
  { label: 'Subscriptions', icon: CreditCard },
  { label: 'Revenue', icon: Banknote },
  { label: 'Notifications', icon: Bell },
  { label: 'Audit Logs', icon: ClipboardList },
  { label: 'System Monitoring', icon: Activity },
  { label: 'Settings', icon: Settings },
]

const activityData: ActivityData[] = [
  { day: 'Mon', registrations: 120, logins: 860, attempts: 410 },
  { day: 'Tue', registrations: 145, logins: 910, attempts: 460 },
  { day: 'Wed', registrations: 132, logins: 880, attempts: 430 },
  { day: 'Thu', registrations: 168, logins: 1020, attempts: 510 },
  { day: 'Fri', registrations: 190, logins: 1110, attempts: 540 },
  { day: 'Sat', registrations: 210, logins: 1240, attempts: 610 },
  { day: 'Sun', registrations: 175, logins: 980, attempts: 470 },
]

const revenueData = [
  { month: 'Jan', revenue: 78000, mrr: 64000 },
  { month: 'Feb', revenue: 84000, mrr: 69000 },
  { month: 'Mar', revenue: 91000, mrr: 75000 },
  { month: 'Apr', revenue: 99500, mrr: 82000 },
  { month: 'May', revenue: 112000, mrr: 91500 },
  { month: 'Jun', revenue: 125400, mrr: 101200 },
]

const readinessData = [
  { name: 'NCLEX Ready', value: 621, color: '#10b981' },
  { name: 'Moderate Risk', value: 542, color: '#f59e0b' },
  { name: 'High Risk', value: 183, color: '#f43f5e' },
]

const failedTopics = [
  { topic: 'Pharmacology', score: 62 },
  { topic: 'Maternal Nursing', score: 55 },
  { topic: 'Mental Health', score: 51 },
]

const masteredTopics = [
  { topic: 'Fundamentals', score: 89 },
  { topic: 'Pediatrics', score: 84 },
  { topic: 'Infection Control', score: 82 },
]

const sparkline = (seed: number): { x: number; y: number }[] =>
  Array.from({ length: 12 }, (_, i) => ({
    x: i,
    y:
      40 +
      Math.round(Math.sin(i / 1.3 + seed) * 18 + (i % 3 === 0 ? seed * 2 : 0)),
  }))

const kpis = [
  {
    label: 'Total Users',
    value: '15,240',
    trend: '+250 today',
    up: true,
    icon: Users,
    spark: sparkline(1),
    color: '#2563eb',
  },
  {
    label: 'Active Users',
    value: '1,582',
    sub: '124 currently in exams',
    trend: 'Live',
    up: true,
    icon: Activity,
    spark: sparkline(2),
    color: '#0d9488',
  },
  {
    label: 'Revenue',
    value: '₱125,400',
    trend: '+12% this month',
    up: true,
    icon: Banknote,
    spark: sparkline(3),
    color: '#10b981',
  },
  {
    label: 'Avg. Readiness Score',
    value: '74%',
    sub: 'NCLEX Readiness',
    trend: 'Improving',
    up: true,
    icon: GraduationCap,
    spark: sparkline(4),
    color: '#2563eb',
  },
]

const liveFeed = [
  {
    user: 'Maria Santos',
    action: 'started NCLEX Exam #214',
    time: 'Just now',
    icon: BookOpen,
    tone: 'blue',
  },
  {
    user: 'John Cruz',
    action: 'upgraded to Premium',
    time: '2m ago',
    icon: CreditCard,
    tone: 'emerald',
  },
  {
    user: 'Admin',
    action: 'uploaded 50 new questions',
    time: '8m ago',
    icon: FolderTree,
    tone: 'teal',
  },
  {
    user: 'Angela Reyes',
    action: 'completed an exam — scored 87%',
    time: '14m ago',
    icon: CheckCircle2,
    tone: 'emerald',
  },
  {
    user: 'System',
    action: 'approved new instructor account',
    time: '22m ago',
    icon: UserCog,
    tone: 'blue',
  },
]

const userTable = [
  { role: 'Students', count: '14,012', status: 'Healthy' },
  { role: 'Instructors', count: '186', status: 'Healthy' },
  { role: 'Admins', count: '32', status: 'Healthy' },
  { role: 'Super Admin', count: '4', status: 'Locked' },
]

const securityAlerts = [
  {
    level: 'critical',
    text: 'Multiple failed login attempts detected',
    icon: AlertTriangle,
  },
  {
    level: 'warning',
    text: 'Payment gateway retry failures rising',
    icon: AlertCircle,
  },
  {
    level: 'warning',
    text: 'Spike in Pharmacology exam failures',
    icon: AlertCircle,
  },
  {
    level: 'info',
    text: 'Database backup scheduled tonight at 2:00 AM',
    icon: Info,
  },
  { level: 'info', text: '15 inactive premium accounts flagged', icon: Info },
]

const leaderboard = [
  { rank: '🥇', name: 'Maria Santos', score: '98%' },
  { rank: '🥈', name: 'John Cruz', score: '96%' },
  { rank: '🥉', name: 'Angela Reyes', score: '95%' },
]

function ReadinessPulse({ value = 74 }: ReadinessPulseProps) {
  const points = '0,18 8,18 13,4 18,30 23,18 30,18 36,12 42,18 60,18'
  return (
    <svg viewBox="0 0 60 36" className="w-full h-8" preserveAspectRatio="none">
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-emerald-500"
      />
    </svg>
  )
}

function Sparkline({ data, color }: SparklineProps) {
  return (
    <ResponsiveContainer width="100%" height={36}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id={`grad-${color}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.35} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="y"
          stroke={color}
          fill={`url(#grad-${color})`}
          strokeWidth={2}
          dot={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

function Badge({ tone = 'slate', children }: BadgeProps) {
  const tones = {
    slate: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
    emerald:
      'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',
    teal: 'bg-teal-50 text-teal-700 dark:bg-teal-500/10 dark:text-teal-400',
    blue: 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400',
    amber:
      'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400',
    rose: 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400',
  }
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${tones[tone]}`}
    >
      {children}
    </span>
  )
}

function Card({ className = '', children }: CardProps) {
  return (
    <div
      className={`rounded-2xl border border-slate-200/70 bg-white/80 shadow-sm backdrop-blur-sm transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-900/60 ${className}`}
    >
      {children}
    </div>
  )
}

function SectionHeading({ eyebrow, title, action }: SectionHeadingProps) {
  return (
    <div className="mb-4 flex items-end justify-between">
      <div>
        {eyebrow && (
          <p className="font-display text-xs font-semibold uppercase tracking-[0.18em] text-blue-600/70 dark:text-blue-400/70">
            {eyebrow}
          </p>
        )}
        <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white">
          {title}
        </h2>
      </div>
      {action}
    </div>
  )
}

// Extracted sidebar content so it's shared between desktop and mobile drawer
function SidebarContent({
  onNavClick,
  handleLogout,
}: {
  onNavClick?: () => void
  handleLogout: () => void
}) {
  return (
    <>
      {/* Logo */}
      <div className="mb-6 flex items-center gap-2 px-2 shrink-0">
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-blue-600 to-teal-500 text-white shadow-sm">
          <Stethoscope size={18} />
        </div>
        <div className="font-display">
          <p className="text-sm font-semibold leading-tight">RN Reviewer</p>
          <p className="text-[11px] text-slate-400">Super Admin</p>
        </div>
      </div>

      {/* Nav */}
      <nav
        className="flex-1 min-h-0 overflow-y-auto space-y-0.5 pr-1
          [scrollbar-width:thin]
          [scrollbar-color:transparent_transparent]
          hover:[scrollbar-color:theme(colors.slate.200)_transparent]
          dark:hover:[scrollbar-color:theme(colors.slate.700)_transparent]
          [&::-webkit-scrollbar]:w-[3px]
          [&::-webkit-scrollbar-track]:bg-transparent
          [&::-webkit-scrollbar-thumb]:rounded-full
          [&::-webkit-scrollbar-thumb]:bg-transparent
          hover:[&::-webkit-scrollbar-thumb]:bg-slate-200
          dark:hover:[&::-webkit-scrollbar-thumb]:bg-slate-700"
      >
        {navItems.map(({ label, icon: Icon, active }) => (
          <button
            key={label}
            onClick={onNavClick}
            className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors ${
              active
                ? 'bg-blue-600/10 font-medium text-blue-700 dark:bg-blue-500/15 dark:text-blue-400'
                : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-white'
            }`}
          >
            <span className="relative flex h-5 w-5 shrink-0 items-center justify-center">
              <Icon size={18} />
              {active && (
                <span className="absolute -left-[14px] h-5 w-1 rounded-full bg-blue-600 dark:bg-blue-400" />
              )}
            </span>
            <span className="truncate">{label}</span>
          </button>
        ))}
      </nav>

      {/* Bottom actions */}
      <div className="mt-2 flex shrink-0 flex-col gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 rounded-xl border border-rose-200 py-2 text-xs text-rose-500 hover:bg-rose-50 hover:text-rose-600 dark:border-rose-900/50 dark:text-rose-400 dark:hover:bg-rose-900/30"
        >
          <LogOut size={14} />
          <span>Logout</span>
        </button>
      </div>
    </>
  )
}

export default function SuperAdminDashboard() {
  const [dark, setDark] = useState<boolean>(false)
  const [collapsed, setCollapsed] = useState<boolean>(false)
  const [mobileOpen, setMobileOpen] = useState<boolean>(false)
  const [range, setRange] = useState<'7D' | '30D' | '90D'>('7D')
  const navigate = useNavigate()

  const handleLogout = async () => {
    await signOut()
    window.location.href = '/'
  }

  return (
    <div className={dark ? 'dark' : ''}>
      <style>{`
        .font-display { font-family: "Lexend", "Inter", sans-serif; }
        .font-sans { font-family: "Inter", system-ui, sans-serif; }
      `}</style>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Lexend:wght@500;600;700&display=swap"
        rel="stylesheet"
      />

      {/* ── Root: full viewport height, no overflow ── */}
      <div className="flex h-screen overflow-hidden bg-slate-50 font-sans text-slate-900 transition-colors dark:bg-[#0a0f1c] dark:text-slate-100">
        {/* ── Mobile backdrop ── */}
        {mobileOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/40 md:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}

        {/* ── SIDEBAR: desktop sticky + mobile fixed drawer ──
            Key classes:
            - h-full + flex flex-col → fills viewport height exactly
            - overflow-hidden on the aside itself → nothing escapes
            - nav inside gets flex-1 min-h-0 overflow-y-auto → only nav scrolls
        ── */}
        <aside
          className={[
            // layout
            'flex flex-col h-full',
            'border-r border-slate-200 bg-white/90 px-3 py-4',
            'dark:border-slate-800 dark:bg-[#0c1322]/90',
            // width
            collapsed ? 'w-[72px]' : 'w-64',
            // desktop: in normal flow
            'hidden md:flex',
            // transition for collapse
            'transition-all duration-300',
          ].join(' ')}
        >
          <SidebarContent handleLogout={handleLogout} />
        </aside>

        {/* ── MOBILE DRAWER ── */}
        <aside
          className={[
            'fixed inset-y-0 left-0 z-50 flex flex-col w-64 h-full',
            'border-r border-slate-200 bg-white/95 px-3 py-4',
            'dark:border-slate-800 dark:bg-[#0c1322]/95',
            'transition-transform duration-300 ease-in-out',
            mobileOpen ? 'translate-x-0' : '-translate-x-full',
            'md:hidden',
          ].join(' ')}
        >
          {/* Close button */}
          <button
            onClick={() => setMobileOpen(false)}
            className="absolute right-3 top-3 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
            aria-label="Close menu"
          >
            <X size={16} />
          </button>

          <SidebarContent
            onNavClick={() => setMobileOpen(false)}
            handleLogout={handleLogout}
          />
        </aside>

        {/* ── MAIN: fills remaining width, scrolls independently ── */}
        <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
          {/* HEADER — sticky within this column */}
          <header className="shrink-0 z-10 border-b border-slate-200/70 bg-white/70 px-4 py-3 backdrop-blur-md dark:border-slate-800/70 dark:bg-[#0a0f1c]/70 sm:px-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                {/* Hamburger — mobile only */}
                <button
                  onClick={() => setMobileOpen(true)}
                  className="rounded-xl border border-slate-200 p-2 text-slate-500 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800/60 md:hidden"
                  aria-label="Open menu"
                >
                  <Menu size={18} />
                </button>
                <div>
                  <h1 className="font-display text-xl font-semibold">
                    Good Evening, John
                  </h1>
                  <p className="text-sm text-slate-400">
                    RN Reviewer Platform Overview · Updated 2 min ago
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-400 dark:border-slate-800 dark:bg-slate-900 sm:flex">
                  <Search size={15} />
                  <span>Search students, exams, logs…</span>
                  <kbd className="ml-2 rounded border border-slate-200 px-1.5 text-[10px] text-slate-400 dark:border-slate-700">
                    ⌘K
                  </kbd>
                </div>
                <button className="relative rounded-xl border border-slate-200 p-2 text-slate-500 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800/60">
                  <Bell size={18} />
                  <span className="absolute -right-1 -top-1 grid h-4 w-4 place-items-center rounded-full bg-rose-500 text-[10px] font-semibold text-white">
                    5
                  </span>
                </button>
                <button
                  onClick={() => setDark((d) => !d)}
                  className="rounded-xl border border-slate-200 p-2 text-slate-500 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800/60"
                >
                  {dark ? <Sun size={18} /> : <Moon size={18} />}
                </button>
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 font-display text-sm font-semibold text-white">
                  JC
                </div>
              </div>
            </div>
          </header>

          {/* SCROLLABLE CONTENT AREA */}
          <main className="flex-1 overflow-y-auto">
            <div className="space-y-6 p-4 sm:p-6">
              {/* KPI CARDS */}
              <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {kpis.map(
                  ({
                    label,
                    value,
                    trend,
                    sub,
                    up,
                    icon: Icon,
                    spark,
                    color,
                  }) => (
                    <Card key={label} className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm text-slate-400">{label}</p>
                          <p className="font-display mt-1 text-2xl font-semibold">
                            {value}
                          </p>
                          {sub && (
                            <p className="mt-0.5 text-xs text-slate-400">
                              {sub}
                            </p>
                          )}
                        </div>
                        <div
                          className="grid h-9 w-9 place-items-center rounded-xl"
                          style={{ backgroundColor: `${color}1a`, color }}
                        >
                          <Icon size={18} />
                        </div>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <span
                          className={`flex items-center gap-1 text-xs font-medium ${up ? 'text-emerald-500' : 'text-rose-500'}`}
                        >
                          {up ? (
                            <TrendingUp size={13} />
                          ) : (
                            <TrendingDown size={13} />
                          )}
                          {trend}
                        </span>
                      </div>
                      <div className="mt-1 -ml-1 -mr-1">
                        <Sparkline data={spark} color={color} />
                      </div>
                    </Card>
                  ),
                )}
              </section>

              {/* PLATFORM ACTIVITY */}
              <section>
                <Card className="p-4 sm:p-6">
                  <SectionHeading
                    eyebrow="Analytics"
                    title="Platform Activity"
                    action={
                      <div className="flex gap-1 rounded-xl border border-slate-200 p-1 dark:border-slate-800">
                        {(['7D', '30D', '90D'] as const).map((r) => (
                          <button
                            key={r}
                            onClick={() => setRange(r)}
                            className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
                              range === r
                                ? 'bg-blue-600 text-white'
                                : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                            }`}
                          >
                            {r}
                          </button>
                        ))}
                      </div>
                    }
                  />
                  <ResponsiveContainer width="100%" height={280}>
                    <LineChart data={activityData}>
                      <XAxis
                        dataKey="day"
                        stroke="#94a3b8"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        stroke="#94a3b8"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip
                        contentStyle={{
                          borderRadius: 12,
                          border: '1px solid #e2e8f0',
                          fontSize: 12,
                        }}
                      />
                      <Legend wrapperStyle={{ fontSize: 12 }} />
                      <Line
                        type="monotone"
                        dataKey="registrations"
                        name="Registrations"
                        stroke="#2563eb"
                        strokeWidth={2}
                        dot={false}
                      />
                      <Line
                        type="monotone"
                        dataKey="logins"
                        name="Logins"
                        stroke="#0d9488"
                        strokeWidth={2}
                        dot={false}
                      />
                      <Line
                        type="monotone"
                        dataKey="attempts"
                        name="Exam Attempts"
                        stroke="#10b981"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Card>
              </section>

              {/* EXAM INTELLIGENCE */}
              <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <Card className="p-4 sm:p-6">
                  <SectionHeading
                    eyebrow="Exam Intelligence"
                    title="Most Failed Topics"
                  />
                  <div className="space-y-4">
                    {failedTopics.map(({ topic, score }) => (
                      <div key={topic}>
                        <div className="mb-1 flex items-center justify-between text-sm">
                          <span className="flex items-center gap-1.5 font-medium">
                            <AlertTriangle
                              size={14}
                              className="text-amber-500"
                            />{' '}
                            {topic}
                          </span>
                          <span className="text-slate-400">{score}%</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800">
                          <div
                            className="h-2 rounded-full bg-gradient-to-r from-amber-400 to-rose-400"
                            style={{ width: `${score}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
                <Card className="p-4 sm:p-6">
                  <SectionHeading
                    eyebrow="Exam Intelligence"
                    title="Most Mastered Topics"
                  />
                  <div className="space-y-4">
                    {masteredTopics.map(({ topic, score }) => (
                      <div key={topic}>
                        <div className="mb-1 flex items-center justify-between text-sm">
                          <span className="flex items-center gap-1.5 font-medium">
                            <CheckCircle2
                              size={14}
                              className="text-emerald-500"
                            />{' '}
                            {topic}
                          </span>
                          <span className="text-slate-400">{score}%</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800">
                          <div
                            className="h-2 rounded-full bg-gradient-to-r from-teal-400 to-emerald-500"
                            style={{ width: `${score}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </section>

              {/* STUDENT READINESS + LIVE FEED */}
              <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                <Card className="p-4 sm:p-6 lg:col-span-2">
                  <SectionHeading
                    eyebrow="Predictive"
                    title="Student Readiness Insights"
                  />
                  <div className="flex flex-col items-center gap-6 sm:flex-row">
                    <div className="relative h-44 w-44 shrink-0">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={readinessData}
                            dataKey="value"
                            innerRadius={55}
                            outerRadius={75}
                            paddingAngle={3}
                          >
                            {readinessData.map((d) => (
                              <Cell key={d.name} fill={d.color} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="font-display text-2xl font-semibold">
                          74%
                        </span>
                        <span className="text-[11px] text-slate-400">
                          Avg Readiness
                        </span>
                        <div className="mt-1 w-12 text-emerald-500">
                          <ReadinessPulse />
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 space-y-3">
                      {[
                        {
                          label: 'NCLEX Ready',
                          range: '75–100%',
                          count: '621 students',
                          color: 'bg-emerald-500',
                        },
                        {
                          label: 'Moderate Risk',
                          range: '50–74%',
                          count: '542 students',
                          color: 'bg-amber-400',
                        },
                        {
                          label: 'High Risk',
                          range: 'Below 50%',
                          count: '183 students',
                          color: 'bg-rose-500',
                        },
                      ].map((r) => (
                        <div
                          key={r.label}
                          className="flex items-center justify-between rounded-xl border border-slate-100 px-3 py-2 dark:border-slate-800"
                        >
                          <div className="flex items-center gap-2">
                            <span
                              className={`h-2.5 w-2.5 rounded-full ${r.color}`}
                            />
                            <div>
                              <p className="text-sm font-medium">{r.label}</p>
                              <p className="text-xs text-slate-400">
                                {r.range}
                              </p>
                            </div>
                          </div>
                          <span className="font-display text-sm font-semibold">
                            {r.count}
                          </span>
                        </div>
                      ))}
                      <button className="mt-1 flex w-full items-center justify-center gap-1.5 rounded-xl bg-rose-500 py-2 text-sm font-medium text-white shadow-sm transition-transform hover:scale-[1.01] hover:bg-rose-600">
                        View At-Risk Students <ArrowUpRight size={14} />
                      </button>
                    </div>
                  </div>
                </Card>

                <Card className="flex flex-col p-4 sm:p-6">
                  <SectionHeading
                    eyebrow="Realtime"
                    title="Live Activity Feed"
                  />
                  <ul className="space-y-3">
                    {liveFeed.map(
                      ({ user, action, time, icon: Icon, tone }, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <div
                            className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-white ${
                              tone === 'emerald'
                                ? 'bg-emerald-500'
                                : tone === 'teal'
                                  ? 'bg-teal-500'
                                  : 'bg-blue-600'
                            }`}
                          >
                            <Icon size={14} />
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-sm">
                              <span className="font-medium">{user}</span>{' '}
                              <span className="text-slate-400">{action}</span>
                            </p>
                            <p className="text-xs text-slate-400">{time}</p>
                          </div>
                        </li>
                      ),
                    )}
                  </ul>
                  <div className="mt-auto flex items-center gap-1.5 pt-4 text-xs text-emerald-500">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                    </span>
                    Streaming live updates
                  </div>
                </Card>
              </section>

              {/* SUBSCRIPTIONS & REVENUE */}
              <section>
                <Card className="p-4 sm:p-6">
                  <SectionHeading
                    eyebrow="Business"
                    title="Subscriptions & Revenue"
                  />
                  <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { label: 'Free Users', value: '12,540' },
                        { label: 'Monthly Premium', value: '2,100' },
                        { label: 'Annual Premium', value: '600' },
                        { label: 'Conversion Rate', value: '18%' },
                      ].map((s) => (
                        <div
                          key={s.label}
                          className="rounded-xl border border-slate-100 p-3 dark:border-slate-800"
                        >
                          <p className="text-xs text-slate-400">{s.label}</p>
                          <p className="font-display mt-1 text-lg font-semibold">
                            {s.value}
                          </p>
                        </div>
                      ))}
                    </div>
                    <div className="lg:col-span-2">
                      <ResponsiveContainer width="100%" height={180}>
                        <AreaChart data={revenueData}>
                          <defs>
                            <linearGradient
                              id="rev"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop
                                offset="0%"
                                stopColor="#10b981"
                                stopOpacity={0.35}
                              />
                              <stop
                                offset="100%"
                                stopColor="#10b981"
                                stopOpacity={0}
                              />
                            </linearGradient>
                            <linearGradient
                              id="mrr"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop
                                offset="0%"
                                stopColor="#2563eb"
                                stopOpacity={0.25}
                              />
                              <stop
                                offset="100%"
                                stopColor="#2563eb"
                                stopOpacity={0}
                              />
                            </linearGradient>
                          </defs>
                          <XAxis
                            dataKey="month"
                            stroke="#94a3b8"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                          />
                          <YAxis
                            stroke="#94a3b8"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                          />
                          <Tooltip
                            contentStyle={{
                              borderRadius: 12,
                              border: '1px solid #e2e8f0',
                              fontSize: 12,
                            }}
                          />
                          <Legend wrapperStyle={{ fontSize: 12 }} />
                          <Area
                            type="monotone"
                            dataKey="revenue"
                            name="Revenue (₱)"
                            stroke="#10b981"
                            fill="url(#rev)"
                            strokeWidth={2}
                          />
                          <Area
                            type="monotone"
                            dataKey="mrr"
                            name="MRR (₱)"
                            stroke="#2563eb"
                            fill="url(#mrr)"
                            strokeWidth={2}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </Card>
              </section>

              {/* USER MANAGEMENT + MODERATION */}
              <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <Card className="p-4 sm:p-6">
                  <SectionHeading
                    eyebrow="Directory"
                    title="User Management Snapshot"
                  />
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="text-xs text-slate-400">
                        <th className="pb-2 font-medium">Role</th>
                        <th className="pb-2 font-medium">Total</th>
                        <th className="pb-2 font-medium">Status</th>
                        <th className="pb-2 font-medium text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {userTable.map((r) => (
                        <tr key={r.role}>
                          <td className="py-2.5 font-medium">{r.role}</td>
                          <td className="py-2.5 font-display">{r.count}</td>
                          <td className="py-2.5">
                            <Badge
                              tone={r.status === 'Locked' ? 'amber' : 'emerald'}
                            >
                              {r.status}
                            </Badge>
                          </td>
                          <td className="py-2.5 text-right">
                            <button className="rounded-lg px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10">
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Card>

                <Card className="p-4 sm:p-6">
                  <SectionHeading
                    eyebrow="Moderation"
                    title="Question Bank Review"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: 'Pending Reviews', value: 12 },
                      { label: 'Reported Questions', value: 3 },
                      { label: 'Draft Exams', value: 7 },
                      { label: 'Needs Approval', value: 5 },
                    ].map((m) => (
                      <div
                        key={m.label}
                        className="rounded-xl border border-slate-100 p-3 dark:border-slate-800"
                      >
                        <p className="text-xs text-slate-400">{m.label}</p>
                        <p className="font-display mt-1 text-xl font-semibold">
                          {m.value}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button className="flex-1 rounded-xl bg-blue-600 py-2 text-sm font-medium text-white hover:bg-blue-700">
                      Review Questions
                    </button>
                    <button className="flex-1 rounded-xl border border-slate-200 py-2 text-sm font-medium hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800">
                      Publish Exams
                    </button>
                  </div>
                </Card>
              </section>

              {/* SYSTEM HEALTH */}
              <section>
                <Card className="p-4 sm:p-6">
                  <SectionHeading
                    eyebrow="Infrastructure"
                    title="Platform Health"
                  />
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {[
                        { label: 'API Status', value: 'Healthy', icon: Server },
                        {
                          label: 'Database',
                          value: 'Connected',
                          icon: Database,
                        },
                        { label: 'Redis Cache', value: 'Running', icon: Cpu },
                        {
                          label: 'AWS S3 Storage',
                          value: 'Operational',
                          icon: Cloud,
                        },
                        {
                          label: 'Email Service',
                          value: 'Operational',
                          icon: Mail,
                        },
                      ].map((s) => (
                        <div
                          key={s.label}
                          className="flex items-center justify-between rounded-xl border border-slate-100 px-3 py-2.5 dark:border-slate-800"
                        >
                          <span className="flex items-center gap-2 text-sm font-medium">
                            <s.icon size={15} className="text-slate-400" />{' '}
                            {s.label}
                          </span>
                          <Badge tone="emerald">{s.value}</Badge>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-4">
                      {[
                        {
                          label: 'CPU Usage',
                          value: 43,
                          icon: Cpu,
                          color: '#2563eb',
                        },
                        {
                          label: 'Memory Usage',
                          value: 61,
                          icon: MemoryStick,
                          color: '#0d9488',
                        },
                      ].map((g) => (
                        <div key={g.label}>
                          <div className="mb-1 flex items-center justify-between text-sm">
                            <span className="flex items-center gap-1.5 font-medium">
                              <g.icon size={14} className="text-slate-400" />{' '}
                              {g.label}
                            </span>
                            <span className="text-slate-400">{g.value}%</span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800">
                            <div
                              className="h-2 rounded-full"
                              style={{
                                width: `${g.value}%`,
                                backgroundColor: g.color,
                              }}
                            />
                          </div>
                        </div>
                      ))}
                      <div className="grid grid-cols-2 gap-3 pt-1">
                        <div className="rounded-xl border border-slate-100 p-3 dark:border-slate-800">
                          <p className="flex items-center gap-1.5 text-xs text-slate-400">
                            <Gauge size={13} /> Avg Response
                          </p>
                          <p className="font-display mt-1 text-lg font-semibold">
                            187 ms
                          </p>
                        </div>
                        <div className="rounded-xl border border-slate-100 p-3 dark:border-slate-800">
                          <p className="flex items-center gap-1.5 text-xs text-slate-400">
                            <AlertCircle size={13} /> Error Rate
                          </p>
                          <p className="font-display mt-1 text-lg font-semibold">
                            0.2%
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </section>

              {/* SECURITY + LEADERBOARD */}
              <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <Card className="p-4 sm:p-6">
                  <SectionHeading
                    eyebrow="Compliance"
                    title="Security & Audit Center"
                    action={
                      <button className="text-xs font-medium text-blue-600 hover:underline">
                        Open Audit Logs
                      </button>
                    }
                  />
                  <ul className="space-y-2.5">
                    {securityAlerts.map(({ level, text, icon: Icon }, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-3 rounded-xl border border-slate-100 px-3 py-2.5 dark:border-slate-800"
                      >
                        <span
                          className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg ${
                            level === 'critical'
                              ? 'bg-rose-50 text-rose-500 dark:bg-rose-500/10'
                              : level === 'warning'
                                ? 'bg-amber-50 text-amber-500 dark:bg-amber-500/10'
                                : 'bg-blue-50 text-blue-500 dark:bg-blue-500/10'
                          }`}
                        >
                          <Icon size={14} />
                        </span>
                        <span className="flex-1 text-sm">{text}</span>
                        <Badge
                          tone={
                            level === 'critical'
                              ? 'rose'
                              : level === 'warning'
                                ? 'amber'
                                : 'blue'
                          }
                        >
                          {level === 'critical'
                            ? 'Critical'
                            : level === 'warning'
                              ? 'Warning'
                              : 'Info'}
                        </Badge>
                      </li>
                    ))}
                  </ul>
                </Card>

                <Card className="p-4 sm:p-6">
                  <SectionHeading
                    eyebrow="Community"
                    title="Top Performing Students"
                  />
                  <ul className="space-y-2.5">
                    {leaderboard.map((s) => (
                      <li
                        key={s.name}
                        className="flex items-center gap-3 rounded-xl border border-slate-100 px-3 py-2.5 dark:border-slate-800"
                      >
                        <span className="text-xl">{s.rank}</span>
                        <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-blue-500 to-teal-500 font-display text-sm font-semibold text-white">
                          {s.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </div>
                        <span className="flex-1 font-medium">{s.name}</span>
                        <span className="font-display font-semibold text-emerald-500">
                          {s.score}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-50 to-teal-50 px-3 py-2.5 text-sm text-blue-700 dark:from-blue-500/10 dark:to-teal-500/10 dark:text-blue-300">
                    <Trophy size={16} />
                    Celebrate excellence and inspire others.
                    <Sparkles size={14} className="ml-auto text-teal-500" />
                  </div>
                </Card>
              </section>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
