import {
  Outlet,
  createRootRouteWithContext,
  useLocation,
  useNavigate,
} from '@tanstack/react-router'
// import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
// import { TanstackDevtools } from '@tanstack/react-devtools'

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import SideBarUi from '@/pages/side-bar'
import Header from '@/components/header'
import type { RouterContext } from '@/@types/context'
import CircuitBoardBackground from '@/components/CircuitBoardBackground'
import { useSession } from '@/lib/auth-client'
import { useEffect } from 'react'

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => {
    const location = useLocation()
    const { data: session, isPending } = useSession()
    const isAuthPage = ['/login', '/sign-up'].some((path) =>
      location.pathname.startsWith(path),
    )
    const isLanding = location.pathname === '/' && !session
    const isSuperAdmin = location.pathname.startsWith('/super-admin')
    const hideSidebar = isAuthPage || isLanding || isSuperAdmin
    const navigate = useNavigate()

    useEffect(() => {
      if (
        session?.user?.username === 'superadmin' &&
        !location.pathname.startsWith('/super-admin/dashboard')
      ) {
        console.log('Super admin here __root')
        navigate({ to: '/super-admin/dashboard' })
      }
    }, [session, location.pathname, navigate])

    if (isPending)
      return (
        <div className="fixed inset-0 flex items-center justify-center">
          <style>
            {`@keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      
        @keyframes spin2 {
          0% {
            stroke-dasharray: 1, 800;
            stroke-dashoffset: 0;
          }
          50% {
            stroke-dasharray: 400, 400;
            stroke-dashoffset: -200px;
          }
          100% {
            stroke-dasharray: 800, 1;
            stroke-dashoffset: -800px;
          }
        }
      
        .spin2 {
          transform-origin: center;
          animation: spin2 1.5s ease-in-out infinite,
            spin 2s linear infinite;
          animation-direction: alternate;
        }`}
          </style>

          <svg
            viewBox="0 0 800 800"
            className="h-14 w-14"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              className="spin2 stroke-primary"
              cx="400"
              cy="400"
              fill="none"
              r="200"
              strokeWidth="50"
              strokeDasharray="700 1400"
              strokeLinecap="round"
            />
          </svg>
        </div>
      )
    return (
      <>
        <SidebarProvider>
          {!hideSidebar && <SideBarUi />}

          <SidebarInset>
            <div
              className={`min-h-screen relative overflow-hidden ${hideSidebar ? '' : 'bg-[#f8fafc]'}`}
            >
              {!hideSidebar && <CircuitBoardBackground />}

              <main className="relative z-10" role="main">
                {!hideSidebar && <Header />}
                {/* Mobile trigger — only shows when sidebar is hidden on small screens */}

                <Outlet />
              </main>
            </div>
          </SidebarInset>
        </SidebarProvider>
      </>
    )
  },
})
