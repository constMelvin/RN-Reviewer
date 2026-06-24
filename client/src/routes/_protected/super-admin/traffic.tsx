import TrafficMonitoring from '@/pages/admin/monitoring/TrafficMonitoring'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/super-admin/traffic')({
  beforeLoad: ({ context }) => {
    if (!context.session) {
      throw redirect({ to: '/' })
    }
    if (context.session.user?.username !== 'superadmin') {
      throw redirect({ to: '/home' })
    }
  },
  component: () => <TrafficMonitoring />,
})
