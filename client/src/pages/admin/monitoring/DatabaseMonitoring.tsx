import React from 'react'
import { Database, HardDrive, Activity, Clock, Layers } from 'lucide-react'
import { useDatabaseMetrics } from '@/hooks/admin/use-admin-monitoring'
import AdminLayout from '../layout/AdminLayout'

function Card({ className = '', children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={`rounded-2xl border border-slate-200/70 bg-white/80 shadow-sm backdrop-blur-sm transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-900/60 ${className}`}>
      {children}
    </div>
  )
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

export default function DatabaseMonitoring() {
  const { data: dbMetrics, isLoading } = useDatabaseMetrics()

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold" style={{ fontFamily: '"Lexend", "Inter", sans-serif' }}>
            Database Monitoring
          </h2>
          <p className="text-sm text-slate-400">PostgreSQL connection pool & table statistics · Auto-refresh 15s</p>
        </div>

        {isLoading || !dbMetrics ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="p-6">
                <div className="h-24 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />
              </Card>
            ))}
          </div>
        ) : (
          <>
            {/* Top metrics */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                    <Database size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Database Size</p>
                    <p className="text-lg font-semibold" style={{ fontFamily: '"Lexend", "Inter", sans-serif' }}>
                      {dbMetrics.database.size}
                    </p>
                  </div>
                </div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                    <Activity size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Active Connections</p>
                    <p className="text-lg font-semibold" style={{ fontFamily: '"Lexend", "Inter", sans-serif' }}>
                      {dbMetrics.connections.active}
                    </p>
                    <p className="text-xs text-slate-400">of {dbMetrics.connections.total} total</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-teal-50 text-teal-600 dark:bg-teal-500/10 dark:text-teal-400">
                    <Layers size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Connection Pool</p>
                    <p className="text-lg font-semibold" style={{ fontFamily: '"Lexend", "Inter", sans-serif' }}>
                      {dbMetrics.pool.totalCount}
                    </p>
                    <p className="text-xs text-slate-400">
                      {dbMetrics.pool.idleCount} idle · {dbMetrics.pool.waitingCount} waiting
                    </p>
                  </div>
                </div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400">
                    <Clock size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">DB Uptime</p>
                    <p className="text-sm font-semibold truncate max-w-[140px]">
                      {typeof dbMetrics.uptime === 'string'
                        ? dbMetrics.uptime.split('.')[0]
                        : 'Unknown'}
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Pool visualization */}
            <Card className="p-4 sm:p-6">
              <h3 className="mb-3 text-sm font-semibold">Connection Pool Status</h3>
              <div className="flex items-center gap-2">
                {Array.from({ length: Math.max(dbMetrics.pool.totalCount, 1) }).map((_, i) => {
                  const isActive = i < (dbMetrics.pool.totalCount - dbMetrics.pool.idleCount)
                  return (
                    <div
                      key={i}
                      className={`h-8 w-8 rounded-lg transition-all ${
                        isActive
                          ? 'bg-blue-500 shadow-sm shadow-blue-500/30'
                          : 'bg-slate-100 dark:bg-slate-800'
                      }`}
                      title={isActive ? `Connection ${i + 1}: Active` : `Connection ${i + 1}: Idle`}
                    />
                  )
                })}
              </div>
              <div className="mt-3 flex gap-4 text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded bg-blue-500" /> Active
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded bg-slate-100 dark:bg-slate-800" /> Idle
                </span>
              </div>
            </Card>

            {/* Table stats */}
            <Card className="p-4 sm:p-6">
              <h3 className="mb-4 text-sm font-semibold">Table Statistics</h3>
              {dbMetrics.tables.length === 0 ? (
                <p className="py-6 text-center text-sm text-slate-400">No table data available</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="text-xs text-slate-400">
                        <th className="pb-2 font-medium">Table</th>
                        <th className="pb-2 font-medium text-right">Rows</th>
                        <th className="pb-2 font-medium text-right">Size</th>
                        <th className="pb-2 font-medium">Proportion</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {dbMetrics.tables.map((t) => {
                        const maxSize = Math.max(...dbMetrics.tables.map((x) => x.sizeBytes), 1)
                        const pct = Math.round((t.sizeBytes / maxSize) * 100)
                        return (
                          <tr key={t.name} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                            <td className="py-2.5">
                              <div className="flex items-center gap-2">
                                <HardDrive size={14} className="text-slate-400" />
                                <span className="font-mono text-xs">{t.name}</span>
                              </div>
                            </td>
                            <td className="py-2.5 text-right font-mono text-xs">
                              {t.rowCount.toLocaleString()}
                            </td>
                            <td className="py-2.5 text-right text-xs text-slate-400">{t.size}</td>
                            <td className="py-2.5">
                              <div className="flex items-center gap-2">
                                <div className="h-2 flex-1 rounded-full bg-slate-100 dark:bg-slate-800">
                                  <div
                                    className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-teal-500 transition-all"
                                    style={{ width: `${pct}%` }}
                                  />
                                </div>
                                <span className="text-xs text-slate-400 w-8 text-right">{pct}%</span>
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </>
        )}
      </div>
    </AdminLayout>
  )
}
