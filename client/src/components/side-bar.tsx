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
import { useEffect, useRef, useState } from 'react'
import { format } from 'date-fns'
import { Separator } from './ui/separator'
import { Button } from './ui/button'
import { LogOutIcon, Settings, Stethoscope } from 'lucide-react'
import {
  FcAlarmClock,
  FcBullish,
  FcReadingEbook,
  FcSupport,
} from 'react-icons/fc'
import { FaArrowUpFromBracket } from 'react-icons/fa6'
import { BsFillClipboardDataFill } from 'react-icons/bs'
import { Checkbox } from './ui/checkbox'
import { Input } from './ui/input'
import { Link, useNavigate } from '@tanstack/react-router'
import { signOut } from '@/lib/auth-client'
import { router } from '@/main'

const SideBar = () => {
  const [hours, setHours] = useState(new Date().getHours())
  const [minutes, setMinutes] = useState(new Date().getMinutes())
  const [seconds, setSeconds] = useState(new Date().getSeconds())
  const [checkedTasks, setCheckedTasks] = useState<Set<number>>(new Set())
  const [daysLeft, setDaysLeft] = useState(0)
  const getToday = () => new Date().toISOString().split('T')[0]
  const isFirstRender = useRef(true)
  const [tasks, setTasks] = useState<string[]>([])
  const [input, setInput] = useState('')
  const navigate = useNavigate()

  const handleLogout = async () => {
    await signOut()
    router.navigate({ to: '/login' })
  }
  const toggleTask = (index: number) => {
    setCheckedTasks((prev) => {
      const next = new Set(prev)
      next.add(index) // no toggle, since you disable after checking
      return next
    })
  }

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('tasks') || 'null')

    if (!data || data.date !== getToday()) {
      localStorage.setItem(
        'tasks',
        JSON.stringify({ date: getToday(), tasks: [], checked: [] }),
      )
      setTasks([])
      setCheckedTasks(new Set())
    } else {
      setTasks(data.tasks)
      setCheckedTasks(new Set(data.checked ?? []))
    }
  }, [])

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    localStorage.setItem(
      'tasks',
      JSON.stringify({
        date: getToday(),
        tasks,
        checked: [...checkedTasks],
      }),
    )
  }, [tasks, checkedTasks])

  useEffect(() => {
    const interval = setInterval(() => {
      setHours(new Date().getHours())
      setMinutes(new Date().getMinutes())
      setSeconds(new Date().getSeconds())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const targetDate = new Date('2026-08-29')

    const interval = setInterval(() => {
      const now = new Date()
      const diff = targetDate.getTime() - now.getTime()
      setDaysLeft(Math.ceil(diff / (1000 * 60 * 60 * 24)))
    }, 1000) // update every second

    return () => clearInterval(interval)
  }, [])

  const onClickTask = () => {
    if (!input.trim()) return

    setTasks((prev) => [...prev, input])
    setInput('')
  }

  return (
    <Sidebar collapsible="icon" variant="inset">
      {/* Header */}
      <SidebarHeader className="bg-yellow-100">
        <div className="flex flex-row gap-2 items-center justify-center">
          <Stethoscope size={30} className="text-yellow-600" />
          <span className="flex flex-row font-story text-[28px] font-bold items-center justify-center text-yellow-700">
            PNLE {new Date().getFullYear()}
          </span>
        </div>
        <div className="flex justify-center gap-2 font-mono">
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center h-15 w-25 rounded-md bg-yellow-300 text-5xl text-white">
              {daysLeft}
            </div>
            <span className="font-bold">{daysLeft <= 1 ? 'Day' : 'Days'}</span>
          </div>
          <div className="flex items-center justify-center mt-5 h-10 w-25 rounded-md bg-yellow-300 text-lg font-bold text-white">
            to go
          </div>
        </div>
        <Separator className="my-1 bg-yellow-300" />
        <div className="flex flex-col w-full text-lg font-bold text-gray-700">
          <Card className="items-center w-full mb-2 bg-transparent border-none shadow-none p-1 text-yellow-600">
            {format(new Date(), 'EEEE, MM-dd-yyyy')}
          </Card>
          <div className="flex flex-row w-full font-mono">
            <Card className="flex-row w-full justify-center items-center py-4 px-2 bg-yellow-50 border border-yellow-200 shadow-sm gap-3">
              <SlidingNumber value={hours % 12 || 12} padStart={true} />
              <span className="text-yellow-600 mb-1">:</span>
              <SlidingNumber value={minutes} padStart={true} />
              <span className="text-yellow-600 mb-1">:</span>
              <SlidingNumber value={seconds} padStart={true} />
              <span className="flex text-yellow-700">
                {hours >= 12 ? 'PM' : 'AM'}
              </span>
            </Card>
          </div>
        </div>
      </SidebarHeader>

      {/* Content */}
      <SidebarContent className="!bg-white">
        {/* Today Task */}
        <SidebarGroup className="flex flex-col">
          <div className="flex flex-row items-center justify-start gap-2 text-yellow-600">
            <FcAlarmClock size={25} />
            <span className="text-[13px] font-mono">
              Today task | {format(new Date(), 'EEEE')}
            </span>
          </div>
          <div className="flex flex-col my-2 gap-2 font-mono text-sm w-full">
            {tasks.length === 0 ? (
              <div className="flex items-center justify-center text-gray-400 italic">
                No task
              </div>
            ) : (
              tasks.map((task, i) => {
                const isChecked = checkedTasks.has(i)
                return (
                  <div key={i} className="flex flex-row items-center gap-2">
                    <Checkbox
                      checked={isChecked}
                      disabled={isChecked}
                      onCheckedChange={() => toggleTask(i)}
                    />

                    <span
                      className={`truncate ${
                        isChecked
                          ? 'line-through cursor-not-allowed text-gray-400'
                          : 'text-yellow-800'
                      }`}
                    >
                      {task}
                    </span>
                  </div>
                )
              })
            )}
          </div>

          <div className="flex flex-row items-center gap-1">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="New Task..."
              className="border-yellow-300 placeholder:text-gray-400 focus-visible:ring-0 focus-visible:border-yellow-400 h-7"
            />
            <Button
              variant={'outline'}
              className="cursor-pointer h-7 border-yellow-400 text-yellow-600 hover:bg-yellow-100"
              onClick={onClickTask}
            >
              <FaArrowUpFromBracket />
            </Button>
          </div>
        </SidebarGroup>

        {/* Study Directory */}
        <SidebarGroup className="flex flex-col bg-yellow-50">
          <SidebarGroupLabel className="flex justify-start items-center gap-2 text-yellow-700">
            <FcSupport /> Study Directory
          </SidebarGroupLabel>

          <SidebarGroupContent className="font-sans font-semibold text-yellow-800">
            <SidebarMenu>
              <SidebarMenuItem className="flex items-center gap-2">
                <FcReadingEbook size={20} />
                <Link to="/reviewer" className="hover:text-yellow-600">
                  <span className="font-mono text-lg">Reviewer Books</span>
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem className="flex items-center gap-2">
                <BsFillClipboardDataFill
                  size={20}
                  color="var(--color-yellow-600)"
                />
                <Link to="/" className="hover:text-yellow-600">
                  <span className="font-mono text-lg">Task Tracker</span>
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem className="flex items-center gap-2">
                <FcBullish size={20} />
                <Link to="/score-task" className="hover:text-yellow-600">
                  <span className="font-mono text-lg">Score Tracker</span>
                </Link>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter>
        <div className="flex gap-2 w-full">
          <Button
            variant={'outline'}
            className="flex-1 items-center justify-center cursor-pointer border-yellow-400 text-yellow-600 hover:bg-yellow-100"
            onClick={handleLogout}
          >
            <LogOutIcon className="mr-1" />
            <span>Logout</span>
          </Button>
          <Button
            variant={'outline'}
            className="items-center justify-center cursor-pointer border-yellow-400 text-yellow-600 hover:bg-yellow-100"
            onClick={() =>
              navigate({
                to: '/profile',
              })
            }
          >
            <Settings />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}

export default SideBar
