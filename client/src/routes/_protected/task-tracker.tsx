import TaskTracker from '@/components/task-tracker'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/task-tracker')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <TaskTracker />
    </div>
  )
}
