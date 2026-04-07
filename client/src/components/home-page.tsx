import { useMemo, useState, useRef } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { differenceInDays, format } from 'date-fns'
import {
  NotebookPen,
  BookOpen,
  ClipboardList,
  Timer,
  Trophy,
  AlertTriangle,
  ChevronRight,
  SkipForward,
  TimerReset,
  Target,
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { SlidingNumber } from '@/components/ui/slider-number'
import { TextLoop } from '@/components/ui/text-loop'
import { useTasks } from '@/hooks/use-task'
import { useBooks } from '@/hooks/use-book'
import { useAuthStore } from '@/store/authStore'
import { NLE_DATE } from '@/constant/date'
import { useScore } from '@/hooks/use-score'

// ─── helpers ─────────────────────────────────────────────────────────────────

function isOverdue(dateStr: string | null, isDone: boolean): boolean {
  if (isDone || !dateStr) return false
  try {
    return differenceInDays(new Date(dateStr), new Date()) < 0
  } catch {
    return false
  }
}

const TIMER_SESSIONS = [
  { label: 'Focus', minutes: 25 },
  { label: 'Short break', minutes: 5 },
  { label: 'Long break', minutes: 15 },
]

const Quotes = [
  'Every task completed is one step closer to your RN license.',
  "Success in the PNLE is not about luck — it's about preparation.",
  'Push yourself, because no one else is going to do it for you.',
  "The harder you work for something, the greater you'll feel when you achieve it.",
  "Dream big, work hard, stay focused. That's the PNLE mindset.",
  "It always seems impossible until it's done. — Nelson Mandela",
]

// ─── component ────────────────────────────────────────────────────────────────

const Homepage = () => {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { data: tasks = [] } = useTasks()
  const { data: books = [] } = useBooks()
  const { data: score = [] } = useScore()

  // ── user initials ─────────────────────────────────────────────────────────
  const userInitials = useMemo(() => {
    if (!user?.name) return 'RN'
    return user.name
      .split(' ')
      .map((n: string) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }, [user])

  // ── NLE countdown ─────────────────────────────────────────────────────────
  // Set your NLE target date here — or pull from user settings

  const daysToNLE = differenceInDays(NLE_DATE, new Date())

  // ── task stats ────────────────────────────────────────────────────────────
  const taskStats = useMemo(() => {
    const total = tasks.length
    const completed = tasks.filter((t) => t.task_isComplete).length
    const overdue = tasks.filter((t) =>
      isOverdue(t.task_date, t.task_isComplete),
    ).length
    const pending = total - completed
    const pct = total ? Math.round((completed / total) * 100) : 0
    const recent = [...tasks].filter((t) => !t.task_isComplete).slice(0, 3)
    return { total, completed, overdue, pending, pct, recent }
  }, [tasks])

  // ── reviewer stats ────────────────────────────────────────────────────────
  const reviewerStats = useMemo(() => {
    const allSubs = books.flatMap((b) =>
      (b.topics ?? []).flatMap((t) => t.subtopics ?? []),
    )
    const mastered = allSubs.filter((s) => s.status === 'Mastered').length
    const total = allSubs.length
    const pct = total ? Math.round((mastered / total) * 100) : 0
    const npProgress = ['NP1', 'NP2', 'NP3', 'NP4', 'NP5'].map((np) => {
      const book = books.find((b) => b.book_type === np)
      if (!book) return { np, pct: 0, exists: false }
      const subs = (book.topics ?? []).flatMap((t) => t.subtopics ?? [])
      const mast = subs.filter((s) => s.status === 'Mastered').length
      return {
        np,
        pct: subs.length ? Math.round((mast / subs.length) * 100) : 0,
        exists: true,
      }
    })
    return { mastered, total, pct, npProgress }
  }, [books])

  // ── score tracker mock stats (replace with real hook when available) ──────
  // These would come from useScores() hook once connected
  const scoreStats = useMemo(
    () => ({
      overallAvg: 86,
      best: 92,
      passRate: 100,
      weakest: 'Pharma',
      weakestGrade: 74,
    }),
    [],
  )

  // ── timer ─────────────────────────────────────────────────────────────────
  const [activeSession, setActiveSession] = useState(0)
  const [timer, setTimer] = useState({ minutes: 25, seconds: 0 })
  const [running, setRunning] = useState(false)
  const intervalRef = useRef<number | null>(null)

  const startTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    setRunning(true)
    intervalRef.current = window.setInterval(() => {
      setTimer((prev) => {
        if (prev.seconds === 0) {
          if (prev.minutes === 0) {
            clearInterval(intervalRef.current!)
            setRunning(false)
            return prev
          }
          return { minutes: prev.minutes - 1, seconds: 59 }
        }
        return { ...prev, seconds: prev.seconds - 1 }
      })
    }, 1000)
  }

  const stopTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setRunning(false)
  }

  const switchSession = (idx: number) => {
    stopTimer()
    setActiveSession(idx)
    setTimer({ minutes: TIMER_SESSIONS[idx].minutes, seconds: 0 })
  }

  const skipSession = () =>
    switchSession((activeSession + 1) % TIMER_SESSIONS.length)

  const resetTimer = () => {
    stopTimer()
    setTimer({ minutes: TIMER_SESSIONS[activeSession].minutes, seconds: 0 })
  }

  // ── render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-yellow-50/30 p-4 md:p-6 font-sans">
      {/* ── Top bar ── */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-yellow-100 border-2 border-yellow-300 flex items-center justify-center text-base font-bold text-yellow-700">
            {userInitials}
          </div>
          <div>
            <p className="text-sm font-medium leading-none">
              Welcome back, {user?.name?.split(' ')[0] ?? 'Nurse'}! 👋
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {format(new Date(), 'EEEE, MMMM d, yyyy')}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-yellow-400 text-white rounded-xl px-4 py-2 text-center min-w-[90px]">
            <p className="text-2xl font-bold leading-none">{daysToNLE}</p>
            <p className="text-[10px] mt-0.5 opacity-90">days to NLE</p>
          </div>
        </div>
      </div>

      {/* ── Motivational quote strip ── */}
      <div className="w-full bg-white border border-yellow-200 rounded-xl px-5 py-3 mb-6 overflow-hidden">
        <TextLoop
          className="text-xs text-muted-foreground italic text-center font-serif leading-relaxed"
          interval={8}
        >
          {Quotes.map((q, i) => (
            <span key={i} className="block">
              {q}
            </span>
          ))}
        </TextLoop>
      </div>

      {/* ── Main dashboard grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {/* ══ NLE Countdown card ══ */}
        <Card className="border border-yellow-300 bg-yellow-400 text-white p-5 flex flex-col gap-3 col-span-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target size={18} />
              <span className="text-sm font-medium">NLE Countdown</span>
            </div>
            <span className="text-xs opacity-80">
              {format(NLE_DATE, 'MMM d, yyyy')}
            </span>
          </div>
          <div className="text-center py-2">
            <p className="text-7xl font-bold leading-none">{daysToNLE}</p>
            <p className="text-sm opacity-90 mt-1">days remaining</p>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            {[
              { label: 'Weeks', value: Math.floor(daysToNLE / 7) },
              { label: 'Months', value: Math.floor(daysToNLE / 30) },
              { label: 'Hours', value: daysToNLE * 24 },
            ].map(({ label, value }) => (
              <div key={label} className="bg-white/20 rounded-lg py-2">
                <p className="text-lg font-bold">{value}</p>
                <p className="text-[10px] opacity-80">{label}</p>
              </div>
            ))}
          </div>
          <div>
            <div className="flex justify-between text-xs opacity-80 mb-1">
              <span>Review progress</span>
              <span>{reviewerStats.pct}%</span>
            </div>
            <div className="h-1.5 bg-white/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all"
                style={{ width: `${reviewerStats.pct}%` }}
              />
            </div>
          </div>
        </Card>

        {/* ══ Score Tracker summary ══ */}
        <Card className="border border-yellow-300 p-5 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-yellow-700">
              <NotebookPen size={16} />
              <span className="text-sm font-medium">Score Tracker</span>
            </div>
            <button
              onClick={() => navigate({ to: '/score-task' })}
              className="text-xs text-yellow-600 hover:text-yellow-700 flex items-center gap-0.5 cursor-pointer"
            >
              View all <ChevronRight size={12} />
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              {
                label: 'Avg grade',
                value: scoreStats.overallAvg,
                color: 'text-yellow-700',
              },
              {
                label: 'Best score',
                value: scoreStats.best,
                color: 'text-green-600',
              },
              {
                label: 'Pass rate',
                value: `${scoreStats.passRate}%`,
                color: 'text-blue-600',
              },
            ].map(({ label, value, color }) => (
              <div
                key={label}
                className="bg-yellow-50 border border-yellow-100 rounded-lg p-2.5 text-center"
              >
                <p className="text-[10px] text-yellow-700 mb-0.5">{label}</p>
                <p className={`text-xl font-bold ${color}`}>{value}</p>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
            <AlertTriangle size={13} className="text-red-500 flex-shrink-0" />
            <div>
              <p className="text-xs font-medium text-red-700">
                Needs attention
              </p>
              <p className="text-[10px] text-red-500">
                {scoreStats.weakest} — grade {scoreStats.weakestGrade}
              </p>
            </div>
          </div>
          <Button
            onClick={() => navigate({ to: '/score-task' })}
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-white text-xs h-8 cursor-pointer"
          >
            Open Score Tracker
          </Button>
        </Card>

        {/* ══ Task Tracker summary ══ */}
        <Card className="border border-yellow-300 p-5 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-yellow-700">
              <ClipboardList size={16} />
              <span className="text-sm font-medium">Task Tracker</span>
            </div>
            <button
              onClick={() => navigate({ to: '/task-tracker' })}
              className="text-xs text-yellow-600 hover:text-yellow-700 flex items-center gap-0.5 cursor-pointer"
            >
              View all <ChevronRight size={12} />
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              {
                label: 'Total',
                value: taskStats.total,
                color: 'text-yellow-700',
              },
              {
                label: 'Done',
                value: taskStats.completed,
                color: 'text-green-600',
              },
              {
                label: 'Overdue',
                value: taskStats.overdue,
                color:
                  taskStats.overdue > 0
                    ? 'text-red-500'
                    : 'text-muted-foreground',
              },
            ].map(({ label, value, color }) => (
              <div
                key={label}
                className="bg-yellow-50 border border-yellow-100 rounded-lg p-2.5 text-center"
              >
                <p className="text-[10px] text-yellow-700 mb-0.5">{label}</p>
                <p className={`text-xl font-bold ${color}`}>{value}</p>
              </div>
            ))}
          </div>
          <div>
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Completion</span>
              <span className="text-yellow-700 font-medium">
                {taskStats.pct}%
              </span>
            </div>
            <Progress
              value={taskStats.pct}
              className="h-1.5 [&>div]:bg-yellow-400"
            />
          </div>
          {/* Recent pending tasks */}
          <div className="flex flex-col gap-1.5">
            {taskStats.recent.length > 0 ? (
              taskStats.recent.map((t) => (
                <div
                  key={t.task_id}
                  className={`flex items-center gap-2 text-xs px-2 py-1.5 rounded-lg ${
                    isOverdue(t.task_date, t.task_isComplete)
                      ? 'bg-red-50 text-red-700'
                      : 'bg-yellow-50 text-yellow-800'
                  }`}
                >
                  {isOverdue(t.task_date, t.task_isComplete) && (
                    <AlertTriangle
                      size={11}
                      className="text-red-500 flex-shrink-0"
                    />
                  )}
                  <span className="truncate flex-1">{t.task_name}</span>
                  <span className="text-[10px] opacity-70 flex-shrink-0">
                    {t.task_date}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-muted-foreground italic text-center py-1">
                All tasks done! 🎉
              </p>
            )}
          </div>
          <Button
            onClick={() => navigate({ to: '/task-tracker' })}
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-white text-xs h-8 cursor-pointer"
          >
            Open Task Tracker
          </Button>
        </Card>

        {/* ══ Reviewer / PNLE Concept progress ══ */}
        <Card className="border border-yellow-300 p-5 flex flex-col gap-3 md:col-span-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-yellow-700">
              <BookOpen size={16} />
              <span className="text-sm font-medium">PNLE Concept Reviewer</span>
            </div>
            <button
              onClick={() => navigate({ to: '/reviewer' })}
              className="text-xs text-yellow-600 hover:text-yellow-700 flex items-center gap-0.5 cursor-pointer"
            >
              View all <ChevronRight size={12} />
            </button>
          </div>
          {/* Overall stats */}
          <div className="grid grid-cols-3 gap-2">
            {[
              {
                label: 'Total subtopics',
                value: reviewerStats.total,
                color: 'text-yellow-700',
              },
              {
                label: 'Mastered',
                value: reviewerStats.mastered,
                color: 'text-green-600',
              },
              {
                label: 'Overall',
                value: `${reviewerStats.pct}%`,
                color:
                  reviewerStats.pct >= 75
                    ? 'text-green-600'
                    : reviewerStats.pct > 0
                      ? 'text-amber-600'
                      : 'text-red-500',
              },
            ].map(({ label, value, color }) => (
              <div
                key={label}
                className="bg-yellow-50 border border-yellow-100 rounded-lg p-2.5 text-center"
              >
                <p className="text-[10px] text-yellow-700 mb-0.5">{label}</p>
                <p className={`text-xl font-bold ${color}`}>{value}</p>
              </div>
            ))}
          </div>
          {/* NP progress bars */}
          <div className="grid grid-cols-5 gap-2">
            {reviewerStats.npProgress.map(({ np, pct, exists }) => (
              <div key={np} className="flex flex-col gap-1">
                <div className="flex justify-between text-[10px]">
                  <span
                    className={
                      exists
                        ? 'text-yellow-700 font-medium'
                        : 'text-muted-foreground'
                    }
                  >
                    {np}
                  </span>
                  <span
                    className={
                      !exists
                        ? 'text-muted-foreground'
                        : pct === 100
                          ? 'text-green-600'
                          : pct > 0
                            ? 'text-amber-600'
                            : 'text-red-500'
                    }
                  >
                    {exists ? `${pct}%` : '—'}
                  </span>
                </div>
                <Progress
                  value={exists ? pct : 0}
                  className={`h-1.5 ${exists ? '[&>div]:bg-yellow-400' : '[&>div]:bg-muted'}`}
                />
              </div>
            ))}
          </div>
          <Button
            onClick={() => navigate({ to: '/reviewer' })}
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-white text-xs h-8 cursor-pointer"
          >
            Open Reviewer
          </Button>
        </Card>

        {/* ══ Break timer ══ */}
        <Card className="border border-yellow-300 p-5 flex flex-col gap-3">
          <div className="flex items-center gap-2 text-yellow-700">
            <Timer size={16} />
            <span className="text-sm font-medium">Break Timer</span>
          </div>
          {/* Session tabs */}
          <div className="flex gap-1.5">
            {TIMER_SESSIONS.map((s, idx) => (
              <button
                key={s.label}
                onClick={() => switchSession(idx)}
                className={`flex-1 py-1.5 rounded-lg text-[10px] font-medium border transition-colors cursor-pointer ${
                  activeSession === idx
                    ? 'bg-yellow-400 text-white border-yellow-400'
                    : 'text-muted-foreground border-muted hover:border-yellow-300 bg-transparent'
                }`}
              >
                {s.label}
                <span className="block text-[9px] opacity-75">
                  {s.minutes}m
                </span>
              </button>
            ))}
          </div>
          {/* Display */}
          <div
            className={`text-center py-3 rounded-xl ${running ? 'bg-yellow-50' : 'bg-transparent'}`}
          >
            <div className="flex items-center justify-center font-mono gap-1 text-5xl font-bold text-yellow-700">
              <SlidingNumber value={timer.minutes} padStart />
              <span className={running ? 'animate-pulse' : ''}>:</span>
              <SlidingNumber value={timer.seconds} padStart />
            </div>
            <p className="text-[10px] text-muted-foreground mt-1">
              {running ? TIMER_SESSIONS[activeSession].label : 'Ready'}
            </p>
          </div>
          {/* Controls */}
          <div className="flex gap-2">
            <Button
              onClick={running ? stopTimer : startTimer}
              className={`flex-1 h-8 text-xs cursor-pointer ${
                running
                  ? 'bg-red-100 hover:bg-red-200 text-red-700 border border-red-200'
                  : 'bg-yellow-400 hover:bg-yellow-500 text-white'
              }`}
            >
              {running ? 'Pause' : 'Start'}
            </Button>
            <Button
              onClick={skipSession}
              variant="outline"
              className="h-8 w-8 p-0 cursor-pointer border-yellow-200 hover:border-yellow-400"
              title="Skip session"
            >
              <SkipForward size={14} />
            </Button>
            <Button
              onClick={resetTimer}
              variant="outline"
              className="h-8 w-8 p-0 cursor-pointer border-yellow-200 hover:border-yellow-400"
              title="Reset"
            >
              <TimerReset size={14} />
            </Button>
          </div>
        </Card>
      </div>

      {/* ── Quick navigation bar ── */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          {
            label: 'Score Tracker',
            icon: NotebookPen,
            path: '/score-task',
            desc: 'Track exam scores',
          },
          {
            label: 'Reviewer',
            icon: BookOpen,
            path: '/reviewer',
            desc: 'PNLE concept notes',
          },
          {
            label: 'Task Tracker',
            icon: ClipboardList,
            path: '/tasks',
            desc: 'Manage study tasks',
          },
          {
            label: 'Leaderboard',
            icon: Trophy,
            path: '/leaderboard',
            desc: 'See top reviewees',
          },
        ].map(({ label, icon: Icon, path, desc }) => (
          <button
            key={label}
            onClick={() => navigate(path)}
            className="flex items-center gap-3 p-3 bg-white border border-yellow-200 rounded-xl hover:border-yellow-400 hover:bg-yellow-50 transition-all cursor-pointer text-left group"
          >
            <div className="w-9 h-9 rounded-lg bg-yellow-100 flex items-center justify-center flex-shrink-0 group-hover:bg-yellow-200 transition-colors">
              <Icon size={16} className="text-yellow-700" />
            </div>
            <div>
              <p className="text-xs font-medium text-yellow-700">{label}</p>
              <p className="text-[10px] text-muted-foreground">{desc}</p>
            </div>
            <ChevronRight
              size={14}
              className="ml-auto text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
            />
          </button>
        ))}
      </div>
    </div>
  )
}

export default Homepage
