import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { Card } from './ui/card'
import { SlidingNumber } from '@/components/ui/slider-number'
import { useEffect, useState, useMemo } from 'react'
import { format, differenceInDays } from 'date-fns'
import { Separator } from './ui/separator'
import { Button } from './ui/button'
import { LogOutIcon, Settings, Stethoscope } from 'lucide-react'
import {
  FcAlarmClock,
  FcBullish,
  FcHome,
  FcReadingEbook,
  FcSupport,
} from 'react-icons/fc'
import { FaArrowUpFromBracket } from 'react-icons/fa6'
import { BsFillClipboardDataFill } from 'react-icons/bs'
import { Checkbox } from './ui/checkbox'
import { Input } from './ui/input'
import { Link, useNavigate, useRouterState } from '@tanstack/react-router'
import { signOut } from '@/lib/auth-client'
import { router } from '@/main'
import { Progress } from './ui/progress'
import { useTasks } from '@/hooks/use-task'
import { useBooks } from '@/hooks/use-book'
import { useAuthStore } from '@/store/authStore'
import {
  useAgenda,
  useAddAgenda,
  useMarkAgendaDone,
  useMissedYesterday,
} from '@/hooks/use-agenda'

// ─── helpers ──────────────────────────────────────────────────────────────────

function isOverdueTask(dateStr: string | null, isDone: boolean): boolean {
  if (isDone || !dateStr) return false
  try {
    return differenceInDays(new Date(dateStr), new Date()) < 0
  } catch {
    return false
  }
}

// ─── component ────────────────────────────────────────────────────────────────

