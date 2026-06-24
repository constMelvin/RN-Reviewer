import DatabaseMonitoring from '@/pages/admin/monitoring/DatabaseMonitoring'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/super-admin/database')({
  beforeLoad: ({ context }) => {
    if (!context.session) {
      throw redirect({ to: '/' })
    }
    if (context.session.user?.username !== 'superadmin') {
      throw redirect({ to: '/home' })
    }
  },
  component: () => <DatabaseMonitoring />,
})
