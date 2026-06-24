import ServerMonitoring from '@/pages/admin/monitoring/ServerMonitoring'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/super-admin/monitoring')({
  beforeLoad: ({ context }) => {
    if (!context.session) {
      throw redirect({ to: '/' })
    }
    if (context.session.user?.username !== 'superadmin') {
      throw redirect({ to: '/home' })
    }
  },
  component: () => <ServerMonitoring />,
})
