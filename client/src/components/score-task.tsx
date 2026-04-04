import { useState } from 'react'
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
  TrendingDown,
  Minus,
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

function computeGrade(score: number, total: number) {
  return Math.round((score / total) * 100)
}

function StatusBadge({ grade }) {
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
  // Fix: unique IDs, added examType field
  const [items, setItems] = useState([
    { id: '1', subject: 'Pharma', examType: 'Pre-test', score: 25, total: 25 },
    {
      id: '2',
      subject: 'Medsurg',
      examType: 'Unit Exam',
      score: 21,
      total: 25,
    },
    { id: '3', subject: 'Psych', examType: 'Pre-test', score: 22, total: 25 },
    { id: '4', subject: 'Rizal', examType: 'Pre-test', score: 23, total: 25 },
    { id: '5', subject: 'CA', examType: 'Pre-test', score: 23, total: 25 },
    // Fix: was duplicate id '5' — now '6'
    {
      id: '6',
      subject: 'Fundament',
      examType: 'Pre-test',
      score: 19,
      total: 25,
    },
  ])

  const [activeExam, setActiveExam] = useState('Pre-test')
  const [activeSubject, setActiveSubject] = useState('All')

  // ── derived data ──────────────────────────────────────────────────────────

  // Only show tabs for exam types that have at least one entry
  const usedExamTypes = EXAM_TYPES.filter((e) =>
    items.some((i) => i.examType === e),
  )

  // Subject pills for the active tab
  const subjectPills = [
    'All',
    ...new Set(
      items.filter((i) => i.examType === activeExam).map((i) => i.subject),
    ),
  ]

  // Rows shown in the table
  const visibleRows = items
    .filter(
      (i) =>
        i.examType === activeExam &&
        (activeSubject === 'All' || i.subject === activeSubject),
    )
    .sort(
      (a, b) => computeGrade(b.score, b.total) - computeGrade(a.score, a.total),
    )

  // "vs prev exam type" comparison

  // ── stats ─────────────────────────────────────────────────────────────────

  const allGrades = items.map((i) => computeGrade(i.score, i.total))
  const examGrades = items
    .filter((i) => i.examType === activeExam)
    .map((i) => computeGrade(i.score, i.total))

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

  const handleDelete = (id: any) =>
    setItems((prev) => prev.filter((i) => i.id !== id))

  const handleExamChange = (val: any) => {
    setActiveExam(val)
    setActiveSubject('All')
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
                            const grade = computeGrade(item.score, item.total)

                            return (
                              <TableRow key={item.id} className="font-medium">
                                <TableCell className="text-start">
                                  {item.subject}
                                </TableCell>
                                <TableCell className="text-center">
                                  {item.score}
                                </TableCell>
                                <TableCell className="text-center">
                                  {item.total}
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
                                      onClick={() => handleDelete(item.id)}
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
                  <Button
                    className="flex items-center justify-start text-muted-foreground mx-auto mt-2 text-center text-sm font-semibold w-full"
                    variant="ghost"
                  >
                    <Plus className="h-5 w-5" />
                    Add new scores
                  </Button>
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
