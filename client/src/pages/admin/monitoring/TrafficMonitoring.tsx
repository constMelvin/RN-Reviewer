import React, { useState } from 'react'
import {
  LineChart, Line, AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts'
import { Signal, AlertCircle, Clock, Gauge } from 'lucide-react'
import { useTrafficMetrics } from '@/hooks/admin/use-admin-monitoring'
import AdminLayout from '../layout/AdminLayout'

function Card({ className = '', children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={`rounded-2xl border border-slate-200/70 bg-white/80 shadow-sm backdrop-blur-sm transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-900/60 ${className}`}>
      {children}
    </div>
  )
}

export default function TrafficMonitoring() {
  const [hours, setHours] = useState(24)
  const { data: traffic, isLoading } = useTrafficMetrics(hours)

  // Compute aggregates
  const avgResponseTime = traffic && traffic.length > 0
    ? Math.round(traffic.reduce((a, b) => a + b.avg_response_time_ms, 0) / traffic.length)
    : 0
  const totalRequests = traffic?.reduce((a, b) => a + b.requests_per_minute, 0) ?? 0
  const totalErrors = traffic?.reduce((a, b) => a + b.error_count, 0) ?? 0
  const errorRate = totalRequests > 0 ? ((totalErrors / totalRequests) * 100).toFixed(2) : '0'

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold" style={{ fontFamily: '"Lexend", "Inter", sans-serif' }}>
              Traffic Monitoring
            </h2>
            <p className="text-sm text-slate-400">Request rate, response time, and error tracking · Auto-refresh 30s</p>
          </div>
          <div className="flex gap-1 rounded-xl border border-slate-200 p-1 dark:border-slate-800">
            {[
              { label: '1H', value: 1 },
              { label: '6H', value: 6 },
              { label: '24H', value: 24 },
            ].map((r) => (
              <button
                key={r.value}
                onClick={() => setHours(r.value)}
                className={`rounded-lg px-3 py-1 text-xs font-medium transition-colors ${
                  hours === r.value
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                <Signal size={20} />
              </div>
              <div>
                <p className="text-xs text-slate-400">Total Requests</p>
                <p className="text-lg font-semibold" style={{ fontFamily: '"Lexend", "Inter", sans-serif' }}>
                  {totalRequests.toLocaleString()}
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                <Gauge size={20} />
              </div>
              <div>
                <p className="text-xs text-slate-400">Avg Response Time</p>
                <p className="text-lg font-semibold" style={{ fontFamily: '"Lexend", "Inter", sans-serif' }}>
                  {avgResponseTime} ms
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400">
                <AlertCircle size={20} />
              </div>
              <div>
                <p className="text-xs text-slate-400">Error Rate</p>
                <p className="text-lg font-semibold" style={{ fontFamily: '"Lexend", "Inter", sans-serif' }}>
                  {errorRate}%
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">
                <Clock size={20} />
              </div>
              <div>
                <p className="text-xs text-slate-400">Total Errors</p>
                <p className="text-lg font-semibold" style={{ fontFamily: '"Lexend", "Inter", sans-serif' }}>
                  {totalErrors}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {isLoading || !traffic ? (
          <Card className="p-6">
            <div className="h-[300px] animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />
          </Card>
        ) : traffic.length === 0 ? (
          <Card className="p-6">
            <div className="flex flex-col items-center justify-center py-12 text-slate-400">
              <Signal size={32} className="mb-3 opacity-50" />
              <p className="text-sm">No traffic data yet. Metrics snapshots are captured every 60 seconds.</p>
              <p className="mt-1 text-xs">Data will appear here once the system starts collecting metrics.</p>
            </div>
          </Card>
        ) : (
          <>
            {/* Requests per minute chart */}
            <Card className="p-4 sm:p-6">
              <h3 className="mb-3 text-sm font-semibold">Requests per Minute</h3>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={traffic}>
                  <defs>
                    <linearGradient id="reqGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2563eb" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#2563eb" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="created_at"
                    stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false}
                    tickFormatter={(v: string) => new Date(v).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }}
                    labelFormatter={(v: string) => new Date(v).toLocaleString()}
                  />
                  <Area type="monotone" dataKey="requests_per_minute" name="Req/min" stroke="#2563eb" fill="url(#reqGrad)" strokeWidth={2} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </Card>

            {/* Response time + errors chart */}
            <Card className="p-4 sm:p-6">
              <h3 className="mb-3 text-sm font-semibold">Response Time & Errors</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={traffic}>
                  <XAxis
                    dataKey="created_at"
                    stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false}
                    tickFormatter={(v: string) => new Date(v).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }}
                    labelFormatter={(v: string) => new Date(v).toLocaleString()}
                  />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Line type="monotone" dataKey="avg_response_time_ms" name="Avg Response (ms)" stroke="#0d9488" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="error_count" name="Errors" stroke="#f43f5e" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </>
        )}
      </div>
    </AdminLayout>
  )
}
