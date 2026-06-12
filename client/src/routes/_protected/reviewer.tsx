import Reviewer from '@/pages/reviewer'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/reviewer')({
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
  return <Reviewer />
}
