import {
  Outlet,
  createRootRouteWithContext,
  useLocation,
  useNavigate,
} from '@tanstack/react-router'
// import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
// import { TanstackDevtools } from '@tanstack/react-devtools'

import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import SideBarUi from '@/components/side-bar'
import Header from '@/components/header'
import type { RouterContext } from '@/@types/context'
import CircuitBoardBackground from '@/components/CircuitBoardBackground'
import { useSession } from '@/lib/auth-client'
import { useEffect } from 'react'
import { router } from '@/main'

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => {
    const location = useLocation()
    const { data: session, isPending } = useSession()
    const hideSidebar = ['/login', '/sign-up'].some((path) =>
      location.pathname.startsWith(path),
    )

    useEffect(() => {
      router.update({
        context: { session },
      })
    }, [session])


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
            <div className="min-h-screen w-full bg-[#f8fafc] relative">
              <CircuitBoardBackground />

              <main className="relative z-20" role="main">
                {!hideSidebar && <Header />}
                <Outlet />
              </main>
            </div>
          </SidebarInset>
        </SidebarProvider>
      </>
    )
  },
})
