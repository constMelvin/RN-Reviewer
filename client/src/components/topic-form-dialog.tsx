import React, { useState, useEffect, type ChangeEvent } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CalendarIcon, X } from 'lucide-react'
import { format } from 'date-fns'

export interface TopicFormData {
  topics: string
  links: string
  deadline: string
}

interface TopicFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: TopicFormData) => void
  initialData?: Partial<TopicFormData>
  title?: string
  description?: string
  inputLabel?: string
}

export function TopicFormDialog({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  title = 'Add New Topic',
  description = 'Create a new topic.',
  inputLabel = 'Topics',
}: TopicFormDialogProps) {
  const [formData, setFormData] = useState<TopicFormData>({
    topics: '',
    links: '',
    deadline: '',
  })
  const [date, setDate] = useState<Date | undefined>()

  useEffect(() => {
    if (open) {
      setFormData({
        topics: initialData?.topics || '',
        links: initialData?.links || '',
        deadline: initialData?.deadline || '',
      })
      setDate(initialData?.deadline ? new Date(initialData.deadline) : undefined)
    }
  }, [open, initialData])

  const handleSubmit = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label>
              {inputLabel} <span className="text-destructive">*</span>
            </Label>
            <Input
              placeholder={`Enter ${inputLabel.toLowerCase()}...`}
              value={formData.topics}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setFormData((prev) => ({ ...prev, topics: e.target.value }))
              }
            />
          </div>
          <div className="grid gap-2">
            <Label>Links</Label>
            <Input
              placeholder="Enter link..."
              value={formData.links}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setFormData((prev) => ({ ...prev, links: e.target.value }))
              }
            />
          </div>
          <div className="grid gap-2">
            <Label>Deadline:</Label>
            <Popover>
              <PopoverTrigger asChild>
                <div className="relative w-full sm:w-[200px]">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full justify-start cursor-pointer font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, 'MMMM dd, yyyy') : <span>Pick a date</span>}
                  </Button>
                  {date && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute top-1/2 right-0 -translate-y-1/2 h-8 w-8 p-0"
                      onClick={(e) => {
                        e.preventDefault()
                        setDate(undefined)
                        setFormData((prev) => ({ ...prev, deadline: '' }))
                      }}
                    >
                      <X className="h-4 w-4" />
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
                    if (d) {
                      setFormData((prev) => ({
                        ...prev,
                        deadline: format(d, 'MMMM d, yyyy'),
                      }))
                    }
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            className="bg-yellow-300 hover:bg-yellow-300/80 text-black cursor-pointer"
            onClick={handleSubmit}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
