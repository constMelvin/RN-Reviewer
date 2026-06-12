import ScoreTask from '@/pages/score-task'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/score-task')({
  beforeLoad: ({ context }) => {
    if (!context.session) {
      throw redirect({
        to: '/',
      })
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  return <ScoreTask />
}
