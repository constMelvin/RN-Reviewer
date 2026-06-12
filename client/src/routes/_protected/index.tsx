import Homepage from '@/pages/home-page'
import LandingPage from '@/pages/landing-page'
import { useSession } from '@/lib/auth-client'
import { createFileRoute } from '@tanstack/react-router'
import { Navigate } from 'react-router-dom'

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