const SideBar = () => {
  // ── clock ─────────────────────────────────────────────────────────────────
  const [hours, setHours] = useState(new Date().getHours())
  const [minutes, setMinutes] = useState(new Date().getMinutes())
  const [seconds, setSeconds] = useState(new Date().getSeconds())

  // ── agenda input ──────────────────────────────────────────────────────────
  const [input, setInput] = useState('')

  // ── NLE countdown ─────────────────────────────────────────────────────────
  const [daysLeft, setDaysLeft] = useState(0)
  const NLE_DATE = new Date('2026-08-29')
  const TOTAL_REVIEW_DAYS = 365
  const reviewPct = Math.min(
    100,
    Math.round(((TOTAL_REVIEW_DAYS - daysLeft) / TOTAL_REVIEW_DAYS) * 100),
  )

  // ── auth & navigation ─────────────────────────────────────────────────────
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const routerState = useRouterState()
  const currentPath = routerState.location.pathname

  // ── remote data ───────────────────────────────────────────────────────────
  const { data: remoteTasks = [] } = useTasks()
  const { data: books = [] } = useBooks()
  const { data: agenda = [], isLoading: agendaLoading } = useAgenda()
  const { data: missed = [] } = useMissedYesterday()
  const addAgenda = useAddAgenda()
  const markDone = useMarkAgendaDone()

  // ── computed ──────────────────────────────────────────────────────────────
  const overdueCount = useMemo(
    () =>
      remoteTasks.filter((t) => isOverdueTask(t.task_date, t.task_isComplete))
        .length,
    [remoteTasks],
  )

  const activeNP = useMemo(() => {
    const nps = ['NP1', 'NP2', 'NP3', 'NP4', 'NP5']
    for (const np of nps) {
      const book = books.find((b) => b.book_type === np)
      if (!book) return np
      const subs = (book.topics ?? []).flatMap((t) => t.subtopics ?? [])
      const allDone =
        subs.length > 0 && subs.every((s) => s.status === 'Mastered')
      if (!allDone) return np
    }
    return null
  }, [books])

  const userInitials = useMemo(() => {
    if (!user?.name) return 'RN'
    return user.name
      .split(' ')
      .map((n: string) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }, [user])

  const taskStats = useMemo(() => {
    const total = agenda.length ?? 0
    const done = agenda.filter((a) => a.is_done).length ?? 0
    return { total, done, remaining: total - done }
  }, [agenda])

  // ── effects ───────────────────────────────────────────────────────────────
  useEffect(() => {
    const interval = setInterval(() => {
      setHours(new Date().getHours())
      setMinutes(new Date().getMinutes())
      setSeconds(new Date().getSeconds())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const updateDays = () => setDaysLeft(differenceInDays(NLE_DATE, new Date()))
    updateDays()
    const interval = setInterval(updateDays, 60000)
    return () => clearInterval(interval)
  }, [])

  // ── handlers ──────────────────────────────────────────────────────────────
  const handleLogout = async () => {
    await signOut()
    router.navigate({ to: '/login' })
  }

  const onClickTask = () => {
    if (!input.trim()) return
    console.log(input)
    addAgenda.mutate(input.trim())
    setInput('')
  }

  const toggleTask = (id: string) => markDone.mutate(id)

  // ── nav config ────────────────────────────────────────────────────────────
  const navItems = [
    {
      label: 'Home Page',
      to: '/',
      icon: <FcHome size={20} />,
      badge: null,
    },
    {
      label: 'Reviewer Books',
      to: '/reviewer',
      icon: <FcReadingEbook size={20} />,
      badge: activeNP ? (
        <span className="ml-auto text-[9px] font-bold bg-yellow-400 text-white rounded-full px-1.5 py-0.5">
          {activeNP}
        </span>
      ) : null,
    },
    {
      label: 'Task Tracker',
      to: '/task-tracker',
      icon: <BsFillClipboardDataFill size={18} color="#ca8a04" />,
      badge:
        overdueCount > 0 ? (
          <span className="ml-auto text-[9px] font-bold bg-red-500 text-white rounded-full px-1.5 py-0.5">
            {overdueCount}
          </span>
        ) : null,
    },
    {
      label: 'Score Tracker',
      to: '/score-task',
      icon: <FcBullish size={20} />,
      badge: null,
    },
  ]

  // ── render ────────────────────────────────────────────────────────────────
  return (
    <Sidebar collapsible="icon" variant="inset">
      {/* ── Header ── */}
      <SidebarHeader className="bg-yellow-100">
        <div className="flex flex-row gap-2 items-center justify-center">
          <Stethoscope size={28} className="text-yellow-600" />
          <span className="font-story text-[26px] font-bold text-yellow-700">
            PNLE {new Date().getFullYear()}
          </span>
        </div>

        {/* Countdown + review progress bar */}
        <div className="flex gap-3 items-center">
          <div className="flex flex-col items-center flex-shrink-0">
            <div className="flex items-center justify-center h-14 w-16 rounded-xl bg-yellow-400 text-4xl font-bold text-white font-mono">
              {daysLeft}
            </div>
            <span className="text-[10px] font-bold text-yellow-700 mt-0.5">
              {daysLeft <= 1 ? 'Day' : 'Days'} left
            </span>
          </div>
          <div className="flex-1">
            <div className="flex justify-between text-[10px] text-yellow-700 mb-1">
              <span>Review progress</span>
              <span className="font-medium">{reviewPct}%</span>
            </div>
            <Progress
              value={reviewPct}
              className="h-1.5 [&>div]:bg-yellow-400"
            />
            <div className="text-[9px] text-yellow-600 mt-1">
              Target: {format(NLE_DATE, 'MMM d, yyyy')}
            </div>
          </div>
        </div>

        <Separator className="my-1 bg-yellow-300" />

        {/* Date */}
        <p className="text-[11px] text-yellow-600 text-center font-medium">
          {format(new Date(), 'EEEE, MMMM d, yyyy')}
        </p>

        {/* Clock */}
        <Card className="flex-row w-full justify-center items-center py-3 px-2 bg-yellow-50 border border-yellow-200 shadow-none gap-2 font-mono">
          <SlidingNumber value={hours % 12 || 12} padStart={true} />
          <span className="text-yellow-600">:</span>
          <SlidingNumber value={minutes} padStart={true} />
          <span className="text-yellow-600">:</span>
          <SlidingNumber value={seconds} padStart={true} />
          <span className="text-yellow-700 text-sm">
            {hours >= 12 ? 'PM' : 'AM'}
          </span>
        </Card>
      </SidebarHeader>

      {/* ── Content ── */}
      <SidebarContent className="!bg-white">
        {/* User row */}
        <div className="flex items-center gap-2.5 px-3 py-2.5 border-b border-yellow-100">
          <div className="w-9 h-9 rounded-full bg-yellow-400 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
            {userInitials}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-yellow-800 truncate">
              {user?.name ?? 'Student Nurse'}
            </p>
            <p className="text-[10px] text-yellow-600 truncate">
              PNLE Candidate {new Date().getFullYear()}
            </p>
          </div>
        </div>

        {/* ── Missed Yesterday Warning ── */}
        {missed.length > 0 && (
          <div className="mx-3 mt-2 mb-1 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2">
            <p className="text-[10px] font-bold text-amber-700 mb-1">
              ⚠️ {missed.length} unfinished from yesterday
            </p>
            <ul className="flex flex-col gap-0.5">
              {missed.map((m) => (
                <li key={m.id} className="text-[10px] text-amber-600 truncate">
                  • {m.title}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* ── Today Agenda ── */}
        <SidebarGroup className="flex flex-col">
          <div className="flex flex-row items-center gap-1.5 text-yellow-600 mb-2">
            <FcAlarmClock size={18} />
            <span className="text-[12px] font-mono font-medium">
              Today · {format(new Date(), 'EEE')}
            </span>
          </div>

          {/* Agenda mini stats */}
          {agenda.length > 0 && (
            <div className="grid grid-cols-3 gap-1.5 mb-2">
              {[
                {
                  label: 'Total',
                  value: taskStats.total,
                  color: 'text-yellow-700',
                },
                {
                  label: 'Done',
                  value: taskStats.done,
                  color: 'text-green-600',
                },
                {
                  label: 'Left',
                  value: taskStats.remaining,
                  color:
                    taskStats.remaining > 0
                      ? 'text-amber-600'
                      : 'text-green-600',
                },
              ].map(({ label, value, color }) => (
                <div
                  key={label}
                  className="bg-yellow-50 border border-yellow-100 rounded-lg p-1.5 text-center"
                >
                  <p className={`text-sm font-bold ${color}`}>{value}</p>
                  <p className="text-[9px] text-yellow-600">{label}</p>
                </div>
              ))}
            </div>
          )}

          {/* Agenda list */}
          <div className="flex flex-col gap-1.5 font-mono text-sm max-h-40 overflow-y-auto">
            {agendaLoading ? (
              <div className="text-xs text-gray-400 italic py-2 text-center">
                Loading...
              </div>
            ) : agenda.length === 0 ? (
              <div className="flex items-center justify-center text-gray-400 italic text-xs py-2">
                No agenda today
              </div>
            ) : (
              agenda.map((item) => (
                <div
                  key={item.id}
                  className={`flex flex-row items-center gap-2 px-1 py-0.5 rounded ${item.is_done ? 'opacity-50' : ''}`}
                >
                  <Checkbox
                    checked={item.is_done}
                    disabled={item.is_done}
                    onCheckedChange={() => toggleTask(item.id)}
                    className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                  />
                  <span
                    className={`truncate text-xs ${
                      item.is_done
                        ? 'line-through cursor-not-allowed text-gray-400'
                        : 'text-yellow-800'
                    }`}
                  >
                    {item.title}
                  </span>
                </div>
              ))
            )}
          </div>

          {/* Agenda input */}
          <div className="flex flex-row items-center gap-1 mt-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && onClickTask()}
              placeholder="New agenda..."
              className="border-yellow-300 placeholder:text-gray-400 focus-visible:ring-0 focus-visible:border-yellow-400 h-7 text-xs"
            />
            <Button
              variant="outline"
              className="cursor-pointer h-7 border-yellow-400 text-yellow-600 hover:bg-yellow-100"
              onClick={onClickTask}
              disabled={addAgenda.isPending}
            >
              <FaArrowUpFromBracket size={12} />
            </Button>
          </div>
        </SidebarGroup>

        {/* ── Navigation ── */}
        <SidebarGroup className="flex flex-col bg-yellow-50">
          <SidebarGroupLabel className="flex justify-start items-center gap-2 text-yellow-700">
            <FcSupport /> Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map(({ label, to, icon, badge }) => {
                const isActive = currentPath === to
                return (
                  <SidebarMenuItem key={to}>
                    <Link
                      to={to}
                      className={`flex items-center gap-2 w-full px-2 py-1.5 rounded-lg transition-colors font-mono text-sm font-semibold ${
                        isActive
                          ? 'bg-yellow-200 text-yellow-800'
                          : 'text-yellow-800 hover:bg-yellow-100'
                      }`}
                    >
                      {icon}
                      <span className="truncate">{label}</span>
                      {badge}
                    </Link>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* ── Footer ── */}
      <SidebarFooter>
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            className="flex-1 items-center justify-center cursor-pointer border-yellow-400 text-yellow-700 hover:bg-yellow-100 bg-yellow-50"
            onClick={() => navigate({ to: '/profile' })}
          >
            <Settings size={15} className="mr-1" />
            <span>Settings</span>
          </Button>
          <Button
            variant="outline"
            className="items-center justify-center cursor-pointer border-red-200 text-red-500 hover:bg-red-50"
            onClick={handleLogout}
            title="Logout"
          >
            <LogOutIcon size={15} />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}

export default SideBar
