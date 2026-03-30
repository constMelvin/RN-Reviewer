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
import { format } from 'date-fns'
import { Calendar } from '@/components/ui/calendar'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { FcBarChart, FcCalendar, FcDocument, FcOk } from 'react-icons/fc'
import { useBooks, useCreateBook } from '@/hooks/use-book'
import type { BookSubTopics, BookTopics } from '@/@types/books'
import type { ExpandedState } from '@tanstack/react-table'
import { useCreateTopics } from '@/hooks/use-topics'
import { useCreateSubTopics, useUpdateSubTopics } from '@/hooks/use-sub-topics'

export type Data = BookTopics & {
  subtopics?: BookSubTopics[]
}

export type TableRow = BookTopics | BookSubTopics

export type Topics = {
  id: string
  topics: string
  deadline: string | null
  done?: boolean
  links?: string
}

export type SubTopics = {
  id: string
  topics: string
  deadline: string | null
  status: 'Studying' | 'Not Started' | 'Mastered'
  done?: boolean
  links?: string
}

const Reviewer = () => {
  const createBook = useCreateBook()
  const { data: book } = useBooks()
  const createTopic = useCreateTopics()
  const createSubTopic = useCreateSubTopics()
  const updateSubTopic = useUpdateSubTopics()

  const sortedBook = useMemo(() => {
    if (!book) return []

    return (
      [...book].sort((a, b) => {
        return (
          parseInt(a.book_type.replace('NP', ''), 10) -
          parseInt(b.book_type.replace('NP', ''), 10)
        )
      }) || []
    )
  }, [book])

  const [date, setDate] = useState<Date | undefined>()
  const getHref = (link: string) => {
    if (!link) return '#'

    // Ensure https://
    let url =
      link.startsWith('http://') || link.startsWith('https://')
        ? link
        : `https://${link}`

    // Add .com if missing (ignore if url already has .com)
    // Para hindi maapektuhan ang path, titingnan lang ang hostname part
    try {
      const parsed = new URL(url)
      if (!parsed.hostname.includes('.')) {
        parsed.hostname += '.com'
        url = parsed.toString()
      }
    } catch (e) {
      // fallback kung invalid URL, just add .com sa dulo
      if (!url.includes('.')) {
        url += '.com'
      }
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

  const moduleArr = ['NP1', 'NP2', 'NP3', 'NP4', 'NP5']
  const [selectBook, setSelectBook] = useState({
    book_type: '',
    book_title: '',
  })

  const rows: Data[] = useMemo(() => {
    if (!sortedBook) return []

    const result = sortedBook.flatMap((book) => {
      if (!book.topics) return []

      return book.topics.map((topic) => ({
        ...topic,
        subtopics: (topic.subtopics || []).map((sub) => ({
          ...sub,
          subtopics: undefined, // Ensure subtopics can't expand
        })) as BookSubTopics[],
      }))
    })

    return result
  }, [sortedBook])

  const statusType: Record<string, React.ReactNode> = {
    Mastered: (
      <Badge className="bg-emerald-600/10 dark:bg-emerald-600/20 hover:bg-emerald-600/10 text-emerald-500 border-emerald-600/60 shadow-none rounded-full gap-2 cursor-pointer">
        <Check className="text-emerald-500" />
        Mastered
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

  const columns: ColumnDef<Data>[] = [
    // select
    {
      id: 'select',
      size: 70,
      enableResizing: false,
      header: () => (
        <div className="flex items-center justify-center gap-1 ml-2">
          <FcOk size={16} color="green" />
          Done
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-center">
          {' '}
          <Checkbox
            className="cursor-not-allowed data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
            checked={row.original.done ?? false}
            aria-label="Select row"
          />
        </div>
      ),
      enableSorting: false,
      enableHiding: false,

      // meta: { className: 'w-[40px]' },
    },
    // expander
    {
      id: 'expander',
      size: 50,
      enableResizing: false,
      header: () => (
        <div className="flex items-center mr-0">
          <ChevronDown />
        </div>
      ),
      cell: ({ row }) => {
        const canExpand = row.getCanExpand()
        const hasSubtopics =
          row.original.subtopics && row.original.subtopics.length > 0

        return canExpand && hasSubtopics ? (
          <button
            className="cursor-pointer"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              console.log('Toggling row:', row.original.topics)
              row.getToggleExpandedHandler()()
            }}
          >
            {row.getIsExpanded() ? <ChevronDown /> : <ChevronRight />}
          </button>
        ) : null
      },
    },
    // topic
    {
      accessorKey: 'topics',
      size: 300,
      minSize: 200,
      maxSize: 400,
      header: () => (
        <div className="flex items-center gap-1">
          <FcDocument size={16} />
          Topics
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center ml-5 text-sm font-medium">
          {row.getValue('topics')}
        </div>
      ),
    },
    // status
    {
      accessorKey: 'status',
      size: 180,
      minSize: 150,
      maxSize: 220,
      header: () => (
        <div className="flex items-center gap-1">
          <FcBarChart size={16} /> Status
        </div>
      ),
      cell: ({ row }) => {
        const isSubtopic = 'subtopic_id' in row.original
        if (isSubtopic) {
          const sub = row.original as unknown as BookSubTopics
          return (
            <>
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
            </>
          )
        }

        const subTopics = row.original.subtopics || []
        const totalCounts = subTopics.filter(
          (sT) => sT.status === 'Mastered',
        ).length
        const totalSubTopics = subTopics.length
        const value =
          totalCounts > 0 ? Math.floor((totalCounts / totalSubTopics) * 100) : 0

        return (
          <div className="flex items-center gap-2 font-medium text-sm">
            <Progress value={value} className="w-[60%] [&>div]:bg-yellow-500" />
            {value}%
          </div>
        )
      },
      // meta: { className: 'w-[260px]' },
    },
    // deadline
    {
      accessorKey: 'deadline',
      size: 120,
      minSize: 100,
      maxSize: 200,
      header: () => (
        <div className="flex items-center gap-1">
          <FcCalendar size={16} /> Deadline
        </div>
      ),
      cell: ({ row }) => {
        // const [newDate, setNewDate] = useState(new Date())
        const deadlineValue = row.getValue('deadline') as string | null
        return (
          <div className="flex items-center">
            {deadlineValue ? (
              <Popover>
                <PopoverTrigger asChild>
                  <div className="relative">
                    <span className="flex justify-start item-start w-full border-none shadow-none cursor-pointer">
                      {deadlineValue}
                    </span>
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={date} autoFocus />
                </PopoverContent>
              </Popover>
            ) : (
              <Popover>
                <PopoverTrigger asChild>
                  <div className="relative">
                    <span className="flex item-center w-full border-none shadow-none cursor-pointer">
                      Insert a deadline dates.
                    </span>
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={date} autoFocus />
                </PopoverContent>
              </Popover>
            )}
          </div>
        )
      },
      // meta: { className: 'w-[100px]' },
    },
    // links
    {
      accessorKey: 'links',
      size: 100,
      minSize: 150,
      maxSize: 300,
      header: () => (
        <div className="flex items-center gap-1">
          <Link2 size={16} />
          Links
        </div>
      ),
      cell: ({ row }) => {
        const linkValue = row.getValue('links') as string | null

        return (
          <div className="flex items-center max-w-[150px]">
            {linkValue ? (
              <a
                href={getHref(linkValue)}
                rel="noopener noreferrer"
                target="_blank"
                className="hover:text-blue-600 hover:underline truncate whitespace-nowrap overflow-hidden"
              >
                {linkValue}
              </a>
            ) : (
              <Dialog>
                <DialogTrigger asChild>
                  <span className="hover:opacity-70 cursor-pointer text-muted-foreground">
                    Insert drive links here...
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
                      variant={'outline'}
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

  const BookTable = ({ bookId }: { bookId: string }) => {
    const [expanded, setExpanded] = useState<ExpandedState>({})

    // Filter topics for THIS specific book only
    const bookTopics = useMemo(() => {
      const filtered = rows.filter((topic) => topic.book_id === bookId)
      return filtered
    }, [bookId, rows])

    const table = useReactTable<Data>({
      data: bookTopics,
      columns,
      getCoreRowModel: getCoreRowModel(),
      getExpandedRowModel: getExpandedRowModel(),
      getSubRows: (row) => {
        if ('topic_id' in row && row.subtopics) {
          return row.subtopics as any
        }
        return undefined
      },
      state: {
        expanded,
      },
      onExpandedChange: setExpanded,
    })

    // Show empty state if no topics
    if (bookTopics.length === 0) {
      return (
        <div className="grid w-full p-8 border rounded bg-gray-50">
          <p className="text-center text-gray-500">
            No topics yet. Click "Topics" button above to add topics.
          </p>
        </div>
      )
    }

    return (
      <div className="grid w-full [&>div]:max-h-80 [&>div]:border [&>div]:rounded">
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
          <TableBody className="overflow-hidden">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className={row.depth > 0 ? 'bg-gray-50' : 'bg-white'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={row.depth > 0 ? 'pl-12' : ''}
                    >
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
                  className="h-15 text-center"
                >
                  No topics found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    )
  }

  // const table = useReactTable<Data>({
  //   data: rows,
  //   columns,
  //   getCoreRowModel: getCoreRowModel(),
  //   getExpandedRowModel: getExpandedRowModel(), // ← CRITICAL!
  //   getSubRows: (row) => {
  //     // Critical: only return subtopics for parent rows
  //     if ('topic_id' in row && row.subtopics) {
  //       return row.subtopics as any
  //     }
  //     return undefined // Prevent subtopics from expanding
  //   },
  //   state: {
  //     expanded,
  //     // rowSelection,
  //   },
  //   onExpandedChange: setExpanded,
  //   // onRowSelectionChange: setRowSelection,
  // })

  const handleSubmitBook = (e: any) => {
    e.preventDefault()
    if (!selectBook.book_title || !selectBook.book_type) {
      alert('Please fill in both fields!')
      return
    }
    createBook.mutate(selectBook, {
      onSuccess: () => {
        setSelectBook({
          book_title: '',
          book_type: '',
        })
      },
    })
  }

  const handleResetDate = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault()
    setDate(undefined)
  }

  const handleSubmitTopics = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault()
    createTopic.mutate(topics)
    setDate(undefined)
    setTopics({
      topics: '',
      book_id: '',
      deadline: '',
      links: '',
    })
  }

  const handleSubmitSubTopics = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault()
    createSubTopic.mutate(subTopics)
    setDate(undefined)
    setSubTopics({
      topics: '',
      topic_id: '',
      links: '',
      deadline: '',
    })
  }
  const handleUpdateStatus = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault()
    updateSubTopic.mutate(updateSubTopics)
    setUpdateSubTopics({
      status: '',
      subtopic_id: '',
    })
  }

  return (
    <div className="flex flex-col w-full m-2 gap-4">
      <span className="flex items-center justify-center text-6xl font-story border w-8/12 bg-yellow-200 text-yellow-700 pl-5 py-2 mx-auto">
        PNLE CONCEPT
      </span>

      <div className="flex flex-row gap-6 w-full">
        {/* Side bar of Table Contents */}
        <div className="flex flex-col border w-96 h-fit border-yellow-400 rounded-2xl p-5 sticky top-4">
          <span className="text-yellow-700 text-4xl font-bold font-story m-2">
            Table of Contents / Books
          </span>
          <div className="flex flex-col gap-2 m-2 font-mono text-lg font-semibold">
            {sortedBook?.map((book) => (
              <a
                key={book.book_id}
                href={`#${book.book_id}`}
                className=" hover:text-yellow-600 cursor-pointer"
              >
                {book.book_type} : {book.book_title}
              </a>
            ))}
          </div>
          <span className="flex items-center justify-center">
            {/* Adding a books */}
            <Dialog>
              <DialogTrigger>
                <Button
                  variant={'ghost'}
                  className="w-full bg-transparent hover:bg-transparent text-yellow-700 hover:text-yellow-700/90 cursor-pointer"
                >
                  Add Books
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Modules</DialogTitle>
                  <DialogDescription>
                    Create reviewer modules. Click Create when you&apos;re done.
                  </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4">
                  {/* Module Dropdown */}
                  <div className="grid gap-3">
                    <Label htmlFor="module-select">Module</Label>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          id="module-select"
                          variant="outline"
                          className="flex justify-start w-fit cursor-pointer bg-yellow-200 hover:bg-yellow-200/90"
                        >
                          Select Book Type: {selectBook.book_type || 'None'}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        {moduleArr.map((m) => (
                          <DropdownMenuItem
                            key={m}
                            className="text-yellow-700 bg-yellow-200 mb-1 cursor-pointer"
                            onSelect={() =>
                              setSelectBook({
                                ...selectBook,
                                book_type: m,
                              })
                            }
                          >
                            {m}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Module Title Input */}
                  <div className="grid gap-3">
                    <Label htmlFor="module-title">Book Title</Label>
                    <Input
                      id="module-title"
                      placeholder="Enter module title (e.g., Fundamentals of Nursing)"
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
                    type="button"
                    onClick={handleSubmitBook}
                    className="bg-yellow-300 hover:bg-yellow-300/70 cursor-pointer"
                  >
                    {createBook.isPending ? (
                      <>
                        Adding Books...
                        <LoaderIcon className="animate-spin" />
                      </>
                    ) : (
                      'Save changes'
                    )}
                  </Button>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </span>
        </div>

        {/* Main Content Sections */}
        <div className="flex flex-col mr-5 w-full">
          <div className="space-y-10">
            {sortedBook.length > 0 ? (
              sortedBook?.map((book: any) => (
                <section
                  key={book.book_id}
                  id={book.book_id}
                  className="flex flex-col justify-center w-full items-start"
                >
                  <Card className="flex w-full p-4 border-yellow-400">
                    <div className="flex justify-between items-center mx-5">
                      <span className="text-yellow-700 text-2xl font-medium">
                        {book.book_type} : {book.book_title}
                      </span>
                      <div className="flex flex-row gap-2">
                        {/* Add Topics Card*/}
                        <Dialog>
                          <DialogTrigger>
                            <Button
                              className="flex flex-row items-center bg-yellow-200 text-yellow-700 hover:bg-yellow-200/80 cursor-pointer"
                              onClick={() => {
                                setTopics((prev) => ({
                                  ...prev,
                                  book_id: book.book_id,
                                }))
                              }}
                            >
                              <BookOpen className="w-4 h-4 text-yellow-600" />
                              Topics
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Add New Topic</DialogTitle>
                              <DialogDescription>
                                Create a new topic for your reviewer.
                              </DialogDescription>
                            </DialogHeader>
                            <Label>
                              Topics <span className="text-destructive">*</span>
                            </Label>
                            <Input
                              placeholder="Enter Topics..."
                              type="text"
                              value={topics.topics}
                              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                setTopics((prev) => ({
                                  ...prev,
                                  topics: e.target.value,
                                }))
                              }}
                              required
                            />
                            <Label>
                              Links <span className="text-destructive">*</span>
                            </Label>
                            <Input
                              placeholder="Enter Topics Links..."
                              type="text"
                              value={topics.links}
                              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                setTopics((prev) => ({
                                  ...prev,
                                  links: e.target.value,
                                }))
                              }}
                              required
                            />

                            <div className="flex gap-3">
                              <Label htmlFor="name-1">Select Date: </Label>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <div className="relative w-[220px]">
                                    <Button
                                      type="button"
                                      variant="outline"
                                      className="flex justify-start item-start w-full cursor-pointer"
                                    >
                                      <CalendarIcon />
                                      {date ? (
                                        format(date, 'MMMM dd, yyyy')
                                      ) : (
                                        <span>Pick a date</span>
                                      )}
                                    </Button>
                                    {date && (
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute top-1/2 -end-0 -translate-y-1/2"
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
                                    onSelect={(newDate) => {
                                      setDate(newDate)
                                      if (newDate) {
                                        setTopics((prev) => ({
                                          ...prev,
                                          deadline: format(
                                            newDate,
                                            'MMMM d, yyyy',
                                          ),
                                        }))
                                      }
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
                                type="submit"
                                className="bg-yellow-300 hover:bg-yellow-300/80 cursor-pointer"
                                onClick={handleSubmitTopics}
                              >
                                Add Topics
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>

                        {/* Adding new subtopics */}
                        <DropdownMenu>
                          <DropdownMenuTrigger>
                            <Button className="flex flex-row items-center bg-yellow-200 text-yellow-700 hover:bg-yellow-200/80 cursor-pointer">
                              <BookOpenCheck color="var(--color-yellow-600)" />
                              <span className="flex items-end gap-2">
                                New Sub Topics <ChevronDown />
                              </span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            {book.topics.map((row: any) => (
                              <Sheet key={row.id}>
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
                                    <BookOpen className="w-4 h-4 text-yellow-600" />
                                    {row.topics}
                                  </DropdownMenuItem>
                                </SheetTrigger>

                                <SheetContent>
                                  <SheetHeader>
                                    <SheetTitle>
                                      Create a review topics
                                    </SheetTitle>
                                    <SheetDescription>
                                      Click save when you&apos;re done.
                                    </SheetDescription>
                                  </SheetHeader>
                                  <div className="grid flex-1 auto-rows-min gap-6 px-4">
                                    <div className="grid gap-3">
                                      <Label htmlFor="sheet-demo-name">
                                        Topic
                                      </Label>
                                      <Input
                                        id="sheet-demo-name"
                                        placeholder="Enter Topic..."
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
                                        placeholder="Enter Links..."
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
                                    <div className="flex gap-3">
                                      <Label htmlFor="name-1">
                                        Select Date:{' '}
                                      </Label>
                                      <Popover>
                                        <PopoverTrigger asChild>
                                          <div className="relative w-[220px]">
                                            <Button
                                              type="button"
                                              variant="outline"
                                              className="flex justify-start item-start w-full"
                                            >
                                              <CalendarIcon />
                                              {date ? (
                                                format(date, 'MMMM dd, yyyy')
                                              ) : (
                                                <span>Pick a date</span>
                                              )}
                                            </Button>
                                            {date && (
                                              <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="absolute top-1/2 -end-0 -translate-y-1/2"
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
                                            onSelect={(newDate) => {
                                              setDate(newDate)
                                              if (newDate) {
                                                setSubTopics({
                                                  ...subTopics,
                                                  deadline: format(
                                                    newDate,
                                                    'MMMM d, yyyy',
                                                  ),
                                                })
                                              }
                                            }}
                                            autoFocus
                                          />
                                        </PopoverContent>
                                      </Popover>
                                    </div>
                                  </div>
                                  <SheetFooter>
                                    <Button
                                      type="submit"
                                      className="bg-yellow-300 cursor-pointer hover:bg-yellow-300/80"
                                      onClick={handleSubmitSubTopics}
                                    >
                                      Save Topics
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
                        {/* Update Subtopic */}
                        <AlertDialog
                          open={openAlert}
                          onOpenChange={setOpenAlert}
                        >
                          <AlertDialogPopup>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Are you absolutely sure to update status?
                              </AlertDialogTitle>
                              {/* <AlertDialogDescription>
                                This action cannot be undone. This will
                                permanently delete your account and remove your
                                data from our servers.
                              </AlertDialogDescription> */}
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogClose
                                render={
                                  <Button
                                    variant="ghost"
                                    className="cursor-pointer"
                                  />
                                }
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
                    <BookTable bookId={book.book_id} />
                  </Card>
                </section>
              ))
            ) : (
              <Card className="flex w-full p-6 border-yellow-400 justify-center items-center">
                <span className="text-gray-500 text-lg font-medium">
                  No books available yet.
                </span>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Reviewer
