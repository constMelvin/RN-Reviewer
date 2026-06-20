import LandingPage from '@/components/pages/landing-page'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_public/landing')({
  component: LandingPage,
})
