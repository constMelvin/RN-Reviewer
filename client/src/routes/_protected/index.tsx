import TaskTracker from '@/components/task-tracker'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/')({
  beforeLoad: ({ context }) => {
    if (!context.session) {
      throw redirect({ to: '/login' })
    }
  },
  component: App,
})

function App() {
  return (
    <div>
      <TaskTracker />
    </div>
  )
}
