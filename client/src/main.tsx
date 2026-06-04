import { StrictMode, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
import { useSession } from '@/lib/auth-client'
import './styles.css'
import reportWebVitals from './reportWebVitals.ts'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useAuthStore } from './store/authStore.ts'
import { Toaster } from 'sileo'
import { applyTheme } from '@/lib/themes'
import type { ThemeName } from '@/lib/themes'

export const router = createRouter({
  routeTree,
  context: { session: null },
  defaultPreload: 'intent',
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
})

function App() {
  const { data: session, isPending, refetch } = useSession()

  const { setUser, clearUser, getUserProfile, userProfile } = useAuthStore()

  useEffect(() => {
    document.title = `PNLE | ${new Date().getFullYear()}`
  }, [])

  useEffect(() => {
    getUserProfile()
  }, [session])

  useEffect(() => {
    // Refetch session on mount to sync with cookies
    if (!session) {
      refetch()
    }
  }, [])
  useEffect(() => {
    router.update({ context: { session } })
    if (session?.user) {
      setUser(session.user)
    } else {
      clearUser()
    }
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

  return <RouterProvider router={router} context={{ session }} />
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof createRouter>
  }
}

const queryClient = new QueryClient()

// Render app
const rootEl = document.getElementById('app')
if (rootEl && !rootEl.innerHTML) {
  const root = ReactDOM.createRoot(rootEl)
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <Toaster position="top-center" />
        <App />
      </QueryClientProvider>
    </StrictMode>,
  )
}

reportWebVitals()
