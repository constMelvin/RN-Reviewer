import ScoreTask from '@/components/score-task'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/score-task')({
  component: RouteComponent,
})

function RouteComponent() {
  return <ScoreTask />
}
