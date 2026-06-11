import Home from '@/components/home-page'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/home')({
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
  return <Home />
}
