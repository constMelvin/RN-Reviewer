import React, { useState, useEffect, type ReactNode } from 'react'
import { signOut } from '@/lib/auth-client'
import { useNavigate, Link, useMatchRoute } from '@tanstack/react-router'
import {
  LayoutDashboard,
  Users,
  Activity,
  ShieldCheck,
  Server,
  Database,
  Search,
  Sun,
  Moon,
  LogOut,
  Menu,
  X,
  Stethoscope,
  ChevronLeft,
  BarChart3,
  Signal,
} from 'lucide-react'
import AdminNotifications from '../components/AdminNotifications'

const navSections = [
  {
    title: 'Overview',
    items: [
      {
        label: 'Dashboard',
        icon: LayoutDashboard,
        path: '/super-admin/dashboard',
      },
    ],
  },
  {
    title: 'Management',
    items: [
      { label: 'Users', icon: Users, path: '/super-admin/users' },
      { label: 'Scores', icon: BarChart3, path: '/super-admin/scores' },
    ],
  },
  {
    title: 'Infrastructure',
    items: [
      { label: 'Server', icon: Server, path: '/super-admin/monitoring' },
      { label: 'Database', icon: Database, path: '/super-admin/database' },
      { label: 'Traffic', icon: Signal, path: '/super-admin/traffic' },
    ],
  },
  {
    title: 'Security',
    items: [
      {
        label: 'Security Center',
        icon: ShieldCheck,
        path: '/super-admin/security',
      },
      { label: 'Audit Logs', icon: Activity, path: '/super-admin/audit-logs' },
    ],
  },
]

interface AdminLayoutProps {
  children: ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [dark, setDark] = useState(true)
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const navigate = useNavigate()
  const matchRoute = useMatchRoute()

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])

  const handleLogout = async () => {
    await signOut()
    window.location.href = '/'
  }

  const toggleDark = () => setDark((d) => !d)

  const isActive = (path: string) => {
    return !!matchRoute({ to: path, fuzzy: false })
  }

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Lexend:wght@500;600;700&display=swap"
        rel="stylesheet"
      />

      <div
        className="flex h-screen overflow-hidden bg-slate-50 dark:bg-[#0a0f1c] text-slate-900 dark:text-slate-100 transition-colors"
        style={{ fontFamily: '"Inter", system-ui, sans-serif' }}
      >
        {/* Mobile backdrop */}
        {mobileOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/40 md:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}

        {/* Desktop Sidebar */}
        <aside
          className={[
            'flex flex-col h-full',
            'border-r border-slate-200/70 bg-white/90 px-3 py-4',
            'dark:border-slate-800 dark:bg-[#0c1322]/90',
            collapsed ? 'w-[72px]' : 'w-64',
            'hidden md:flex',
            'transition-all duration-300',
          ].join(' ')}
        >
          <SidebarContent
            collapsed={collapsed}
            isActive={isActive}
            handleLogout={handleLogout}
          />
          {/* Collapse toggle */}
          <button
            onClick={() => setCollapsed((c) => !c)}
            className="mt-2 flex items-center justify-center rounded-xl border border-slate-200 py-1.5 text-xs text-slate-400 hover:bg-slate-100 dark:border-slate-800 dark:hover:bg-slate-800/60"
          >
            <ChevronLeft
              size={14}
              className={`transition-transform ${collapsed ? 'rotate-180' : ''}`}
            />
          </button>
        </aside>

        {/* Mobile Drawer */}
        <aside
          className={[
            'fixed inset-y-0 left-0 z-50 flex flex-col w-64 h-full',
            'border-r border-slate-200 bg-white/95 px-3 py-4',
            'dark:border-slate-800 dark:bg-[#0c1322]/95',
            'transition-transform duration-300 ease-in-out',
            mobileOpen ? 'translate-x-0' : '-translate-x-full',
            'md:hidden',
          ].join(' ')}
        >
          <button
            onClick={() => setMobileOpen(false)}
            className="absolute right-3 top-3 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
            aria-label="Close menu"
          >
            <X size={16} />
          </button>
          <SidebarContent
            collapsed={false}
            isActive={isActive}
            onNavClick={() => setMobileOpen(false)}
            handleLogout={handleLogout}
          />
        </aside>

        {/* Main content */}
        <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
          {/* Header */}
          <header className="shrink-0 z-10 border-b border-slate-200/70 bg-white/70 px-4 py-3 backdrop-blur-md dark:border-slate-800/70 dark:bg-[#0a0f1c]/70 sm:px-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setMobileOpen(true)}
                  className="rounded-xl border border-slate-200 p-2 text-slate-500 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800/60 md:hidden"
                  aria-label="Open menu"
                >
                  <Menu size={18} />
                </button>
                <div>
                  <h1
                    className="text-xl font-semibold"
                    style={{ fontFamily: '"Lexend", "Inter", sans-serif' }}
                  >
                    Super Admin
                  </h1>
                  <p className="text-sm text-slate-400">
                    Platform Monitoring & Management
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-400 dark:border-slate-800 dark:bg-slate-900 sm:flex">
                  <Search size={15} />
                  <span>Search...</span>
                  <kbd className="ml-2 rounded border border-slate-200 px-1.5 text-[10px] text-slate-400 dark:border-slate-700">
                    ⌘K
                  </kbd>
                </div>
                <AdminNotifications />
                <button
                  onClick={toggleDark}
                  className="rounded-xl border border-slate-200 p-2 text-slate-500 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800/60"
                >
                  {dark ? <Sun size={18} /> : <Moon size={18} />}
                </button>
                <div
                  className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 text-sm font-semibold text-white"
                  style={{ fontFamily: '"Lexend", "Inter", sans-serif' }}
                >
                  SA
                </div>
              </div>
            </div>
          </header>

          {/* Scrollable content */}
          <main className="flex-1 overflow-y-auto">
            <div className="p-4 sm:p-6">{children}</div>
          </main>
        </div>
      </div>
    </>
  )
}

