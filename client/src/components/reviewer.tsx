import { Card } from '@/components/ui/card'
import {
  AlertDialog,
  AlertDialogClose,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogPopup,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { ColumnDef } from '@tanstack/react-table'
import {
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { Checkbox } from '@/components/ui/checkbox'
import {
  BookOpen,
  BookOpenCheck,
  CalendarIcon,
  Check,
  ChevronDown,
  ChevronRight,
  Link2,
  Loader,
  LoaderIcon,
  Search,
  X,
} from 'lucide-react'
import React, { useMemo, useState, type ChangeEvent } from 'react'

import '@/@types/tanstack-table'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
} from '@/components/ui/select'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { format, differenceInDays } from 'date-fns'
import { Calendar } from '@/components/ui/calendar'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { FcBarChart, FcCalendar, FcDocument, FcOk } from 'react-icons/fc'
import { useBooks, useCreateBook } from '@/hooks/use-book'
import type { BookSubTopics, BookTopics } from '@/@types/books'
import type { ExpandedState } from '@tanstack/react-table'
import { useCreateTopics } from '@/hooks/use-topics'
import { useCreateSubTopics, useUpdateSubTopics } from '@/hooks/use-sub-topics'
import { sileo } from 'sileo'

export type Data = BookTopics & {
  subtopics?: BookSubTopics[]
}

export type TableRow = BookTopics | BookSubTopics

// ─── helpers ────────────────────────────────────────────────────────────────

/** Returns tailwind color class based on how close deadline is */
function deadlineColor(deadline: string | null): string {
  if (!deadline) return 'text-muted-foreground'
  try {
    const diff = differenceInDays(new Date(deadline), new Date())
    if (diff < 0) return 'text-red-600 font-medium' // overdue
    if (diff <= 3) return 'text-red-500 font-medium' // urgent
    if (diff <= 7) return 'text-amber-500' // soon
    return 'text-muted-foreground'
  } catch {
    return 'text-muted-foreground'
  }
}

// ─── main component ─────────────────────────────────────────────────────────

const Reviewer = () => {
  const createBook = useCreateBook()
  const { data: book } = useBooks()
  const createTopic = useCreateTopics()
  const createSubTopic = useCreateSubTopics()
  const updateSubTopic = useUpdateSubTopics()

  // ── NEW: active NP tab & search ──────────────────────────────────────────
  const moduleArr = ['NP1', 'NP2', 'NP3', 'NP4', 'NP5']
  const [activeNP, setActiveNP] = useState<string>('NP1')
  const [searchQuery, setSearchQuery] = useState('')

  const sortedBook = useMemo(() => {
    if (!book) return []
    return [...book].sort(
      (a, b) =>
        parseInt(a.book_type.replace('NP', ''), 10) -
        parseInt(b.book_type.replace('NP', ''), 10),
    )
  }, [book])

  // The single book currently shown (matches activeNP tab)
  const activeBook = useMemo(
    () => sortedBook.find((b) => b.book_type === activeNP) ?? null,
    [sortedBook, activeNP],
  )

  // ── sidebar per-topic progress for active NP ─────────────────────────────
  const sidebarTopics = useMemo(() => {
    if (!activeBook?.topics) return []
    return activeBook.topics.map((topic) => {
      const subs = topic.subtopics || []
      const mastered = subs.filter((s) => s.status === 'Mastered').length
      const total = subs.length
      const pct = total ? Math.round((mastered / total) * 100) : 0
      return { id: topic.topic_id, label: topic.topics, pct, mastered, total }
    })
  }, [activeBook])

  // ── mini stats for active NP ─────────────────────────────────────────────
  const miniStats = useMemo(() => {
    const topics = activeBook?.topics ?? []
    const allSubs = topics.flatMap((t) => t.subtopics ?? [])
    const mastered = allSubs.filter((s) => s.status === 'Mastered').length
    const overall = allSubs.length
      ? Math.round((mastered / allSubs.length) * 100)
      : 0
    return { topicCount: topics.length, mastered, overall }
  }, [activeBook])

  // ── overall book progress (for card header bar) ──────────────────────────
  function bookProgress(bookData: typeof activeBook): number {
    const allSubs = (bookData?.topics ?? []).flatMap((t) => t.subtopics ?? [])
    if (!allSubs.length) return 0
    return Math.round(
      (allSubs.filter((s) => s.status === 'Mastered').length / allSubs.length) *
        100,
    )
  }

  const [date, setDate] = useState<Date | undefined>()

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

  const [topics, setTopics] = useState({
    book_id: '',
    topics: '',
    links: '',
    deadline: '',
  })
  const [subTopics, setSubTopics] = useState({
    topics: '',
    topic_id: '',
    links: '',
    deadline: '',
  })
  const [updateSubTopics, setUpdateSubTopics] = useState({
    subtopic_id: '',
    status: '',
  })
  const [openAlert, setOpenAlert] = useState(false)
  const [selectBook, setSelectBook] = useState({
    book_type: '',
    book_title: '',
  })

  // ── overdue count per NP tab ─────────────────────────────────────────────
  const overdueCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    sortedBook.forEach((b) => {
      let count = 0
      ;(b.topics ?? []).forEach((topic) => {
        const subs = topic.subtopics ?? []
        const allMastered =
          subs.length > 0 && subs.every((s) => s.status === 'Mastered')

        // Only check topic deadline if not fully mastered
        if (!allMastered && topic.deadline) {
          try {
            if (differenceInDays(new Date(topic.deadline), new Date()) < 0)
              count++
          } catch {}
        }

        // Check each subtopic deadline — skip if already Mastered
        subs.forEach((s) => {
          if (s.status === 'Mastered') return
          if (!s.deadline) return
          try {
            if (differenceInDays(new Date(s.deadline), new Date()) < 0) count++
          } catch {}
        })
      })
      counts[b.book_type] = count
    })
    return counts
  }, [sortedBook])

  // ── available NP types (not yet created) for Add Books dropdown ──────────
  const availableModules = useMemo(
    () => moduleArr.filter((m) => !sortedBook.some((b) => b.book_type === m)),
    [sortedBook],
  )

  const rows: Data[] = useMemo(() => {
    if (!sortedBook) return []
    return sortedBook.flatMap((b) =>
      (b.topics ?? []).map((topic) => ({
        ...topic,
        subtopics: (topic.subtopics ?? []).map((sub) => ({
          ...sub,
          subtopics: undefined,
        })) as BookSubTopics[],
      })),
    )
  }, [sortedBook])

  // ── status badges ─────────────────────────────────────────────────────────
  const statusType: Record<string, React.ReactNode> = {
    Mastered: (
      <Badge className="bg-emerald-600/10 dark:bg-emerald-600/20 hover:bg-emerald-600/10 text-emerald-500 border-emerald-600/60 shadow-none rounded-full gap-2 cursor-pointer">
        <Check className="text-emerald-500" /> Mastered
      </Badge>
    ),
    Studying: (
      <Badge className="bg-amber-600/10 dark:bg-amber-600/20 hover:bg-amber-600/10 text-amber-500 border-amber-600/60 shadow-none rounded-full gap-2 cursor-pointer">
        <Loader className="text-amber-500" /> Studying
      </Badge>
    ),
    'Not Started': (
      <Badge className="bg-red-600/10 dark:bg-red-600/20 hover:bg-red-600/10 text-red-500 border-red-600/60 shadow-none rounded-full gap-3 cursor-pointer">
        <div className="h-1.5 w-1.5 rounded-full bg-red-500" /> Not Started
      </Badge>
    ),
  }

  // ── columns ───────────────────────────────────────────────────────────────
  const columns: ColumnDef<Data>[] = [
    {
      id: 'select',
      size: 60,
      enableResizing: false,
      header: () => (
        <div className="flex items-center justify-center gap-1">
          <FcOk size={14} /> Done
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-center">
          <Checkbox
            className="cursor-not-allowed data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
            checked={row.original.done ?? false}
            aria-label="Select row"
          />
        </div>
      ),
    },
    {
      id: 'expander',
      size: 40,
      enableResizing: false,
      header: () => <ChevronDown size={16} className="text-muted-foreground" />,
      cell: ({ row }) => {
        const hasSubtopics =
          row.original.subtopics && row.original.subtopics.length > 0
        return row.getCanExpand() && hasSubtopics ? (
          <button
            className="cursor-pointer text-yellow-600"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              row.getToggleExpandedHandler()()
            }}
          >
            {row.getIsExpanded() ? (
              <ChevronDown size={16} />
            ) : (
              <ChevronRight size={16} />
            )}
          </button>
        ) : null
      },
    },
    {
      accessorKey: 'topics',
      size: 280,
      header: () => (
        <div className="flex items-center gap-1">
          <FcDocument size={14} /> Topics
        </div>
      ),
      cell: ({ row }) => (
        <div
          className={`flex items-center text-sm font-medium ${row.depth > 0 ? 'pl-4 text-muted-foreground' : ''}`}
        >
          {row.getValue('topics')}
        </div>
      ),
    },
    {
      accessorKey: 'status',
      size: 180,
      header: () => (
        <div className="flex items-center gap-1">
          <FcBarChart size={14} /> Status
        </div>
      ),
      cell: ({ row }) => {
        const isSubtopic = 'subtopic_id' in row.original
        if (isSubtopic) {
          const sub = row.original as unknown as BookSubTopics
          return (
            <Select
              value={sub.status || 'Not Started'}
              onValueChange={(value) => {
                setUpdateSubTopics({
                  status: value,
                  subtopic_id: sub.subtopic_id,
                })
                setOpenAlert(true)
              }}
            >
              <SelectTrigger className="border-none hover:bg-accent shadow-none">
                {statusType[sub.status] ?? statusType['Not Started']}
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Set Status</SelectLabel>
                  <SelectItem value="Mastered">
                    {statusType['Mastered']}
                  </SelectItem>
                  <SelectItem value="Studying">
                    {statusType['Studying']}
                  </SelectItem>
                  <SelectItem value="Not Started">
                    {statusType['Not Started']}
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          )
        }
        const subs = row.original.subtopics || []
        const mastered = subs.filter((s) => s.status === 'Mastered').length
        const pct = subs.length ? Math.floor((mastered / subs.length) * 100) : 0
        return (
          <div className="flex items-center gap-2 text-sm font-medium">
            <Progress value={pct} className="w-[60%] [&>div]:bg-yellow-500" />
            <span
              className={
                pct === 100
                  ? 'text-green-600'
                  : pct > 0
                    ? 'text-amber-600'
                    : 'text-muted-foreground'
              }
            >
              {pct}%
            </span>
          </div>
        )
      },
    },
    {
      accessorKey: 'deadline',
      size: 120,
      header: () => (
        <div className="flex items-center gap-1">
          <FcCalendar size={14} /> Deadline
        </div>
      ),
      cell: ({ row }) => {
        const deadlineValue = row.getValue('deadline') as string | null
        const colorClass = deadlineColor(deadlineValue)
        return (
          <Popover>
            <PopoverTrigger asChild>
              <div className="cursor-pointer">
                {deadlineValue ? (
                  // Color-coded deadline text
                  <span className={`text-sm ${colorClass}`}>
                    {deadlineValue}
                  </span>
                ) : (
                  <span className="text-muted-foreground text-xs italic hover:text-yellow-600 transition-colors">
                    + set deadline
                  </span>
                )}
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={date} autoFocus />
            </PopoverContent>
          </Popover>
        )
      },
    },
    {
      accessorKey: 'links',
      size: 120,
      header: () => (
        <div className="flex items-center gap-1">
          <Link2 size={14} /> Links
        </div>
      ),
      cell: ({ row }) => {
        const linkValue = row.getValue('links') as string | null
        return (
          <div className="flex items-center max-w-[120px]">
            {linkValue ? (
              <a
                href={getHref(linkValue)}
                rel="noopener noreferrer"
                target="_blank"
                className="hover:text-blue-600 hover:underline truncate whitespace-nowrap overflow-hidden text-sm text-blue-500"
              >
                {linkValue}
              </a>
            ) : (
              <Dialog>
                <DialogTrigger asChild>
                  <span className="text-muted-foreground text-xs italic cursor-pointer hover:text-yellow-600 transition-colors">
                    + add link
                  </span>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Link</DialogTitle>
                    <DialogDescription>
                      Put a link on the input box.
                    </DialogDescription>
                  </DialogHeader>
                  <Label>
                    Links <span className="text-red-500">*</span>
                  </Label>
                  <Input placeholder="Enter Google Drive Link..." />
                  <DialogFooter>
                    <DialogClose>Cancel</DialogClose>
                    <Button
                      variant="outline"
                      className="bg-yellow-300 hover:bg-yellow-300/80 cursor-pointer"
                    >
                      Save Links
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
        )
      },
    },
  ]

  // ── BookTable ─────────────────────────────────────────────────────────────
  const BookTable = ({ bookId }: { bookId: string }) => {
    const [expanded, setExpanded] = useState<ExpandedState>({})

    const bookTopics = useMemo(() => {
      let filtered = rows.filter((topic) => topic.book_id === bookId)
      // Search filter (NEW)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        filtered = filtered.filter(
          (topic) =>
            topic.topics.toLowerCase().includes(q) ||
            (topic.subtopics ?? []).some((s) =>
              s.topics.toLowerCase().includes(q),
            ),
        )
      }
      return filtered
    }, [bookId, rows, searchQuery])

    const table = useReactTable<Data>({
      data: bookTopics,
      columns,
      getCoreRowModel: getCoreRowModel(),
      getExpandedRowModel: getExpandedRowModel(),
      getSubRows: (row) => {
        if ('topic_id' in row && row.subtopics) return row.subtopics as any
        return undefined
      },
      state: { expanded },
      onExpandedChange: setExpanded,
    })

    if (bookTopics.length === 0) {
      return (
        <div className="w-full p-8 border rounded-lg bg-yellow-50 text-center">
          <p className="text-yellow-700 font-medium">
            {searchQuery
              ? `No topics match "${searchQuery}".`
              : 'No topics yet. Click "+ Topic" to add.'}
          </p>
        </div>
      )
    }

    return (
      <div className="grid w-full [&>div]:max-h-80 [&>div]:border [&>div]:rounded-lg">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="[&>*]:whitespace-nowrap sticky z-10 top-0 bg-background"
              >
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
            {table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
                // Subtle yellow tint for subtopic rows (NEW)
                className={row.depth > 0 ? 'bg-yellow-50/60' : 'bg-white'}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }

  // ── handlers ──────────────────────────────────────────────────────────────
  const handleSubmitBook = (e: any) => {
    e.preventDefault()
    if (!selectBook.book_title || !selectBook.book_type) {
      sileo.error({
        description: 'Please fill in both fields!',
      })
      return
    }
    createBook.mutate(selectBook, {
      onSuccess: () => {
        setSelectBook({ book_title: '', book_type: '' })
        sileo.success({
          description: `${selectBook.book_type} book created!`,
        })
      },
      onError: () =>
        sileo.error({
          description: 'Failed to create book.',
        }),
    })
  }

  const handleResetDate = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault()
    setDate(undefined)
  }

  const handleSubmitTopics = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault()

    if (!topics.topics || !topics.deadline || !topics.links) {
      sileo.error({
        description: 'Failed to add topic. Please complete all fields',
      })
      return
    }

    createTopic.mutate(topics, {
      onSuccess: () =>
        sileo.success({
          description: 'Topic added!',
        }),
      onError: () => sileo.error({ description: 'Failed to add topic.' }),
    })
    setDate(undefined)
    setTopics({ topics: '', book_id: '', deadline: '', links: '' })
  }

  const handleSubmitSubTopics = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault()

    if (!subTopics.topics || !subTopics.deadline || !subTopics.links) {
      sileo.error({
        description: 'Failed to add sub topic. Please complete all fields',
      })
      return
    }
    createSubTopic.mutate(subTopics, {
      onSuccess: () =>
        sileo.success({
          description: 'Subtopic added!',
        }),
      onError: () =>
        sileo.error({
          description: 'Failed to add subtopic.',
        }),
    })
    setDate(undefined)
    setSubTopics({ topics: '', topic_id: '', links: '', deadline: '' })
  }

  const handleUpdateStatus = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault()
    updateSubTopic.mutate(updateSubTopics, {
      onSuccess: () =>
        sileo.success({
          description: 'Status updated!',
        }),
      onError: () =>
        sileo.error({
          description: 'Failed to update status.',
        }),
    })
    setUpdateSubTopics({ status: '', subtopic_id: '' })
  }

  // ── render ────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col w-full m-2 gap-4">
      {/* ── Page title ── */}
      <span className="flex items-center justify-center text-5xl font-story border w-8/12 bg-yellow-200 text-yellow-700 pl-5 py-2 mx-auto rounded-xl">
        PNLE Concept Reviewer
      </span>

      {/* ── NP Tabs (NEW) — replaces sidebar anchor links ── */}
      <div className="flex w-8/12 mx-auto gap-2 bg-yellow-200">
        {moduleArr.map((np) => {
          const exists = sortedBook.some((b) => b.book_type === np)
          const overdue = overdueCounts[np] ?? 0
          return (
            <button
              key={np}
              onClick={() => {
                setActiveNP(np)
                setSearchQuery('')
              }}
              className={`relative px-5 py-2 rounded-lg text-sm font-medium border transition-colors cursor-pointer ${
                activeNP === np
                  ? 'bg-yellow-400 text-white border-yellow-400'
                  : exists
                    ? 'bg-yellow-50 text-yellow-700 border-yellow-300 hover:bg-yellow-100'
                    : 'bg-transparent text-muted-foreground border-dashed  hover:border-yellow-500 border-black/60'
              }`}
            >
              {np}
              {!exists && <span className="ml-1 text-xs opacity-60">+</span>}
              {overdue > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] font-bold rounded-full min-w-[16px] h-4 flex items-center justify-center px-1">
                  {overdue}
                </span>
              )}
            </button>
          )
        })}
      </div>

      <div className="flex flex-row gap-6 w-full">
        {/* ── Sidebar — now shows per-topic progress (NEW) ── */}
        <div className="flex flex-col border w-72 h-fit border-yellow-400 rounded-2xl p-5 sticky top-4 gap-3 bg-gray-50">
          <span className="text-yellow-700 text-xl font-bold font-story">
            {activeNP} — Progress
          </span>

          {/* Per-topic progress bars */}
          <div className="flex flex-col gap-3">
            {sidebarTopics.length > 0 ? (
              sidebarTopics.map((t) => (
                <div key={t.id}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-bold text-lg text-muted-foreground truncate max-w-[140px]">
                      {t.label}
                    </span>
                    <span
                      className={
                        t.pct === 100
                          ? 'text-green-600 font-medium'
                          : t.pct > 0
                            ? 'text-amber-600'
                            : 'text-red-500'
                      }
                    >
                      {t.mastered}/{t.total} mastered
                    </span>
                  </div>
                  <Progress
                    value={t.pct}
                    className="h-1.5 [&>div]:bg-yellow-400"
                  />
                </div>
              ))
            ) : (
              <p className="text-xs text-muted-foreground italic">
                No topics yet.
              </p>
            )}
          </div>

          <div className="border-t border-yellow-200 pt-3 flex flex-col gap-2">
            {/* Add Topics button */}
            {activeBook && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full text-yellow-700 hover:text-yellow-700/90 hover:bg-yellow-50 bg-yellow-100 cursor-pointer border border-dashed border-yellow-300"
                    onClick={() =>
                      setTopics((prev) => ({
                        ...prev,
                        book_id: activeBook.book_id,
                      }))
                    }
                  >
                    + Add Topic
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Topic</DialogTitle>
                    <DialogDescription>
                      Create a new topic for {activeBook.book_title}.
                    </DialogDescription>
                  </DialogHeader>
                  <Label>
                    Topics <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    placeholder="Enter topic..."
                    value={topics.topics}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setTopics((prev) => ({ ...prev, topics: e.target.value }))
                    }
                  />
                  <Label>Links</Label>
                  <Input
                    placeholder="Enter link..."
                    value={topics.links}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setTopics((prev) => ({ ...prev, links: e.target.value }))
                    }
                  />
                  <div className="flex gap-3 items-center">
                    <Label>Deadline:</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <div className="relative w-[200px]">
                          <Button
                            type="button"
                            variant="outline"
                            className="w-full justify-start cursor-pointer"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date
                              ? format(date, 'MMMM dd, yyyy')
                              : 'Pick a date'}
                          </Button>
                          {date && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute top-1/2 right-0 -translate-y-1/2"
                              onClick={handleResetDate}
                            >
                              <X />
                            </Button>
                          )}
                        </div>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={(d) => {
                            setDate(d)
                            if (d)
                              setTopics((prev) => ({
                                ...prev,
                                deadline: format(d, 'MMMM d, yyyy'),
                              }))
                          }}
                          autoFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button
                      className="bg-yellow-300 hover:bg-yellow-300/80 cursor-pointer"
                      onClick={handleSubmitTopics}
                    >
                      Add Topic
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}

            {/* Add Books */}
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full text-yellow-700 hover:bg-yellow-50 bg-yellow-100 cursor-pointer"
                >
                  + Add Books
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Module</DialogTitle>
                  <DialogDescription>
                    Create a reviewer module. Click Create when done.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4">
                  <div className="grid gap-3">
                    <Label>Module</Label>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          className="flex justify-start w-fit cursor-pointer bg-yellow-200 hover:bg-yellow-200/90"
                        >
                          Select Book Type: {selectBook.book_type || 'None'}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        {availableModules.length > 0 ? (
                          availableModules.map((m) => (
                            <DropdownMenuItem
                              key={m}
                              className="text-yellow-700 bg-yellow-200 mb-1 cursor-pointer"
                              onSelect={() =>
                                setSelectBook({ ...selectBook, book_type: m })
                              }
                            >
                              {m}
                            </DropdownMenuItem>
                          ))
                        ) : (
                          <DropdownMenuItem
                            disabled
                            className="text-muted-foreground text-sm"
                          >
                            All NP books created
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="grid gap-3">
                    <Label>Book Title</Label>
                    <Input
                      placeholder="e.g. Fundamentals of Nursing"
                      value={selectBook.book_title}
                      onChange={(e) =>
                        setSelectBook({
                          ...selectBook,
                          book_title: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    onClick={handleSubmitBook}
                    className="bg-yellow-300 hover:bg-yellow-300/70 cursor-pointer"
                  >
                    {createBook.isPending ? (
                      <>
                        <span>Adding...</span>
                        <LoaderIcon className="animate-spin ml-2" />
                      </>
                    ) : (
                      'Save'
                    )}
                  </Button>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* ── Main content — shows only active NP book ── */}
        <div className="flex flex-col mr-5 w-full gap-4">
          {activeBook ? (
            <section className="flex flex-col w-full">
              <Card className="flex flex-col w-full p-4 border-yellow-400 gap-3">
                {/* Book header */}
                <div className="flex justify-between items-start mx-2">
                  <div>
                    <span className="text-yellow-700 text-xl font-medium">
                      {activeBook.book_type} : {activeBook.book_title}
                    </span>
                    {/* Overall progress bar under title (NEW) */}
                    <div className="flex items-center gap-3 mt-1.5">
                      <Progress
                        value={bookProgress(activeBook)}
                        className="w-40 h-1.5 [&>div]:bg-yellow-400"
                      />
                      <span className="text-xs text-muted-foreground">
                        {bookProgress(activeBook)}% complete
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-row gap-2">
                    {/* Add Subtopic */}
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <Button className="flex flex-row items-center bg-yellow-200 text-yellow-700 hover:bg-yellow-200/80 cursor-pointer">
                          <BookOpenCheck color="var(--color-yellow-600)" />
                          + Subtopic <ChevronDown className="ml-1 h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        {activeBook.topics?.map((row: any) => (
                          <Sheet key={row.topic_id}>
                            <SheetTrigger asChild>
                              <DropdownMenuItem
                                className="flex bg-yellow-200 text-yellow-700 hover:bg-yellow-200/80 cursor-pointer mb-1 font-medium"
                                onSelect={(e) => e.preventDefault()}
                                onClick={() =>
                                  setSubTopics((prev) => ({
                                    ...prev,
                                    topic_id: row.topic_id,
                                  }))
                                }
                              >
                                <BookOpen className="w-4 h-4 text-yellow-600 mr-2" />
                                {row.topics}
                              </DropdownMenuItem>
                            </SheetTrigger>
                            <SheetContent>
                              <SheetHeader>
                                <SheetTitle>Add Subtopic</SheetTitle>
                                <SheetDescription>
                                  Under: {row.topics}
                                </SheetDescription>
                              </SheetHeader>
                              <div className="grid flex-1 auto-rows-min gap-6 px-4">
                                <div className="grid gap-3">
                                  <Label>Subtopic</Label>
                                  <Input
                                    placeholder="Enter subtopic..."
                                    onChange={(
                                      e: ChangeEvent<HTMLInputElement>,
                                    ) =>
                                      setSubTopics({
                                        ...subTopics,
                                        topics: e.target.value,
                                      })
                                    }
                                  />
                                </div>
                                <div className="grid gap-3">
                                  <Label>Links</Label>
                                  <Input
                                    placeholder="Enter link..."
                                    onChange={(
                                      e: ChangeEvent<HTMLInputElement>,
                                    ) =>
                                      setSubTopics({
                                        ...subTopics,
                                        links: e.target.value,
                                      })
                                    }
                                  />
                                </div>
                                <div className="flex gap-3 items-center">
                                  <Label>Deadline:</Label>
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <div className="relative w-[200px]">
                                        <Button
                                          type="button"
                                          variant="outline"
                                          className="w-full justify-start"
                                        >
                                          <CalendarIcon className="mr-2 h-4 w-4" />
                                          {date
                                            ? format(date, 'MMMM dd, yyyy')
                                            : 'Pick a date'}
                                        </Button>
                                        {date && (
                                          <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="absolute top-1/2 right-0 -translate-y-1/2"
                                            onClick={handleResetDate}
                                          >
                                            <X />
                                          </Button>
                                        )}
                                      </div>
                                    </PopoverTrigger>
                                    <PopoverContent
                                      className="w-auto p-0"
                                      align="start"
                                    >
                                      <Calendar
                                        mode="single"
                                        selected={date}
                                        onSelect={(d) => {
                                          setDate(d)
                                          if (d)
                                            setSubTopics({
                                              ...subTopics,
                                              deadline: format(
                                                d,
                                                'MMMM d, yyyy',
                                              ),
                                            })
                                        }}
                                        autoFocus
                                      />
                                    </PopoverContent>
                                  </Popover>
                                </div>
                              </div>
                              <SheetFooter>
                                <Button
                                  className="bg-yellow-300 cursor-pointer hover:bg-yellow-300/80"
                                  onClick={handleSubmitSubTopics}
                                >
                                  Save Subtopic
                                </Button>
                                <SheetClose asChild>
                                  <Button variant="outline">Close</Button>
                                </SheetClose>
                              </SheetFooter>
                            </SheetContent>
                          </Sheet>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {/* Mini stats row (NEW) */}
                <div className="grid grid-cols-3 gap-3 mx-2">
                  {[
                    {
                      label: 'Topics',
                      value: miniStats.topicCount,
                      color: 'text-yellow-700',
                    },
                    {
                      label: 'Mastered',
                      value: miniStats.mastered,
                      color: 'text-green-600',
                    },
                    {
                      label: 'Overall',
                      value: `${miniStats.overall}%`,
                      color:
                        miniStats.overall >= 75
                          ? 'text-green-600'
                          : miniStats.overall > 0
                            ? 'text-amber-600'
                            : 'text-red-500',
                    },
                  ].map(({ label, value, color }) => (
                    <div
                      key={label}
                      className="bg-yellow-50 border border-yellow-200 rounded-lg p-3"
                    >
                      <div className="text-xs text-yellow-700 flex items-center gap-1 mb-1">
                        {label}
                      </div>
                      <div className={`text-xl font-semibold ${color}`}>
                        {value}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Search bar (NEW) */}
                <div className="relative mx-2">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search topics or subtopics..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-sm border border-yellow-200 rounded-lg bg-yellow-50 focus:outline-none focus:ring-1 focus:ring-yellow-400 placeholder:text-muted-foreground"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>

                {/* Table */}
                <BookTable bookId={activeBook.book_id} />
              </Card>
            </section>
          ) : (
            <Card className="flex w-full p-10 border-yellow-400 justify-center items-center flex-col gap-3">
              <span className="text-5xl">📚</span>
              <p className="text-yellow-700 font-medium text-lg">
                No book for {activeNP} yet.
              </p>
              <p className="text-muted-foreground text-sm">
                Click "+ Add Books" in the sidebar to create one.
              </p>
            </Card>
          )}

          {/* Alert Dialog for status update */}
          <AlertDialog open={openAlert} onOpenChange={setOpenAlert}>
            <AlertDialogPopup>
              <AlertDialogHeader>
                <AlertDialogTitle>Update status?</AlertDialogTitle>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogClose
                  render={<Button variant="ghost" className="cursor-pointer" />}
                >
                  Cancel
                </AlertDialogClose>
                <AlertDialogClose
                  render={
                    <Button
                      className="bg-yellow-300 cursor-pointer hover:bg-yellow-300/80"
                      onClick={handleUpdateStatus}
                    />
                  }
                >
                  Update Status
                </AlertDialogClose>
              </AlertDialogFooter>
            </AlertDialogPopup>
          </AlertDialog>
        </div>
      </div>
    </div>
  )
}

export default Reviewer
