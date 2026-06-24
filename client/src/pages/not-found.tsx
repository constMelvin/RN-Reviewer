import React from 'react'
import { Link } from '@tanstack/react-router'
import { Home, AlertTriangle } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-50 dark:bg-[#0a0f1c] text-slate-900 dark:text-slate-100 p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <div className="grid h-24 w-24 place-items-center rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400">
            <AlertTriangle size={48} />
          </div>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight" style={{ fontFamily: '"Lexend", "Inter", sans-serif' }}>
            404
          </h1>
          <h2 className="text-2xl font-semibold">Page Not Found</h2>
          <p className="text-slate-500 dark:text-slate-400">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="pt-4">
          <Link
            to="/home"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700 shadow-sm"
          >
            <Home size={18} />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
