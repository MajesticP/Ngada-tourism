'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { LayoutDashboard, MapPin, Map, Users, Globe, ChevronRight, Inbox } from 'lucide-react'

const navItems = [
  { href: '/admin/dashboard',  label: 'Dashboard',     icon: LayoutDashboard },
  { href: '/admin/wisata',     label: 'Tempat Wisata', icon: Globe },
  { href: '/admin/kecamatan',  label: 'Kecamatan',     icon: Map },
  { href: '/admin/pesan',      label: 'Pesan Masuk',   icon: Inbox, badge: true },
  { href: '/admin/admins',     label: 'Data Admin',    icon: Users },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const [unread, setUnread] = useState(0)

  useEffect(() => {
    const fetchUnread = () => {
      fetch('/api/pesan?filter=unread')
        .then(r => r.ok ? r.json() : null)
        .then(data => { if (data) setUnread(data.unreadCount) })
        .catch(() => {})
    }
    fetchUnread()
    const interval = setInterval(fetchUnread, 60_000)
    return () => clearInterval(interval)
  }, [])

  return (
    <aside className="w-64 bg-forest-900 flex-shrink-0 flex flex-col hidden lg:flex">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-ngada-500 flex items-center justify-center">
            <MapPin size={16} className="text-white" />
          </div>
          <div>
            <div className="font-display text-white text-lg font-semibold leading-none">Ngada</div>
            <div className="text-ngada-300 text-xs mt-0.5">Admin Panel</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <p className="text-white/30 text-xs uppercase tracking-widest px-3 py-2">Menu Utama</p>
        {navItems.map(item => {
          const Icon = item.icon
          const active = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`admin-sidebar-link ${active ? 'active' : ''}`}
            >
              <Icon size={18} />
              <span className="flex-1">{item.label}</span>
              {item.badge && unread > 0 && !active && (
                <span className="bg-terra-500 text-white text-xs font-semibold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                  {unread > 99 ? '99+' : unread}
                </span>
              )}
              {active && <ChevronRight size={14} className="opacity-70" />}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/10">
        <Link href="/" target="_blank" className="admin-sidebar-link text-xs">
          <Globe size={15} />
          Lihat Situs Publik
        </Link>
      </div>
    </aside>
  )
}
