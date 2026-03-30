import Register from '@/components/register'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_public/sign-up')({
  component: Register,
})
