import Homepage from '@/components/home-page'
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
      <Homepage />
    </div>
  )
}
