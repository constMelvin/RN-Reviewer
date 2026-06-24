import React from 'react'
import { Cpu, MemoryStick, Clock, Server, Gauge, ArrowUpRight, HardDrive } from 'lucide-react'
import { useServerMetrics, useSystemHealth } from '@/hooks/admin/use-admin-monitoring'
import AdminLayout from '../layout/AdminLayout'

function Card({ className = '', children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={`rounded-2xl border border-slate-200/70 bg-white/80 shadow-sm backdrop-blur-sm transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-900/60 ${className}`}>
      {children}
    </div>
  )
}

function GaugeRing({ value, color, label, sublabel }: { value: number; color: string; label: string; sublabel?: string }) {
  const circumference = 2 * Math.PI * 45
  const offset = circumference - (value / 100) * circumference
  return (
    <div className="flex flex-col items-center">
      <div className="relative h-32 w-32">
        <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
          <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8"
            className="text-slate-100 dark:text-slate-800" />
          <circle cx="50" cy="50" r="45" fill="none" stroke={color} strokeWidth="8"
            strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset}
            className="transition-all duration-700 ease-in-out" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-semibold" style={{ fontFamily: '"Lexend", "Inter", sans-serif' }}>
            {value}%
          </span>
        </div>
      </div>
      <p className="mt-2 text-sm font-medium">{label}</p>
      {sublabel && <p className="text-xs text-slate-400">{sublabel}</p>}
    </div>
  )
}

function formatUptime(seconds: number): string {
  const d = Math.floor(seconds / 86400)
  const h = Math.floor((seconds % 86400) / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  if (d > 0) return `${d}d ${h}h ${m}m`
  if (h > 0) return `${h}h ${m}m`
  return `${m}m`
}

export default function ServerMonitoring() {
  const { data: metrics, isLoading } = useServerMetrics()
  const { data: health } = useSystemHealth()

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold" style={{ fontFamily: '"Lexend", "Inter", sans-serif' }}>
            Server Monitoring
          </h2>
          <p className="text-sm text-slate-400">Real-time server performance metrics · Auto-refresh 10s</p>
        </div>

        {isLoading || !metrics ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="p-6">
                <div className="flex justify-center">
                  <div className="h-32 w-32 animate-pulse rounded-full bg-slate-100 dark:bg-slate-800" />
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <>
            {/* Gauge cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Card className="p-6">
                <GaugeRing
                  value={metrics.cpu.usage}
                  color={metrics.cpu.usage > 80 ? '#f43f5e' : metrics.cpu.usage > 60 ? '#f59e0b' : '#10b981'}
                  label="CPU Usage"
                  sublabel={`${metrics.cpu.cores} cores · ${metrics.cpu.model.split(' ').slice(0, 3).join(' ')}`}
                />
              </Card>
              <Card className="p-6">
                <GaugeRing
                  value={metrics.memory.percentage}
                  color={metrics.memory.percentage > 85 ? '#f43f5e' : metrics.memory.percentage > 70 ? '#f59e0b' : '#2563eb'}
                  label="System Memory"
                  sublabel={`${metrics.memory.used.toLocaleString()} / ${metrics.memory.total.toLocaleString()} MB`}
                />
              </Card>
              <Card className="p-6">
                <GaugeRing
                  value={metrics.heap.percentage}
                  color={metrics.heap.percentage > 85 ? '#f43f5e' : metrics.heap.percentage > 70 ? '#f59e0b' : '#0d9488'}
                  label="Heap Memory"
                  sublabel={`${metrics.heap.used} / ${metrics.heap.total} MB`}
                />
              </Card>
            </div>

            {/* Details grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                    <Clock size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Process Uptime</p>
                    <p className="text-lg font-semibold" style={{ fontFamily: '"Lexend", "Inter", sans-serif' }}>
                      {formatUptime(metrics.uptime.process)}
                    </p>
                  </div>
                </div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-teal-50 text-teal-600 dark:bg-teal-500/10 dark:text-teal-400">
                    <Server size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">System Uptime</p>
                    <p className="text-lg font-semibold" style={{ fontFamily: '"Lexend", "Inter", sans-serif' }}>
                      {formatUptime(metrics.uptime.system)}
                    </p>
                  </div>
                </div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                    <HardDrive size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Platform</p>
                    <p className="text-sm font-semibold">{metrics.platform.os}</p>
                    <p className="text-xs text-slate-400">{metrics.platform.arch}</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400">
                    <Gauge size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Runtime</p>
                    <p className="text-sm font-semibold">{metrics.platform.nodeVersion}</p>
                    <p className="text-xs text-slate-400">{metrics.platform.hostname}</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Health Checks */}
            {health && (
              <Card className="p-4 sm:p-6">
                <div className="mb-4 flex items-center gap-2">
                  <span className={`relative flex h-2.5 w-2.5`}>
                    <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${
                      health.overall === 'healthy' ? 'bg-emerald-400' : 'bg-amber-400'
                    }`} />
                    <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${
                      health.overall === 'healthy' ? 'bg-emerald-500' : 'bg-amber-500'
                    }`} />
                  </span>
                  <h3 className="text-sm font-semibold">Service Health Checks</h3>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {health.checks.map((c) => (
                    <div key={c.service} className="flex items-center justify-between rounded-xl border border-slate-100 px-4 py-3 dark:border-slate-800">
                      <div>
                        <p className="text-sm font-medium">{c.service}</p>
                        <p className="text-xs text-slate-400">{c.details}</p>
                      </div>
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        c.status === 'healthy'
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'
                          : c.status === 'degraded'
                            ? 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400'
                            : 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400'
                      }`}>
                        {c.status}
                        {c.latencyMs !== undefined && ` · ${c.latencyMs}ms`}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </>
        )}
      </div>
    </AdminLayout>
  )
}
