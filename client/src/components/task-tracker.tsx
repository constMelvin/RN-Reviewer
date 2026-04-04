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
} from 'lucide-react'
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
import { useMemo, useRef, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { FcCalendar } from 'react-icons/fc'

import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { format } from 'date-fns'
import { Card, CardContent, CardTitle } from './ui/card'
import { TextLoop } from './ui/text-loop'
import { SlidingNumber } from './ui/slider-number'
import { useCreateTasks, useTasks, useUpdateTasks } from '@/hooks/use-task'
import type { Task } from '@/@types/task'
import { useAuthStore } from '@/store/authStore'

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

export const columns: ColumnDef<Task>[] = [
  {
    id: 'select',
    header: () => (
      <div className="flex gap-1 items-center">
        <Check size={16} />
        Done
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
                task_name: row.original.task_name,
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
    header: ({ column }) => {
      return (
        <div className="flex items-center">
          <div className="flex gap-1 items-center">
            <ALargeSmall size={16} strokeWidth={'3'} color="grey" /> Name
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                className="flex item-center justify-center"
                variant="ghost"
              >
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                className="flex items-center cursor-pointer"
                onClick={() => column.toggleSorting(false)}
              >
                <ArrowUpDown className="h-4 w-4" />
                asc
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex items-center cursor-pointer" // para align sa cell
                onClick={() => column.toggleSorting(true)}
              >
                <ArrowUpDown className="h-4 w-4" />
                desc
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {/* <Button
              variant="ghost"
              className="flex items-center cursor-pointer" // para align sa cell
              onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
              <ArrowUpDown className="h-4 w-4" />
            </Button> */}
        </div>
      )
    },
    cell: ({ row }) => (
      <div className="flex items-center">{row.getValue('task_name')}</div>
    ),
  },

  {
    accessorKey: 'task_type',
    header: () => (
      <div className="flex gap-1 items-center">
        <Type size={16} />
        Types
      </div>
    ),
    cell: ({ row }) => {
      const type = row.getValue('task_type') as Task['task_type']

      const currTypes = typeOptions.find((opt) => opt.value === type)

      return (
        <Badge className={`${currTypes?.className} shadow-none rounded-full`}>
          <div className="h-1.5 w-1.5 rounded-full bg-current mr-2" />{' '}
          {currTypes?.label}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'task_date',
    header: () => (
      <div className="flex gap-1 items-center">
        <FcCalendar size={16} />
        Due Date
      </div>
    ),
    cell: ({ row }) => <div className="">{row.getValue('task_date')}</div>,
  },
  {
    accessorKey: 'task_link',
    header: () => (
      <div className="flex gap-1 items-center">
        <Link size={16} />
        Links
      </div>
    ),
    cell: ({ row }) => (
      <a
        href={row.getValue('task_link')}
        target="_blank"
        rel="noopener noreferrer"
        className="hover:underline hover:text-blue-500"
      >
        {row.getValue('task_link')}
      </a>
    ),
  },
]
const Quotes = [
  'Believe in yourself and all that you are. Know that there is something inside you greater than any obstacle. – Christian D. Larson',
  'Success in the PNLE is not about luck, but about preparation, perseverance, and prayer.',
  'Do not let what you cannot do interfere with what you can do. Focus and conquer the PNLE. – John Wooden',
  'The future belongs to those who prepare for it today. Review wisely, trust yourself, and claim your RN license. – Malcolm X',
  'A nurse’s real exam is not on paper, but in how you touch lives. The PNLE is just the beginning.',
  'Push yourself, because no one else is going to do it for you. – Unknown',
  'Don’t watch the clock; do what it does. Keep going. – Sam Levenson',
  'The harder you work for something, the greater you’ll feel when you achieve it.',
  'Dream big, work hard, stay focused, and surround yourself with good energy. That’s the PNLE mindset.',
  'It always seems impossible until it’s done. – Nelson Mandela',
]

const TaskTracker = () => {
  const queryTask = useTasks()
  const createTask = useCreateTasks()
  const { user } = useAuthStore()

  console.log(user)
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

  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [timer, setTimer] = useState({
    seconds: 0,
    minutes: 0,
  })
  const [newTask, setNewTask] = useState({
    task_name: '',
    task_link: '',
    task_type: 'Lecture',
    task_date: '',
  })
  const intervalRef = useRef<number | null>(null)
  const table = useReactTable({
    data: rows,
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
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  const handleStartTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current)

    intervalRef.current = window.setInterval(() => {
      setTimer((prev) => {
        if (prev.seconds === 0) {
          if (prev.minutes === 0) {
            clearInterval(intervalRef.current!)
            intervalRef.current = null
            console.log('Tapos na pahinga kupal!!!')
            return prev
          }
          return { minutes: prev.minutes - 1, seconds: 59 }
        }
        return { ...prev, seconds: prev.seconds - 1 }
      })
    }, 1000)
  }
  const handleStopTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
      console.log('Timer stopped!')
    }
  }

  const handleReset = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault()
    setDate(undefined)
  }

  const handleSubmit = async () => {
    createTask.mutate({
      ...newTask,
      task_date: date ? format(date, 'MMMM d, yyyy') : '',
    })
    setNewTask({
      task_name: '',
      task_link: '',
      task_type: 'Lecture',
      task_date: '',
    })

    setDate(undefined)
  }

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-5 p-4 md:p-6 max-w-full overflow-x-hidden">
        <div className="flex flex-col gap-5 w-full min-w-0">
          <div className="w-full h-fit p-5 bg-white rounded-lg shadow-lg border border-yellow-200">
            <div className="font-bold text-xl text-gray-900">Task Tracker</div>
            <div className="flex items-center gap-2 py-4">
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
                    .map((column) => {
                      return (
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
                      )
                    })}
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
                        className="h-15 text-center"
                      >
                        No results.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            {/* Create new task row */}
            <div className="flex items-center justify-end space-x-2 py-4 px-2">
              <div className="flex-1 text-sm text-muted-foreground">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant={'ghost'} className="cursor-pointer">
                      <Plus /> new table row...
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Create Task</DialogTitle>
                      <DialogDescription>
                        Create your task here. Click save when
                        you&apos;re done.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4">
                      <div className="grid gap-3">
                        <Label htmlFor="name-1">Name: </Label>
                        <Input
                          id="name-1"
                          name="name"
                          required
                          placeholder="Enter name"
                          value={newTask.task_name}
                          onChange={(e) =>
                            setNewTask((prev) => ({
                              ...prev,
                              task_name: e.target.value,
                            }))
                          }
                        />
                      </div>

                      <div className="grid gap-3">
                        <Label htmlFor="name-1">Link:</Label>
                        <Input
                          id="link"
                          required
                          name="link"
                          placeholder="Input link or copy link here..."
                          value={newTask.task_link}
                          onChange={(e) =>
                            setNewTask((prev) => ({
                              ...prev,
                              task_link: e.target.value,
                            }))
                          }
                        />
                      </div>

                      <div className="flex gap-3">
                        {/* <Label htmlFor="username-1"></Label> */}
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            className="flex justify-start w-fit cursor-pointer"
                            asChild
                          >
                            <Button variant="outline">
                              Selected type: {newTask.task_type}
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <RadioGroup
                              defaultValue={newTask.task_type}
                              onValueChange={(value) =>
                                setNewTask((prev) => ({
                                  ...prev,
                                  task_type: value,
                                }))
                              }
                              className="flex items-center gap-3"
                            >
                              {radioOptions.map((opt) => (
                                <div
                                  key={opt.value}
                                  className="flex items-center space-x-2 cursor-pointer"
                                >
                                  <RadioGroupItem
                                    value={opt.value}
                                    id={opt.value}
                                    className={opt.className}
                                  />
                                  <Label htmlFor={opt.value}>{opt.label}</Label>
                                </div>
                              ))}
                            </RadioGroup>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <div className="flex gap-3">
                        <Label htmlFor="name-1">Select Date: </Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <div className="relative w-[250px]">
                              <Button
                                type="button"
                                variant="outline"
                                className="w-full cursor-pointer"
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
                                  onClick={handleReset}
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
                              onSelect={setDate}
                              autoFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                      </DialogClose>
                      <Button
                        className="bg-yellow-400 hover:bg-yellow-400/90 cursor-pointer"
                        onClick={handleSubmit}
                      >
                        Save changes
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
          {/* Take a break card. */}
          <Card className="flex h-72 border border-yellow-400">
            <CardTitle className="text-2xl font-medium text-center">
              TAKE A BREAK
            </CardTitle>
            <CardContent className="space-y-4">
              <div className="flex flex-row gap-2 items-center justify-center">
                <Button
                  className="rounded-full bg-transparent text-black border border-gray-400 hover:bg-gray-400/85"
                  onClick={() => {
                    handleStopTimer()
                    setTimer({ ...timer, minutes: 25, seconds: 0 })
                  }}
                >
                  Short Break
                </Button>
                <Button
                  className="rounded-full bg-transparent text-black border border-gray-400 hover:bg-gray-400/85"
                  onClick={() => setTimer({ ...timer, minutes: 60 })}
                >
                  {' '}
                  Long Break
                </Button>
              </div>
              <div className="flex flex-row items-center justify-center font-mono gap-2 text-7xl font-bold">
                <SlidingNumber value={timer.minutes} padStart />
                <span>:</span>
                <SlidingNumber value={timer.seconds} padStart />
              </div>
              <div className="flex flex-row gap-2 items-center justify-center">
                <Button
                  className="rounded-full bg-transparent text-black border border-gray-400 hover:bg-gray-400/85"
                  onClick={handleStartTimer}
                >
                  Start
                </Button>
                <Button
                  className="rounded-full bg-transparent text-black border border-gray-400 hover:bg-gray-400/85"
                  onClick={() => setTimer({ ...timer, minutes: 0, seconds: 0 })}
                >
                  <TimerReset />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="relative justify-center mx-auto flex-col gap-10 max-w-[600px] overflow-hidden">
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

          <Card className="relative h-[480px] rounded-xl shadow-lg overflow-hidden border-yellow-400">
            <img
              src="https://imgs.search.brave.com/EDC_TCNLdqZ56Nvw7XVuBhmTS0REwppCr9bHWTvqtDQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/dmVjdG9yc3RvY2su/Y29tL2kvcHJldmll/dy0xeC83NS85NS9k/ZWZhdWx0LXBsYWNl/aG9sZGVyLWJ1c2lu/ZXNzd29tYW4taGFs/Zi1sZW5ndGgtcG9y/LXZlY3Rvci0yMDg0/NzU5NS5qcGc"
              alt="profile"
              className="absolute inset-0 h-full w-full object-center"
            />
          </Card>
        </div>
      </div>
    </>
  )
}

export default TaskTracker
