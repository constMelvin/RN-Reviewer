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
import { Button } from './ui/button'
import { Badge } from './ui/badge'

const ScoreTask = () => {
  const items = [
    {
      id: '1',
      subject: 'Pharma',
      score: 25,
      total: 25,
      remarks: 'Passed',
      grades: 74,
    },
    {
      id: '2',
      subject: 'Medsurg',
      score: 21,
      total: 25,
      remarks: 'Passed',
      grades: 84,
    },
    {
      id: '3',
      subject: 'Psych',
      score: 22,
      total: 25,
      remarks: 'Passed',
      grades: 88,
    },
    {
      id: '4',
      subject: 'Rizal',
      score: 23,
      total: 25,
      remarks: 'Passed',
      grades: 92,
    },
    {
      id: '5',
      subject: 'CA',
      score: 23,
      total: 25,
      remarks: 'Passed',
      grades: 92,
    },
    {
      id: '5',
      subject: 'CA',
      score: 23,
      total: 25,
      remarks: 'Passed',
      grades: 92,
    },
  ]
  return (
    <div className="flex justify-center items-center mx-auto w-full md:w-8/12">
      <Card className="w-full p-4 border border-yellow-400">
        <CardTitle className="flex items-center gap-2 text-4xl font-semibold">
          <span className="p-4 rounded-full bg-yellow-100">
            <NotebookPen className="w-12 h-12 text-yellow-600" />
          </span>
          <span className="text-yellow-700">Score Tracker</span>
        </CardTitle>
        <CardContent className="space-y-5">
          <Card className="p-5 border border-yellow-400">
            <div>
              <span className="text-yellow-700 text-3xl font-semibold p-2">
                Pre-Test
              </span>
              <div className="[&>div]:max-h-56">
                <Table className="[&_td]:border-border [&_th]:border-border border-separate border-spacing-0 [&_tfoot_td]:border-t [&_th]:border-b [&_tr]:border-none [&_tr:not(:last-child)_td]:border-b">
                  <TableHeader className="bg-background/90 sticky top-0 z-10 backdrop-blur-xs">
                    <TableRow className="hover:bg-transparent">
                      <TableHead>
                        <div className="flex justify-start items-center gap-1">
                          <BookType size={16} /> <span>Subjects</span>
                        </div>
                      </TableHead>
                      <TableHead>
                        <div className="flex justify-center items-center gap-1">
                          <CheckCircle size={16} /> <span>Score</span>
                        </div>
                      </TableHead>
                      <TableHead>
                        <div className="flex justify-center items-center gap-1">
                          <Hash size={16} /> <span>Total</span>
                        </div>
                      </TableHead>
                      <TableHead>
                        <div className="flex justify-center items-center gap-1">
                          <BookOpen size={16} /> <span>Grades</span>
                        </div>
                      </TableHead>
                      <TableHead>
                        <div className="flex justify-center items-center gap-1">
                          <SquarePen size={16} /> <span>Remarks</span>
                        </div>
                      </TableHead>
                      <TableHead>
                        <div className="flex justify-center items-center gap-1">
                          <FileCog size={16} /> <span>Action</span>
                        </div>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.length > 0 ? (
                      items.map((item) => (
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
                            {item.grades}
                          </TableCell>
                          <TableCell className="text-center">
                            {item.grades >= 90 && item.grades <= 100 ? (
                              <Badge className="bg-green-600 text-white rounded-full">
                                Excellent
                              </Badge>
                            ) : item.grades >= 75 && item.grades <= 89 ? (
                              <Badge className="bg-yellow-500 text-white rounded-full">
                                Passed
                              </Badge>
                            ) : (
                              <Badge className="bg-red-600 text-white rounded-full">
                                More Improvement
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex gap-2 justify-center items-center">
                              <Button className="bg-blue-500 hover:bg-blue-500/70 cursor-pointer">
                                <FilePenLine />
                              </Button>
                              <Button className="bg-red-500 hover:bg-red-500/70 cursor-pointer">
                                <Trash2 />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="text-center text-md py-6 text-muted-foreground"
                        >
                          No score results.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              <Button
                className="flex items-center justify-start text-muted-foreground mx-auto mt-2 text-center text-sm font-semibold w-full"
                variant={'ghost'}
              >
                <Plus className="h-5 w-5" />
                Add new scores
              </Button>
            </div>
          </Card>
          <Card className="p-5 border border-yellow-400">
            <div>
              <span className="text-yellow-700 text-3xl font-semibold p-2">
                Post-Test
              </span>
              <div className="[&>div]:max-h-56">
                <Table className="[&_td]:border-border [&_th]:border-border border-separate border-spacing-0 [&_tfoot_td]:border-t [&_th]:border-b [&_tr]:border-none [&_tr:not(:last-child)_td]:border-b">
                  <TableHeader className="bg-background/90 sticky top-0 z-10 backdrop-blur-xs">
                    <TableRow className="hover:bg-transparent">
                      <TableHead>
                        <div className="flex justify-start items-center gap-1">
                          <BookType size={16} /> <span>Subjects</span>
                        </div>
                      </TableHead>
                      <TableHead>
                        <div className="flex justify-center items-center gap-1">
                          <CheckCircle size={16} /> <span>Score</span>
                        </div>
                      </TableHead>
                      <TableHead>
                        <div className="flex justify-center items-center gap-1">
                          <Hash size={16} /> <span>Total</span>
                        </div>
                      </TableHead>
                      <TableHead>
                        <div className="flex justify-center items-center gap-1">
                          <BookOpen size={16} /> <span>Grades</span>
                        </div>
                      </TableHead>
                      <TableHead>
                        <div className="flex justify-center items-center gap-1">
                          <SquarePen size={16} /> <span>Remarks</span>
                        </div>
                      </TableHead>
                      <TableHead>
                        <div className="flex justify-center items-center gap-1">
                          <FileCog size={16} /> <span>Action</span>
                        </div>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.length > 0 ? (
                      items.map((item) => (
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
                            {item.grades}
                          </TableCell>
                          <TableCell className="text-center">
                            {item.grades >= 90 && item.grades <= 100 ? (
                              <Badge className="bg-green-600 text-white rounded-full">
                                Excellent
                              </Badge>
                            ) : item.grades >= 75 && item.grades <= 89 ? (
                              <Badge className="bg-yellow-500 text-white rounded-full">
                                Passed
                              </Badge>
                            ) : (
                              <Badge className="bg-red-600 text-white rounded-full">
                                More Improvement
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex gap-2 justify-center items-center">
                              <Button className="bg-blue-500 hover:bg-blue-500/70 cursor-pointer">
                                <FilePenLine />
                              </Button>
                              <Button className="bg-red-500 hover:bg-red-500/70 cursor-pointer">
                                <Trash2 />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="text-center text-md py-6 text-muted-foreground"
                        >
                          No score results.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              <Button
                className="flex items-center justify-start text-muted-foreground mx-auto mt-2 text-center text-sm font-semibold w-full"
                variant={'ghost'}
              >
                <Plus className="h-5 w-5" />
                Add new scores
              </Button>
            </div>
          </Card>
        </CardContent>
      </Card>
    </div>
  )
}

export default ScoreTask
