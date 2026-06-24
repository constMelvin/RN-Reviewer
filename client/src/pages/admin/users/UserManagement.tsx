import React, { useState } from 'react'
import {
  Users, Search, ChevronLeft, ChevronRight, Shield, UserCog,
  GraduationCap, Trash2, Eye, X, BookOpen, ClipboardList, Activity,
  Monitor, Clock,
} from 'lucide-react'
import {
  useAdminUsers, useAdminOnlineUsers, useAdminUserDetail,
  useUpdateUserRole, useDeleteUser,
} from '@/hooks/admin/use-admin-users'
import AdminLayout from '../layout/AdminLayout'

function Card({ className = '', children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={`rounded-2xl border border-slate-200/70 bg-white/80 shadow-sm backdrop-blur-sm transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-900/60 ${className}`}>
      {children}
    </div>
  )
}

function Badge({ tone = 'slate', children }: { tone?: string; children: React.ReactNode }) {
  const tones: Record<string, string> = {
    slate: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
    emerald: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',
    blue: 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400',
    amber: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400',
    rose: 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400',
  }
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${tones[tone] || tones.slate}`}>
      {children}
    </span>
  )
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const s = Math.floor(diff / 1000)
  if (s < 60) return 'Just now'
  const m = Math.floor(s / 60)
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

const roleIcons: Record<string, typeof Users> = {
  student: GraduationCap,
  admin: UserCog,
  super_admin: Shield,
}

const roleTones: Record<string, string> = {
  student: 'emerald',
  admin: 'amber',
  super_admin: 'rose',
}

export default function UserManagement() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [showOnline, setShowOnline] = useState(false)

  const { data: usersData, isLoading } = useAdminUsers(page, 20, search || undefined, roleFilter || undefined)
  const { data: onlineUsers } = useAdminOnlineUsers()
  const { data: userDetail } = useAdminUserDetail(selectedUserId)
  const updateRole = useUpdateUserRole()
  const deleteUserMut = useDeleteUser()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setSearch(searchInput)
    setPage(1)
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold" style={{ fontFamily: '"Lexend", "Inter", sans-serif' }}>
              User Management
            </h2>
            <p className="text-sm text-slate-400">
              {usersData?.total ?? 0} total users · {onlineUsers?.length ?? 0} online now
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowOnline(!showOnline)}
              className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-sm transition-colors ${
                showOnline
                  ? 'border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-400'
                  : 'border-slate-200 text-slate-500 hover:bg-slate-100 dark:border-slate-800 dark:hover:bg-slate-800/60'
              }`}
            >
              <Monitor size={15} />
              Online ({onlineUsers?.length ?? 0})
            </button>
          </div>
        </div>

        {/* Filters */}
        <Card className="p-4">
          <form onSubmit={handleSearch} className="flex flex-wrap items-center gap-3">
            <div className="flex flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-900 min-w-[200px]">
              <Search size={15} className="text-slate-400" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search by name, email, username..."
                className="flex-1 bg-transparent outline-none placeholder:text-slate-400"
              />
            </div>
            <select
              value={roleFilter}
              onChange={(e) => { setRoleFilter(e.target.value); setPage(1) }}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
            >
              <option value="">All Roles</option>
              <option value="student">Student</option>
              <option value="admin">Admin</option>
              <option value="super_admin">Super Admin</option>
            </select>
            <button
              type="submit"
              className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Search
            </button>
          </form>
        </Card>

        {/* Online Users */}
        {showOnline && (
          <Card className="p-4 sm:p-6">
            <div className="mb-4 flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
              </span>
              <h3 className="text-sm font-semibold">Online Users</h3>
            </div>
            {!onlineUsers || onlineUsers.length === 0 ? (
              <p className="py-6 text-center text-sm text-slate-400">No users currently online</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="text-xs text-slate-400">
                      <th className="pb-2 font-medium">User</th>
                      <th className="pb-2 font-medium">Role</th>
                      <th className="pb-2 font-medium">IP Address</th>
                      <th className="pb-2 font-medium">Session Started</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {onlineUsers.slice(0, 10).map((s) => (
                      <tr key={s.sessionId} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                        <td className="py-2.5">
                          <div className="flex items-center gap-2">
                            <div className="grid h-7 w-7 place-items-center rounded-full bg-gradient-to-br from-blue-500 to-teal-500 text-[10px] font-semibold text-white">
                              {s.userName?.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)}
                            </div>
                            <div>
                              <p className="font-medium">{s.userName}</p>
                              <p className="text-xs text-slate-400">{s.userEmail}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-2.5">
                          <Badge tone={roleTones[s.userRole || ''] || 'slate'}>
                            {(s.userRole || 'unknown').replace(/_/g, ' ')}
                          </Badge>
                        </td>
                        <td className="py-2.5 font-mono text-xs text-slate-400">{s.ipAddress || '—'}</td>
                        <td className="py-2.5 text-xs text-slate-400">{timeAgo(s.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        )}

        {/* User Table */}
        <Card className="p-4 sm:p-6">
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-12 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />
              ))}
            </div>
          ) : !usersData || usersData.users.length === 0 ? (
            <div className="py-12 text-center text-sm text-slate-400">
              No users found matching your criteria
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="text-xs text-slate-400">
                      <th className="pb-2 font-medium">User</th>
                      <th className="pb-2 font-medium">Role</th>
                      <th className="pb-2 font-medium">Email Verified</th>
                      <th className="pb-2 font-medium">Joined</th>
                      <th className="pb-2 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {usersData.users.map((u) => {
                      const RoleIcon = roleIcons[u.role || ''] || Users
                      return (
                        <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                          <td className="py-2.5">
                            <div className="flex items-center gap-3">
                              <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-blue-500 to-teal-500 text-xs font-semibold text-white">
                                {u.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)}
                              </div>
                              <div>
                                <p className="font-medium">{u.name}</p>
                                <p className="text-xs text-slate-400">{u.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-2.5">
                            <Badge tone={roleTones[u.role || ''] || 'slate'}>
                              <RoleIcon size={12} />
                              {(u.role || 'unknown').replace(/_/g, ' ')}
                            </Badge>
                          </td>
                          <td className="py-2.5">
                            <Badge tone={u.emailVerified ? 'emerald' : 'amber'}>
                              {u.emailVerified ? 'Verified' : 'Pending'}
                            </Badge>
                          </td>
                          <td className="py-2.5 text-xs text-slate-400">
                            {new Date(u.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-2.5 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => setSelectedUserId(u.id)}
                                className="rounded-lg p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10"
                                title="View details"
                              >
                                <Eye size={15} />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`Delete user ${u.name}?`)) {
                                    deleteUserMut.mutate(u.id)
                                  }
                                }}
                                className="rounded-lg p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10"
                                title="Delete user"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {usersData.totalPages > 1 && (
                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
                  <span className="text-xs text-slate-400">
                    Page {usersData.page} of {usersData.totalPages} ({usersData.total} users)
                  </span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page <= 1}
                      className="rounded-lg border border-slate-200 p-1.5 text-slate-500 hover:bg-slate-100 disabled:opacity-40 dark:border-slate-800 dark:hover:bg-slate-800/60"
                    >
                      <ChevronLeft size={15} />
                    </button>
                    <button
                      onClick={() => setPage((p) => Math.min(usersData.totalPages, p + 1))}
                      disabled={page >= usersData.totalPages}
                      className="rounded-lg border border-slate-200 p-1.5 text-slate-500 hover:bg-slate-100 disabled:opacity-40 dark:border-slate-800 dark:hover:bg-slate-800/60"
                    >
                      <ChevronRight size={15} />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </Card>

        {/* User Detail Drawer */}
        {selectedUserId && userDetail && (
          <div className="fixed inset-0 z-50 flex items-start justify-end">
            <div className="absolute inset-0 bg-black/40" onClick={() => setSelectedUserId(null)} />
            <div className="relative ml-auto h-full w-full max-w-lg overflow-y-auto bg-white p-6 shadow-2xl dark:bg-[#0c1322]">
              <button
                onClick={() => setSelectedUserId(null)}
                className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-4">
                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-blue-500 to-teal-500 text-lg font-semibold text-white">
                  {userDetail.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)}
                </div>
                <div>
                  <h3 className="text-lg font-semibold" style={{ fontFamily: '"Lexend", "Inter", sans-serif' }}>
                    {userDetail.name}
                  </h3>
                  <p className="text-sm text-slate-400">{userDetail.email}</p>
                  <Badge tone={roleTones[userDetail.role || ''] || 'slate'}>
                    {(userDetail.role || 'unknown').replace(/_/g, ' ')}
                  </Badge>
                </div>
              </div>

              {/* Stats */}
              <div className="mt-6 grid grid-cols-2 gap-3">
                {[
                  { label: 'Scores', value: userDetail.stats.scores, icon: ClipboardList },
                  { label: 'Avg Score', value: `${userDetail.stats.avgScorePercent ?? 0}%`, icon: Activity },
                  { label: 'Books', value: userDetail.stats.books, icon: BookOpen },
                  { label: 'Tasks', value: userDetail.stats.tasks, icon: Activity },
                ].map((s) => (
                  <div key={s.label} className="rounded-xl border border-slate-100 p-3 text-center dark:border-slate-800">
                    <s.icon size={16} className="mx-auto mb-1 text-slate-400" />
                    <p className="text-lg font-semibold" style={{ fontFamily: '"Lexend", "Inter", sans-serif' }}>{s.value}</p>
                    <p className="text-[11px] text-slate-400">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Recent Scores */}
              {userDetail.recentScores?.length > 0 && (
                <div className="mt-6">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Recent Scores
                  </p>
                  <div className="space-y-2">
                    {userDetail.recentScores.slice(0, 8).map((s) => (
                      <div key={s.scoreId} className="flex items-center justify-between rounded-xl border border-slate-100 px-3 py-2 dark:border-slate-800">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">{s.examType}</p>
                          <p className="truncate text-xs text-slate-400">{s.subject}</p>
                        </div>
                        <div className="text-right shrink-0 ml-2">
                          <p className="text-sm font-semibold">{s.percent}%</p>
                          <p className="text-xs text-slate-400">{s.score}/{s.scoreTotal}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Role change */}
              <div className="mt-6">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Change Role</p>
                <div className="flex gap-2">
                  {['student', 'admin', 'super_admin'].map((r) => (
                    <button
                      key={r}
                      onClick={() => updateRole.mutate({ userId: userDetail.id, role: r })}
                      disabled={userDetail.role === r}
                      className={`flex-1 rounded-xl border py-2 text-xs font-medium transition-colors ${
                        userDetail.role === r
                          ? 'border-blue-300 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-500/10 dark:text-blue-400'
                          : 'border-slate-200 text-slate-500 hover:bg-slate-100 dark:border-slate-800 dark:hover:bg-slate-800/60'
                      }`}
                    >
                      {r.replace(/_/g, ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Active Sessions */}
              <div className="mt-6">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Active Sessions ({userDetail.sessions.length})
                </p>
                <div className="space-y-2">
                  {userDetail.sessions.length === 0 ? (
                    <p className="text-sm text-slate-400">No active sessions</p>
                  ) : (
                    userDetail.sessions.map((s) => (
                      <div key={s.id} className="rounded-xl border border-slate-100 px-3 py-2 dark:border-slate-800">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs text-slate-400">{s.ipAddress || 'Unknown IP'}</span>
                          <span className="text-xs text-slate-400">{timeAgo(s.createdAt)}</span>
                        </div>
                        <p className="mt-1 truncate text-xs text-slate-400">{s.userAgent || 'Unknown device'}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="mt-6">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Recent Activity
                </p>
                <div className="space-y-2">
                  {userDetail.recentActivity.length === 0 ? (
                    <p className="text-sm text-slate-400">No recent activity</p>
                  ) : (
                    userDetail.recentActivity.slice(0, 10).map((a: any) => (
                      <div key={a.id} className="flex items-center gap-3 rounded-xl border border-slate-100 px-3 py-2 dark:border-slate-800">
                        <Clock size={13} className="shrink-0 text-slate-400" />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm">{a.action.replace(/_/g, ' ')}</p>
                          <p className="text-xs text-slate-400">{timeAgo(a.created_at)}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
