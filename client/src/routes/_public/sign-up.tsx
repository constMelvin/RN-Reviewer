import Register from '@/components/pages/register'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_public/sign-up')({
  component: Register,
})
