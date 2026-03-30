import Reviewer from '@/components/reviewer'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/reviewer')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Reviewer />
}
