// components/TaskDialog.tsx
import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import type { Task } from '@/@types/task'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from '@/components/ui/dropdown-menu'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { CalendarIcon, X } from 'lucide-react'

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

type TaskDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: 'create' | 'edit'
  initialData?: Task | null
  onSubmit: (data: {
    task_name: string
    task_link: string
    task_type: 'Lecture' | 'Post Test' | 'Pre-Intensive'
    task_date: string
    task_isComplete: boolean
  }) => void
}

export function TaskDialog({
  open,
  onOpenChange,
  mode,
  initialData,
  onSubmit,
}: TaskDialogProps) {
  const [date, setDate] = useState<Date>()
  const [form, setForm] = useState({
    task_name: '',
    task_link: '',
    task_date: '',
    task_type: 'Lecture' as Task['task_type'],
    task_isComplete: false,
  })

  useEffect(() => {
    if (mode === 'edit' && initialData) {
      setForm({
        task_name: initialData.task_name,
        task_link: initialData.task_link,
        task_date: initialData.task_date,
        task_type: initialData.task_type,
        task_isComplete: initialData.task_isComplete,
      })
    }
    if (mode === 'create') {
      setForm({
        task_name: '',
        task_link: '',
        task_type: 'Lecture',
        task_isComplete: false,
        task_date: '',
      })
      setDate(undefined)
    }
  }, [mode, initialData, open])

  const handleSubmit = () => {
    onSubmit({
      ...form,
      task_date: date ? format(date, 'MMMM d, yyyy') : '',
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Create Task' : 'Edit Task'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create'
              ? "Create your task here. Click save when you're done."
              : 'Update your task details below.'}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-3">
            <Label htmlFor="name-1">Name:</Label>
            <Input
              id="name-1"
              required
              placeholder="Enter name"
              value={form.task_name}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, task_name: e.target.value }))
              }
            />
          </div>

          <div className="grid gap-3">
            <Label htmlFor="link">Link:</Label>
            <Input
              id="link"
              required
              placeholder="Input link or copy link here..."
              value={form.task_link}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, task_link: e.target.value }))
              }
            />
          </div>

          <div className="flex gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger
                className="flex justify-start w-fit cursor-pointer"
                asChild
              >
                <Button variant="outline">
                  Selected type: {form.task_type}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <RadioGroup
                  value={form.task_type}
                  onValueChange={(value) =>
                    setForm((prev) => ({
                      ...prev,
                      task_type: value as Task['task_type'],
                    }))
                  }
                  className="flex items-center gap-3 p-2"
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

          <div className="flex flex-col gap-3">
            <Label>Select Date:</Label>
            <Popover>
              <PopoverTrigger asChild>
                <div className="relative w-[250px]">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full cursor-pointer justify-start"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
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
                      className="absolute top-1/2 right-0 -translate-y-1/2 h-full px-3 hover:bg-transparent"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        setDate(undefined)
                      }}
                    >
                      <X className="h-4 w-4 text-muted-foreground" />
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
            <Button variant="outline" className="cursor-pointer">
              Cancel
            </Button>
          </DialogClose>
          <Button
            className="bg-yellow-400 hover:bg-yellow-400/90 cursor-pointer"
            onClick={handleSubmit}
          >
            {mode === 'create' ? 'Save changes' : 'Update Task'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
