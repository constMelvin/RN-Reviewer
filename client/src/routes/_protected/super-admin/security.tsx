import SecurityCenter from '@/pages/admin/security/SecurityCenter'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/super-admin/security')({
  beforeLoad: ({ context }) => {
    if (!context.session) {
      throw redirect({ to: '/' })
    }
    if (context.session.user?.username !== 'superadmin') {
      throw redirect({ to: '/home' })
    }
  },
  component: () => <SecurityCenter />,
})
