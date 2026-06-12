import SuperAdminDashboard from '@/pages/super-admin-page'
import { createFileRoute, redirect } from '@tanstack/react-router'
export const Route = createFileRoute('/_protected/super-admin/dashboard')({
  beforeLoad: ({ context }) => {
    if (!context.session) {
      throw redirect({
        to: '/',
      })
    }

    if (context.session.user?.username !== 'superadmin') {
      throw redirect({
        to: '/home',
      })
    }
    console.log('Super admin here dashboard')
  },
  component: RouteComponent,
})
function RouteComponent() {
  return <SuperAdminDashboard />
}
