'use client'

import { useState } from 'react'
import { LogOut, Bell, User } from 'lucide-react'

type TopbarProps = {
  user: { name?: string | null } | undefined
}

export default function AdminTopbar({ user }: TopbarProps) {
  const [confirmLogout, setConfirmLogout] = useState(false)

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    window.location.href = '/admin/login'
  }

  return (
    <header className="h-16 bg-white border-b border-ngada-100 flex items-center justify-between px-6 lg:px-6 pl-16 lg:pl-6 flex-shrink-0 shadow-sm">
      <div>
        <h2 className="text-sm font-medium text-forest-900">
          Selamat datang,{' '}
          <span className="text-ngada-600 font-semibold">{user?.name ?? 'Admin'}</span>
        </h2>
        <p className="text-xs text-forest-400">
          {new Date().toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button className="w-9 h-9 rounded-full bg-ngada-50 hover:bg-ngada-100 flex items-center justify-center text-forest-500 transition-colors">
          <Bell size={16} />
        </button>

        <div className="flex items-center gap-2 bg-ngada-50 rounded-full pl-2 pr-4 py-1.5">
          <div className="w-7 h-7 rounded-full bg-forest-700 flex items-center justify-center">
            <User size={13} className="text-white" />
          </div>
          <span className="text-sm font-medium text-forest-700">{user?.name ?? 'Admin'}</span>
        </div>

        {!confirmLogout ? (
          <button
            onClick={() => setConfirmLogout(true)}
            className="flex items-center gap-1.5 text-sm text-forest-400 hover:text-terra-600 transition-colors px-3 py-2 rounded-lg hover:bg-terra-50"
          >
            <LogOut size={15} />
            Logout
          </button>
        ) : (
          <div className="flex items-center gap-2 bg-terra-50 border border-terra-200 rounded-lg px-3 py-1.5">
            <span className="text-xs text-terra-700">Yakin?</span>
            <button
              onClick={handleLogout}
              className="text-xs font-semibold text-terra-700 hover:text-terra-800"
            >
              Ya
            </button>
            <span className="text-terra-300">|</span>
            <button
              onClick={() => setConfirmLogout(false)}
              className="text-xs text-forest-500 hover:text-forest-700"
            >
              Batal
            </button>
          </div>
        )}
      </div>
    </header>
  )
}