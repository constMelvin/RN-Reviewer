import UserManagement from '@/pages/admin/users/UserManagement'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/super-admin/users')({
  beforeLoad: ({ context }) => {
    if (!context.session) {
      throw redirect({ to: '/' })
    }
    if (context.session.user?.username !== 'superadmin') {
      throw redirect({ to: '/home' })
    }
  },
  component: () => <UserManagement />,
})
