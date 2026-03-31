import Home from '@/components/home'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/home')({
  beforeLoad: ({ context }) => {
    if (!context.session) {
      throw redirect({
        to: '/login',
      })
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  return <Home />
}
