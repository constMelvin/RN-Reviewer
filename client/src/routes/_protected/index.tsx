import Homepage from '@/components/home-page'
import LandingPage from '@/components/landing-page'
import { useSession } from '@/lib/auth-client'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/')({
  component: App,
})

function App() {
  const { data: session } = useSession()

  if (!session) {
    return <LandingPage />
  }

  return (
    <div>
      <Homepage />
    </div>
  )
}
