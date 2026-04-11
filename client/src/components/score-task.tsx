import { useMemo, useState } from 'react'
import {
  BookOpen,
  BookType,
  CheckCircle,
  FileCog,
  FilePenLine,
  Hash,
  NotebookPen,
  Plus,
  SquarePen,
  Trash2,
  TrendingUp,
  BarChart2,
  Award,
  Percent,
} from 'lucide-react'
import { Card, CardContent, CardTitle } from './ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { useCreateScore, useScore, type ScoreItem } from '@/hooks/use-score'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog'
import { Label } from './ui/label'
import { Input } from './ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'

// ─── helpers ────────────────────────────────────────────────────────────────

const EXAM_TYPES = [
  'Pre-test',
  'Unit Exam',
  'Mock Exam 1',
  'Mock Exam 2',
  'Mock Exam 3',
  'Pre-board',
  'Post-test',
]

function computeGrade(score: number, score_total: number) {
  return Math.round((score / score_total) * 100)
}

function StatusBadge({ grade }: any) {
  if (grade >= 90)
    return (
      <Badge className="bg-green-600 text-white rounded-full text-xs">
        Excellent
      </Badge>
    )
  if (grade >= 75)
    return (
      <Badge className="bg-yellow-500 text-white rounded-full text-xs">
        Passed
      </Badge>
    )
  return (
    <Badge className="bg-red-600 text-white rounded-full text-xs">
      Needs work
    </Badge>
  )
}

function GradeBar({ grade }: any) {
  const color =
    grade >= 90 ? 'bg-green-500' : grade >= 75 ? 'bg-yellow-400' : 'bg-red-500'
  return (
    <div className="flex items-center gap-2 justify-center">
      <span>{grade}</span>
      <div className="w-10 h-1.5 rounded-full bg-muted overflow-hidden inline-block">
        <div
          className={`h-full rounded-full ${color}`}
          style={{ width: `${grade}%` }}
        />
      </div>
    </div>
  )
}

// ─── main component ─────────────────────────────────────────────────────────

