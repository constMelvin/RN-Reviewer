import type {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from '@tanstack/react-table'
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import {
  ALargeSmall,
  ArrowUpDown,
  CalendarIcon,
  X,
  ChevronDown,
  Link,
  Plus,
  Type,
  TimerReset,
  Check,
  AlertTriangle,
  SkipForward,
  Pencil,
  Trash2,
  Settings,
} from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { FcCalendar } from 'react-icons/fc'
import { format, differenceInDays } from 'date-fns'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { TextLoop } from '@/components/ui/text-loop'
import { SlidingNumber } from '@/components/ui/slider-number'
import {
  useCreateTasks,
  useDeleteTask,
  useTasks,
  useUpdateTasks,
} from '@/hooks/use-task'

import type { Task } from '@/@types/task'
import { useAuthStore } from '@/store/authStore'
import { Progress } from '@/components/ui/progress'
import { TaskDialog } from '@/components/TaskDialog'

// ─── helpers ────────────────────────────────────────────────────────────────

function isOverdueTask(task: Task): boolean {
  if (task.task_isComplete || !task.task_date) return false
  try {
    return differenceInDays(new Date(task.task_date), new Date()) < 0
  } catch {
    return false
  }
}

function dueDateColor(task: Task): string {
  if (task.task_isComplete) return 'text-muted-foreground line-through'
  if (!task.task_date) return 'text-muted-foreground'
  try {
    const diff = differenceInDays(new Date(task.task_date), new Date())
    if (diff < 0) return 'text-red-600 font-medium'
    if (diff <= 3) return 'text-red-500 font-medium'
    if (diff <= 7) return 'text-amber-500'
    return ''
  } catch {
    return ''
  }
}

// ─── constants ───────────────────────────────────────────────────────────────

const typeOptions = [
  {
    value: 'Lecture',
    label: 'Lecture',
    className:
      'bg-amber-600/10 dark:bg-amber-600/20 hover:bg-amber-600/10 text-amber-500 border-amber-600/60',
  },
  {
    value: 'Post Test',
    label: 'Post Test',
    className:
      'bg-blue-600/10 dark:bg-blue-600/20 hover:bg-blue-600/10 text-blue-500 border-blue-600/60',
  },
  {
    value: 'Pre-Intensive',
    label: 'Pre-Intensive',
    className:
      'bg-red-600/10 dark:bg-red-600/20 hover:bg-red-600/10 text-red-500 border-red-600/60',
  },
]

const radioOptions = [
  {
    value: 'Lecture',
    label: 'Lecture',
    className: 'text-amber-500 border-amber-500 [&_svg]:fill-amber-500',
  },
  {
    value: 'Post Test',
    label: 'Post Test',
    className: 'text-blue-500 border-blue-500 [&_svg]:fill-blue-500',
  },
  {
    value: 'Pre-Intensive',
    label: 'Pre-Intensive',
    className: 'text-red-500 border-red-500 [&_svg]:fill-red-500',
  },
]

// Pomodoro session types
const TIMER_SESSIONS = [
  { label: 'Pomodoro', minutes: 25, short: '25m' },
  { label: 'Short break', minutes: 5, short: '5m' },
  { label: 'Long break', minutes: 15, short: '15m' },
]

const Quotes = [
  'Believe in yourself and all that you are. Know that there is something inside you greater than any obstacle. – Christian D. Larson',
  'Success in the PNLE is not about luck, but about preparation, perseverance, and prayer.',
  'Do not let what you cannot do interfere with what you can do. Focus and conquer the PNLE. – John Wooden',
  'The future belongs to those who prepare for it today. Review wisely, trust yourself, and claim your RN license. – Malcolm X',
  "A nurse's real exam is not on paper, but in how you touch lives. The PNLE is just the beginning.",
  'Push yourself, because no one else is going to do it for you. – Unknown',
  "Don't watch the clock; do what it does. Keep going. – Sam Levenson",
  "The harder you work for something, the greater you'll feel when you achieve it.",
  "Dream big, work hard, stay focused, and surround yourself with good energy. That's the PNLE mindset.",
  "It always seems impossible until it's done. – Nelson Mandela",
]
const getHref = (link: string) => {
  if (!link) return '#'
  let url =
    link.startsWith('http://') || link.startsWith('https://')
      ? link
      : `https://${link}`
  try {
    const parsed = new URL(url)
    if (!parsed.hostname.includes('.')) {
      parsed.hostname += '.com'
      url = parsed.toString()
    }
  } catch {
    if (!url.includes('.')) url += '.com'
  }
  return url
}

// ─── columns ─────────────────────────────────────────────────────────────────

export const columns: ColumnDef<Task>[] = [
  {
    id: 'select',
    header: () => (
      <div className="flex gap-1 items-center">
        <Check size={16} /> Done
      </div>
    ),
    cell: ({ row }) => {
      const updateTask = useUpdateTasks()
      return (
        <div className="flex items-center">
          <Checkbox
            className="cursor-pointer data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
            checked={row.original.task_isComplete}
            onCheckedChange={(value) => {
              updateTask.mutate({
                task_id: row.original.task_id,
                task_type: row.original.task_type as Task['task_type'],
                task_name: row.original.task_name,
                task_date: row.original.task_date,
                task_link: row.original.task_link,
                task_isComplete: value === true,
              })
            }}
            aria-label="Select row"
          />
        </div>
      )
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'task_name',
    header: ({ column }) => (
      <div className="flex items-center">
        <div className="flex gap-1 items-center">
          <ALargeSmall size={16} strokeWidth="3" color="grey" /> Name
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="flex item-center justify-center" variant="ghost">
              <ArrowUpDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              className="flex items-center cursor-pointer"
              onClick={() => column.toggleSorting(false)}
            >
              <ArrowUpDown className="h-4 w-4" /> asc
            </DropdownMenuItem>
            <DropdownMenuItem
              className="flex items-center cursor-pointer"
              onClick={() => column.toggleSorting(true)}
            >
              <ArrowUpDown className="h-4 w-4" /> desc
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
    cell: ({ row }) => (
      <div
        className={`flex items-center ${
          row.original.task_isComplete
            ? 'line-through text-muted-foreground'
            : ''
        }`}
      >
        {row.getValue('task_name')}
      </div>
    ),
  },
  {
    accessorKey: 'task_type',
    header: () => (
      <div className="flex gap-1 items-center">
        <Type size={16} /> Types
      </div>
    ),
    cell: ({ row }) => {
      const type = row.getValue('task_type') as Task['task_type']
      const currTypes = typeOptions.find((opt) => opt.value === type)
      return (
        <Badge className={`${currTypes?.className} shadow-none rounded-full`}>
          <div className="h-1.5 w-1.5 rounded-full bg-current mr-2" />
          {currTypes?.label}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'task_date',
    header: () => (
      <div className="flex gap-1 items-center">
        <FcCalendar size={16} /> Due Date
      </div>
    ),
    cell: ({ row }) => {
      const task = row.original
      const overdue = isOverdueTask(task)
      const colorClass = dueDateColor(task)
      return (
        <div className={`flex items-center gap-1 text-sm ${colorClass}`}>
          {overdue && (
            <AlertTriangle size={12} className="text-red-500 flex-shrink-0" />
          )}
          {row.getValue('task_date') || (
            <span className="text-muted-foreground text-xs italic">
              No date
            </span>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: 'task_link',
    header: () => (
      <div className="flex gap-1 items-center">
        <Link size={16} /> Links
      </div>
    ),
    cell: ({ row }) => (
      <a
        href={getHref(row.getValue('task_link'))}
        target="_blank"
        rel="noopener noreferrer"
        className="hover:underline hover:text-blue-500 text-blue-400 text-sm truncate max-w-[160px] block"
      >
        {row.getValue('task_link')}
      </a>
    ),
  },
  {
    id: 'actions',
    header: () => (
      <div className="flex gap-1 items-center">
        <Settings size={16} /> Actions
      </div>
    ),
    cell: ({ row, table }) => {
      const task = row.original
      const meta = table.options.meta as any
      const deleteTask = useDeleteTask()
      return (
        <div className="flex">
          {/* Edit Button */}
          <Button
            variant="ghost"
            disabled={task.task_isComplete}
            size="icon"
            className="cursor-pointer bg-transparent text-blue-500 hover:bg-blue-50 hover:text-blue-600"
            onClick={() => {
              // Use meta to trigger the dialog states
              meta?.setDialogMode('edit')
              meta?.setSelectedTask(task)
              meta?.setOpenTaskDialog(true)
            }}
          >
            <Pencil size={18} />
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              {/* Delete Button */}
              <Button
                variant="ghost"
                disabled={task.task_isComplete}
                size="icon"
                className="cursor-pointer bg-transparent text-red-500 hover:bg-red-50 hover:text-red-600"
              >
                <Trash2 size={18} />
              </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Task?</AlertDialogTitle>

                <AlertDialogDescription>
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>

                <AlertDialogAction
                  className="bg-red-500 hover:bg-red-600 text-white"
                  onClick={() => deleteTask.mutate(task.task_id)}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )
    },
  },
]

// ─── main component ───────────────────────────────────────────────────────────

const TaskTracker = () => {
  const queryTask = useTasks()
  const createTask = useCreateTasks()
  const { user } = useAuthStore()

  const rows = useMemo<Task[]>(() => {
    return (
      queryTask.data?.map((task) => ({
        task_id: task.task_id,
        task_name: task.task_name,
        task_type: task.task_type,
        task_date: task.task_date,
        task_link: task.task_link,
        task_isComplete: task.task_isComplete,
        user_id: task.user_id,
        created_at: task.created_at,
        updated_at: task.updated_at,
      })) ?? []
    )
  }, [queryTask.data])

  // ── task stats (NEW) ──────────────────────────────────────────────────────
  const taskStats = useMemo(() => {
    const total = rows.length
    const completed = rows.filter((t) => t.task_isComplete).length
    const overdue = rows.filter((t) => isOverdueTask(t)).length
    const pending = rows.filter((t) => !t.task_isComplete).length
    const completionPct = total ? Math.round((completed / total) * 100) : 0
    return { total, completed, overdue, pending, completionPct }
  }, [rows])

  // ── overdue tasks list (NEW) ──────────────────────────────────────────────
  const overdueTasks = useMemo(
    () => rows.filter((t) => isOverdueTask(t)),
    [rows],
  )

  // ── filter tab state (NEW) ────────────────────────────────────────────────
  type FilterTab = 'all' | 'pending' | 'done' | 'overdue'
  const [activeTab, setActiveTab] = useState<FilterTab>('all')

  const filteredRows = useMemo(() => {
    switch (activeTab) {
      case 'pending':
        return rows.filter((t) => !t.task_isComplete)
      case 'done':
        return rows.filter((t) => t.task_isComplete)
      case 'overdue':
        return rows.filter((t) => isOverdueTask(t))
      default:
        return rows
    }
  }, [rows, activeTab])

  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    audioRef.current = new Audio('/sounds/alarm-sound.mp3')
    audioRef.current.volume = 1.0
  }, [])

  const playSound = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0
      audioRef.current.loop = true
      audioRef.current.play()
      setTimeout(() => {
        audioRef.current!.pause()
        audioRef.current!.currentTime = 0
        audioRef.current!.loop = false
      }, 60000) // 1 minute
    }
  }
  const stopSound = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      audioRef.current.loop = false
    }
  }

  // ── timer session type (NEW) ──────────────────────────────────────────────
  const [activeSession, setActiveSession] = useState(0)
  const [sessionCount, setSessionCount] = useState(1)

  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [timer, setTimer] = useState({ seconds: 0, minutes: 0 })
  const intervalRef = useRef<number | null>(null)

  const updateTask = useUpdateTasks()
  const [openTaskDialog, setOpenTaskDialog] = useState(false)
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create')
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)

  const table = useReactTable({
    data: filteredRows,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getRowId: (row) => row.task_id,
    state: { sorting, columnFilters, columnVisibility, rowSelection },
    meta: {
      setDialogMode,
      setSelectedTask,
      setOpenTaskDialog,
    },
  })

  const handleStartTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = window.setInterval(() => {
      setTimer((prev) => {
        if (prev.seconds === 0) {
          if (prev.minutes === 0) {
            playSound()
            clearInterval(intervalRef.current!)
            intervalRef.current = null
            return prev
          }
          return { minutes: prev.minutes - 1, seconds: 59 }
        }
        return { ...prev, seconds: prev.seconds - 1 }
      })
    }, 1000)
  }

  const handleStopTimer = () => {
    stopSound()
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  // Switch session type and reset timer (NEW)
  const handleSelectSession = (idx: number) => {
    stopSound()
    handleStopTimer()
    setActiveSession(idx)
    setTimer({ minutes: TIMER_SESSIONS[idx].minutes, seconds: 0 })
  }

  // Skip to next session (NEW)
  const handleSkipSession = () => {
    stopSound()
    handleStopTimer()
    const next = (activeSession + 1) % TIMER_SESSIONS.length
    if (next === 0) setSessionCount((c) => c + 1)
    handleSelectSession(next)
  }

  const handleDialogSubmit = (data: {
    task_name: string
    task_link: string
    task_type: Task['task_type']
    task_date: string
    task_isComplete: boolean
  }) => {
    if (dialogMode === 'create') {
      createTask.mutate(data)
    } else if (dialogMode === 'edit' && selectedTask) {
      updateTask.mutate({
        task_id: selectedTask.task_id,
        task_name: data.task_name,
        task_type: data.task_type,
        task_date: data.task_date,
        task_link: data.task_link,
        task_isComplete: selectedTask.task_isComplete,
      })
    }
    setOpenTaskDialog(false)
  }

  // User initials for avatar (NEW)
  const userInitials = useMemo(() => {
    if (!user?.name) return 'RN'
    return user.name
      .split(' ')
      .map((n: string) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }, [user])

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-5 p-4 md:p-6 max-w-full overflow-x-hidden">
        <div className="flex flex-col gap-5 w-full min-w-0">
          {/* ── Stats row (NEW) ── */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              {
                label: 'Total tasks',
                value: taskStats.total,
                color: 'text-yellow-700',
              },
              {
                label: 'Completed',
                value: taskStats.completed,
                color: 'text-green-600',
              },
              {
                label: 'Pending',
                value: taskStats.pending,
                color: 'text-amber-600',
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
                className="bg-yellow-50 border border-yellow-200 rounded-xl p-3"
              >
                <div className="text-xs text-yellow-700 mb-1">{label}</div>
                <div className={`text-2xl font-semibold ${color}`}>{value}</div>
              </div>
            ))}
          </div>

          {/* ── Overdue warning banner (NEW) ── */}
          {overdueTasks.length > 0 && (
            <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
              <AlertTriangle
                size={15}
                className="text-red-500 flex-shrink-0 mt-0.5"
              />
              <div>
                <p className="text-sm font-medium text-red-700">
                  {overdueTasks.length} overdue{' '}
                  {overdueTasks.length === 1 ? 'task' : 'tasks'}
                </p>
                <p className="text-xs text-red-500 mt-0.5">
                  {overdueTasks.map((t) => t.task_name).join(', ')}
                </p>
              </div>
            </div>
          )}

          {/* ── Task table ── */}
          <div className="w-full h-fit p-5 bg-white rounded-lg shadow-lg border border-yellow-200">
            <div className="font-bold text-xl text-gray-900 mb-3">
              Task Tracker
            </div>

            {/* Filter tabs (NEW) */}
            <div className="flex gap-2 mb-3 flex-wrap">
              {(
                [
                  { key: 'all', label: `All (${taskStats.total})` },
                  { key: 'pending', label: `Pending (${taskStats.pending})` },
                  { key: 'done', label: `Done (${taskStats.completed})` },
                  {
                    key: 'overdue',
                    label: `Overdue (${taskStats.overdue})`,
                    danger: true,
                  },
                ] as { key: FilterTab; label: string; danger?: boolean }[]
              ).map(({ key, label, danger }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                    activeTab === key
                      ? danger
                        ? 'bg-red-100 text-red-700 border-red-300'
                        : 'bg-yellow-400 text-white border-yellow-400'
                      : danger
                        ? 'text-red-500 border-red-200 hover:bg-red-50'
                        : 'text-muted-foreground border-muted hover:border-yellow-300 bg-transparent'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 py-2">
              <Input
                placeholder="Filter names..."
                value={
                  (table.getColumn('task_name')?.getFilterValue() as string) ??
                  ''
                }
                onChange={(event) =>
                  table
                    .getColumn('task_name')
                    ?.setFilterValue(event.target.value)
                }
                className="max-w-sm"
              />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="ml-auto">
                    Columns <ChevronDown />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {table
                    .getAllColumns()
                    .filter((column) => column.getCanHide())
                    .map((column) => (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="rounded-md border relative overflow-auto max-w-full">
              <Table>
                <TableHeader className="[&>*]:whitespace-nowrap sticky top-0 z-90 bg-white shadow-sm">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHead key={header.id} className="bg-white">
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && 'selected'}
                        className={`transition-all duration-500 ${
                          row.original.task_isComplete
                            ? 'bg-emerald-300 opacity-50 hover:bg-emerald-300'
                            : isOverdueTask(row.original)
                              ? 'bg-red-50 hover:bg-red-50'
                              : ''
                        }`}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-15 text-center text-muted-foreground"
                      >
                        No tasks found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Add new task */}
            <div className="flex items-center justify-end space-x-2 py-4 px-2">
              <div className="flex-1 text-sm text-muted-foreground">
                <Button
                  variant="ghost"
                  className="cursor-pointer"
                  onClick={() => {
                    setDialogMode('create')
                    setSelectedTask(null)
                    setOpenTaskDialog(true)
                  }}
                >
                  <Plus /> new table row...
                </Button>
              </div>
            </div>

            <TaskDialog
              open={openTaskDialog}
              onOpenChange={setOpenTaskDialog}
              mode={dialogMode}
              initialData={selectedTask}
              onSubmit={handleDialogSubmit}
            />
          </div>

          {/* ── Improved timer (NEW) ── */}
          <Card className="flex flex-col border border-yellow-400 p-5 gap-3">
            <CardTitle className="text-xl font-medium text-center text-yellow-700">
              Take a Break
            </CardTitle>
            <CardContent className="space-y-4 p-0">
              {/* Session type tabs */}
              <div className="flex gap-2 justify-center flex-wrap">
                {TIMER_SESSIONS.map((session, idx) => (
                  <button
                    key={session.label}
                    onClick={() => handleSelectSession(idx)}
                    className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-colors cursor-pointer ${
                      activeSession === idx
                        ? 'bg-yellow-400 text-white border-yellow-400'
                        : 'text-muted-foreground border-muted hover:border-yellow-300 bg-transparent'
                    }`}
                  >
                    {session.label} {session.short}
                  </button>
                ))}
              </div>

              {/* Session counter */}
              <p className="text-center text-xs text-muted-foreground">
                Session {sessionCount} ·{' '}
                {activeSession === 0
                  ? 'Focus time'
                  : TIMER_SESSIONS[activeSession].label}
              </p>

              {/* Timer display */}
              <div className="flex flex-row items-center justify-center font-mono gap-2 text-7xl font-bold text-yellow-700">
                <SlidingNumber value={timer.minutes} padStart />
                <span>:</span>
                <SlidingNumber value={timer.seconds} padStart />
              </div>

              {/* Controls */}
              <div className="flex flex-row gap-2 items-center justify-center">
                <Button
                  className="rounded-full bg-yellow-400 hover:bg-yellow-400/85 text-white border-none cursor-pointer px-6"
                  onClick={handleStartTimer}
                >
                  Start
                </Button>
                <Button
                  className="rounded-full bg-transparent text-muted-foreground border border-gray-300 hover:bg-gray-100 cursor-pointer"
                  onClick={handleSkipSession}
                  title="Skip to next session"
                >
                  <SkipForward size={16} />
                </Button>
                <Button
                  className="rounded-full bg-transparent text-muted-foreground border border-gray-300 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    handleStopTimer()
                    setTimer({
                      minutes: TIMER_SESSIONS[activeSession].minutes,
                      seconds: 0,
                    })
                  }}
                >
                  <TimerReset size={16} />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ── Right column ── */}
        <div className="relative justify-center mx-auto flex-col gap-4 max-w-[600px] overflow-hidden flex w-full">
          {/* Quotes */}
          <Card className="h-32 w-full flex items-center justify-center overflow-hidden bg-white border-l-7 mb-2 border-yellow-400 shadow-sm rounded-md">
            <TextLoop
              className="font-serif text-sm md:text-base px-6 text-center leading-relaxed text-gray-800"
              interval={60}
            >
              {Quotes.map((quote, idx) => (
                <span key={idx} className="block whitespace-normal break-words">
                  {quote}
                </span>
              ))}
            </TextLoop>
          </Card>

          {/* ── Profile card — replaced placeholder image (NEW) ── */}
          <Card className="border border-yellow-400 rounded-xl p-5 flex flex-col gap-4">
            {/* User info */}
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-yellow-100 border-2 border-yellow-300 flex items-center justify-center text-xl font-semibold text-yellow-700 flex-shrink-0">
                {userInitials}
              </div>
              <div>
                <p className="text-base font-medium">
                  {user?.name ?? 'Student Nurse'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {user?.email ?? 'BSN Graduate · NLE Candidate 2026'}
                </p>
              </div>
            </div>

            {/* Task completion progress */}
            <div>
              <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                <span>Overall task completion</span>
                <span className="text-yellow-700 font-medium">
                  {taskStats.completionPct}%
                </span>
              </div>
              <Progress
                value={taskStats.completionPct}
                className="h-2 [&>div]:bg-yellow-400"
              />
            </div>

            {/* Mini stats */}
            <div className="grid grid-cols-3 gap-2">
              {[
                {
                  label: 'Tasks done',
                  value: taskStats.completed,
                  color: 'text-green-600',
                },
                {
                  label: 'Pending',
                  value: taskStats.pending,
                  color: 'text-amber-600',
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
                  className="bg-yellow-50 border border-yellow-200 rounded-lg p-2.5 text-center"
                >
                  <div className="text-[10px] text-yellow-700 mb-0.5">
                    {label}
                  </div>
                  <div className={`text-lg font-semibold ${color}`}>
                    {value}
                  </div>
                </div>
              ))}
            </div>

            {/* Motivational quote at bottom of profile */}
            <div className="border-t border-yellow-100 pt-3">
              <p className="text-xs text-muted-foreground italic text-center">
                "Every task completed is one step closer to your RN license."
              </p>
            </div>
          </Card>

          {/* ── Wallpaper image card ── */}
          <Card
            className="relative rounded-xl overflow-hidden border-yellow-400 h-[400px] lg:h-full"
            // style={{ height: '410px' }}
          >
            <img
              src="https://i.pinimg.com/webp/736x/8f/bc/38/8fbc383992a1380be7c06cb99a0d675c.webp"
              alt="profile"
              className="absolute inset-0 h-full w-full object-fit object-center"
            />
          </Card>
        </div>
      </div>
    </>
  )
}

export default TaskTracker