function SidebarContent({
  collapsed,
  isActive,
  onNavClick,
  handleLogout,
}: {
  collapsed: boolean
  isActive: (path: string) => boolean
  onNavClick?: () => void
  handleLogout: () => void
}) {
  return (
    <>
      {/* Logo */}
      <div className="mb-6 flex items-center gap-2 px-2 shrink-0">
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-blue-600 to-teal-500 text-white shadow-sm">
          <Stethoscope size={18} />
        </div>
        {!collapsed && (
          <div style={{ fontFamily: '"Lexend", "Inter", sans-serif' }}>
            <p className="text-sm font-semibold leading-tight">RN Reviewer</p>
            <p className="text-[11px] text-slate-400">Super Admin</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav
        className="flex-1 min-h-0 overflow-y-auto space-y-4 pr-1"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: 'transparent transparent',
        }}
      >
        {navSections.map((section) => (
          <div key={section.title}>
            {!collapsed && (
              <p className="mb-1 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400/60">
                {section.title}
              </p>
            )}
            <div className="space-y-0.5">
              {section.items.map(({ label, icon: Icon, path }) => {
                const active = isActive(path)
                return (
                  <Link
                    key={path}
                    to={path}
                    onClick={onNavClick}
                    className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors ${
                      active
                        ? 'bg-blue-600/10 font-medium text-blue-700 dark:bg-blue-500/15 dark:text-blue-400'
                        : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-white'
                    }`}
                  >
                    <span className="relative flex h-5 w-5 shrink-0 items-center justify-center">
                      <Icon size={18} />
                      {active && (
                        <span className="absolute -left-[14px] h-5 w-1 rounded-full bg-blue-600 dark:bg-blue-400" />
                      )}
                    </span>
                    {!collapsed && <span className="truncate">{label}</span>}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom */}
      <div className="mt-2 flex shrink-0 flex-col gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 rounded-xl border border-rose-200 py-2 text-xs text-rose-500 hover:bg-rose-50 hover:text-rose-600 dark:border-rose-900/50 dark:text-rose-400 dark:hover:bg-rose-900/30"
        >
          <LogOut size={14} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </>
  )
}