const ScoreTask = () => {
  const { data: score = [] } = useScore()
  const createScore = useCreateScore()

  console.log(score)
  // Fix: unique IDs, added examType field
  const [newScore, setNewScore] = useState({
    score: 0,
    score_total: 0,
    subject: '',
    exam_type: '',
  })

  const items = useMemo<ScoreItem[]>(() => {
    return (
      score.map((s) => ({
        score_id: s.score_id,
        score: s.score,
        score_total: s.score_total,
        user_id: s.user_id,
        subject: s.subject,
        exam_type: s.exam_type,
      })) ?? []
    )
  }, [score])

  const [activeExam, setActiveExam] = useState('Pre-test')
  const [activeSubject, setActiveSubject] = useState('All')

  // ── derived data ──────────────────────────────────────────────────────────

  // Only show tabs for exam types that have at least one entry
  const usedExamTypes = EXAM_TYPES.filter((e) =>
    items.some((i) => i.exam_type === e),
  )

  // Subject pills for the active tab
  const subjectPills = [
    'All',
    ...new Set(
      items.filter((i) => i.exam_type === activeExam).map((i) => i.subject),
    ),
  ]

  // Rows shown in the table
  const visibleRows = items
    .filter(
      (i) =>
        i.exam_type === activeExam &&
        (activeSubject === 'All' || i.subject === activeSubject),
    )
    .sort(
      (a, b) =>
        computeGrade(b.score, b.score_total) -
        computeGrade(a.score, a.score_total),
    )

  // "vs prev exam type" comparison

  // ── stats ─────────────────────────────────────────────────────────────────

  const allGrades = items.map((i) => computeGrade(i.score, i.score_total))
  const examGrades = items
    .filter((i) => i.exam_type === activeExam)
    .map((i) => computeGrade(i.score, i.score_total))

  const overallAvg = allGrades.length
    ? Math.round(allGrades.reduce((a, b) => a + b, 0) / allGrades.length)
    : 0
  const examAvg = examGrades.length
    ? Math.round(examGrades.reduce((a, b) => a + b, 0) / examGrades.length)
    : 0
  const best = allGrades.length ? Math.max(...allGrades) : 0
  const passRate = allGrades.length
    ? Math.round(
        (allGrades.filter((g) => g >= 75).length / allGrades.length) * 100,
      )
    : 0

  // ── handlers ──────────────────────────────────────────────────────────────

  const handleDelete = (score_id: any) =>
    // setItems((prev) => prev.filter((i) => i.score_id !== score_id))
    console.log(score_id)

  const handleExamChange = (val: any) => {
    setActiveExam(val)
    setActiveSubject('All')
  }
  const handleScoreSubmit = async () => {
    createScore.mutate(newScore)
  }

  // ── render ────────────────────────────────────────────────────────────────

  return (
    <div className="flex justify-center items-center mx-auto w-full md:w-8/12">
      <Card className="w-full p-4 border border-yellow-400">
        {/* ── header ── */}
        <CardTitle className="flex items-center gap-2 text-4xl font-semibold mb-4">
          <div className="flex w-full items-center justify-between">
            <div className="flex flex-row items-center gap-2">
              <span className="p-4 ml-3 rounded-full bg-yellow-100">
                <NotebookPen className="w-12 h-12 text-yellow-600" />
              </span>
              <div>
                <span className="text-yellow-700">Score Tracker</span>
                <p className="text-sm text-muted-foreground font-normal">
                  Nursing Board Exam Review
                </p>
              </div>
            </div>
          </div>
        </CardTitle>

        <CardContent className="space-y-4">
          {/* ── stats row (NEW) ── */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              {
                icon: BarChart2,
                label: 'Overall avg',
                value: overallAvg,
                color: 'text-yellow-700',
              },
              {
                icon: TrendingUp,
                label: `${activeExam} avg`,
                value: examAvg || '—',
                color: 'text-blue-600',
              },
              {
                icon: Award,
                label: 'Personal best',
                value: best || '—',
                color: 'text-green-600',
              },
              {
                icon: Percent,
                label: 'Pass rate',
                value: `${passRate}%`,
                color: passRate >= 75 ? 'text-green-600' : 'text-red-500',
              },
            ].map(({ icon: Icon, label, value, color }) => (
              <div
                key={label}
                className="flex flex-col gap-1 bg-yellow-50 border border-yellow-200 rounded-xl p-3"
              >
                <div className="flex items-center gap-1.5 text-yellow-700">
                  <Icon size={14} />
                  <span className="text-xs font-medium">{label}</span>
                </div>
                <span className={`text-2xl font-semibold ${color}`}>
                  {value}
                </span>
              </div>
            ))}
          </div>

          {/* ── tabs (replaces two stacked Cards) ── */}
          <Card className="p-4 border border-yellow-400">
            <Tabs value={activeExam} onValueChange={handleExamChange}>
              <div className="flex flex-col gap-3 mb-3">
                {/* Exam type tabs */}
                <TabsList className="bg-yellow-50 border border-yellow-200 w-fit">
                  {usedExamTypes.map((e) => (
                    <TabsTrigger
                      key={e}
                      value={e}
                      className="data-[state=active]:bg-yellow-400 data-[state=active]:text-white text-xs"
                    >
                      {e}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {/* Subject filter pills (NEW) */}
                <div className="flex gap-2 flex-wrap">
                  {subjectPills.map((pill) => (
                    <Badge
                      key={pill}
                      variant="outline"
                      onClick={() => setActiveSubject(pill)}
                      className={`cursor-pointer text-xs rounded-full px-3 transition-colors ${
                        activeSubject === pill
                          ? 'bg-yellow-400 text-white border-yellow-400'
                          : 'text-muted-foreground hover:border-yellow-300'
                      }`}
                    >
                      {pill}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Tab content — one per exam type */}
              {EXAM_TYPES.map((examType) => (
                <TabsContent key={examType} value={examType} className="mt-0">
                  <div className="[&>div]:max-h-56">
                    <Table className="[&_td]:border-border [&_th]:border-border border-separate border-spacing-0 [&_tfoot_td]:border-t [&_th]:border-b [&_tr]:border-none [&_tr:not(:last-child)_td]:border-b">
                      <TableHeader className="bg-background/90 sticky top-0 z-10 backdrop-blur-xs">
                        <TableRow className="hover:bg-transparent">
                          <TableHead>
                            <div className="flex items-center gap-1">
                              <BookType size={14} /> Subject
                            </div>
                          </TableHead>
                          <TableHead className="text-center">
                            <div className="flex justify-center items-center gap-1">
                              <CheckCircle size={14} /> Score
                            </div>
                          </TableHead>
                          <TableHead className="text-center">
                            <div className="flex justify-center items-center gap-1">
                              <Hash size={14} /> Total
                            </div>
                          </TableHead>
                          <TableHead className="text-center">
                            <div className="flex justify-center items-center gap-1">
                              <BookOpen size={14} /> Grade
                            </div>
                          </TableHead>
                          <TableHead className="text-center">
                            <div className="flex justify-center items-center gap-1">
                              <SquarePen size={14} /> Status
                            </div>
                          </TableHead>

                          <TableHead className="text-center">
                            <div className="flex justify-center items-center gap-1">
                              <FileCog size={14} /> Actions
                            </div>
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {visibleRows.length > 0 ? (
                          visibleRows.map((item) => {
                            const grade = computeGrade(
                              item.score,
                              item.score_total,
                            )

                            return (
                              <TableRow
                                key={item.score_id}
                                className="font-medium"
                              >
                                <TableCell className="text-start">
                                  {item.subject}
                                </TableCell>
                                <TableCell className="text-center">
                                  {item.score}
                                </TableCell>
                                <TableCell className="text-center">
                                  {item.score_total}
                                </TableCell>
                                <TableCell className="text-center">
                                  {/* Grade + mini bar (NEW) */}
                                  <GradeBar grade={grade} />
                                </TableCell>
                                <TableCell className="text-center">
                                  {/* Fix: grade logic now uses computed grade, not raw grades field */}
                                  <StatusBadge grade={grade} />
                                </TableCell>
                                <TableCell className="text-center">
                                  <div className="flex gap-2 justify-center items-center">
                                    <Button className="bg-blue-500 hover:bg-blue-500/70 cursor-pointer h-7 w-7 p-0">
                                      <FilePenLine size={13} />
                                    </Button>
                                    <Button
                                      className="bg-red-500 hover:bg-red-500/70 cursor-pointer h-7 w-7 p-0"
                                      onClick={() =>
                                        handleDelete(item.score_id)
                                      }
                                    >
                                      <Trash2 size={13} />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            )
                          })
                        ) : (
                          <TableRow>
                            <TableCell
                              colSpan={7}
                              className="text-center text-sm py-8 text-muted-foreground"
                            >
                              No scores yet. Click "+ Add score" to start.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        className="flex items-center justify-start text-muted-foreground mx-auto mt-2 text-center text-sm font-semibold w-full cursor-pointer"
                        variant="ghost"
                      >
                        <Plus className="h-5 w-5" />
                        Add new scores
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogTitle>Create Score</DialogTitle>
                      <DialogDescription>
                        Create your score here. Click save when you&apos;re
                        done.
                      </DialogDescription>
                      <div className="flex flex-col space-y-3">
                        <Label>Subject</Label>
                        <Input
                          placeholder="Input your Subject"
                          value={newScore.subject}
                          onChange={(e) =>
                            setNewScore((prev) => ({
                              ...prev,
                              subject: e.target.value,
                            }))
                          }
                        />
                        <Label>Score</Label>
                        <Input
                          placeholder="Input your Scores"
                          type="number"
                          value={newScore.score}
                          onChange={(e) =>
                            setNewScore((prev) => ({
                              ...prev,
                              score: parseInt(e.target.value),
                            }))
                          }
                        />
                        <Label>Score Total</Label>
                        <Input
                          placeholder="Input your Total number of items"
                          value={newScore.score_total}
                          type="number"
                          onChange={(e) =>
                            setNewScore((prev) => ({
                              ...prev,
                              score_total: parseInt(e.target.value),
                            }))
                          }
                        />
                        <Label>Exam type</Label>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="outline"
                              className="flex justify-start w-fit cursor-pointer bg-yellow-200 hover:bg-yellow-200/90"
                            >
                              Select Exam Type: {newScore.exam_type || 'None'}
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            {EXAM_TYPES.map((et) => (
                              <DropdownMenuItem
                                key={et}
                                className="text-yellow-700 bg-yellow-200 mb-1 cursor-pointer"
                                onSelect={() =>
                                  setNewScore({ ...newScore, exam_type: et })
                                }
                              >
                                {et}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button
                            variant="outline"
                            className="cursor-pointer hover:bg-red-500"
                          >
                            Cancel
                          </Button>
                        </DialogClose>
                        <Button
                          className="bg-yellow-400 hover:bg-yellow-400/90 cursor-pointer"
                          onClick={handleScoreSubmit}
                        >
                          Save changes
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </TabsContent>
              ))}
            </Tabs>
          </Card>
        </CardContent>
      </Card>
    </div>
  )
}

export default ScoreTask
