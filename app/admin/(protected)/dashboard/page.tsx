export const dynamic = 'force-dynamic'

import { db } from '@/lib/db'
import DashboardCharts from '@/components/admin/DashboardCharts'
import { Globe, Image, Map, MapPin, Users, TrendingUp, Clock, Plus, Inbox } from 'lucide-react'
import Link from 'next/link'

async function getDashboardStats() {
  const [totalWisata, totalGaleri, totalKecamatan, totalLokasi, totalAdmin, unreadPesan, recentWisata, wisataPerKecamatan] =
    await Promise.all([
      db.tempatWisata.count(),
      db.galeri.count(),
      db.kecamatan.count(),
      db.lokasi.count(),
      db.admin.count(),
      db.pesan.count({ where: { sudah_baca: false } }),
      db.tempatWisata.findMany({
        take: 5,
        orderBy: { created_at: 'desc' },
        include: { kecamatan: true, galeri: true },
      }),
      db.kecamatan.findMany({
        include: { _count: { select: { tempat_wisata: true } } },
        orderBy: { nama_kecamatan: 'asc' },
      }),
    ])

  return { totalWisata, totalGaleri, totalKecamatan, totalLokasi, totalAdmin, unreadPesan, recentWisata, wisataPerKecamatan }
}

export default async function DashboardPage() {
  const { totalWisata, totalGaleri, totalKecamatan, totalLokasi, totalAdmin, unreadPesan, recentWisata, wisataPerKecamatan } =
    await getDashboardStats()

  const stats = [
    { label: 'Tempat Wisata', value: totalWisata, icon: Globe, color: 'text-forest-600', bg: 'bg-forest-50', border: 'border-forest-200', href: '/admin/wisata' },
    { label: 'Galeri Foto', value: totalGaleri, icon: Image, color: 'text-ngada-600', bg: 'bg-ngada-50', border: 'border-ngada-200', href: '/admin/galeri' },
    { label: 'Kecamatan', value: totalKecamatan, icon: Map, color: 'text-terra-600', bg: 'bg-terra-50', border: 'border-terra-200', href: '/admin/kecamatan' },
    { label: 'Titik Lokasi', value: totalLokasi, icon: MapPin, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200', href: '/admin/lokasi' },
    { label: 'Pesan Baru', value: unreadPesan, icon: Inbox, color: 'text-terra-600', bg: 'bg-terra-50', border: unreadPesan > 0 ? 'border-terra-400' : 'border-terra-200', href: '/admin/pesan' },
  ]

  const chartData = wisataPerKecamatan
    .filter(k => k._count.tempat_wisata > 0)
    .map(k => ({ name: k.nama_kecamatan, value: k._count.tempat_wisata }))

  const quickActions = [
    { href: '/admin/wisata/new', label: 'Tambah Wisata', icon: Plus, color: 'bg-forest-600 hover:bg-forest-700' },
    { href: '/admin/galeri/new', label: 'Upload Foto', icon: Plus, color: 'bg-ngada-500 hover:bg-ngada-600' },
    { href: '/admin/kecamatan/new', label: 'Tambah Kecamatan', icon: Plus, color: 'bg-terra-500 hover:bg-terra-600' },
    { href: '/admin/lokasi/new', label: 'Tambah Lokasi', icon: Plus, color: 'bg-purple-600 hover:bg-purple-700' },
  ]

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h1 className="font-display text-3xl text-forest-900">Dashboard</h1>
        <p className="text-forest-500 text-sm mt-1">Ringkasan dan statistik Wisata Ngada</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Link key={stat.label} href={stat.href} className={`stat-card ${stat.border} border hover:scale-105 transition-transform`}>
              <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center mb-3`}>
                <Icon size={20} className={stat.color} />
              </div>
              <p className="text-2xl font-bold text-forest-900">{stat.value}</p>
              <p className="text-xs text-forest-500 mt-0.5">{stat.label}</p>
            </Link>
          )
        })}
      </div>

      {/* Chart + Quick actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-ngada-100">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp size={18} className="text-ngada-500" />
            <h2 className="font-display text-lg text-forest-900">Wisata per Kecamatan</h2>
          </div>
          <DashboardCharts data={chartData} />
        </div>

        {/* Quick actions */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-ngada-100">
          <h2 className="font-display text-lg text-forest-900 mb-4">Aksi Cepat</h2>
          <div className="space-y-3">
            {quickActions.map(action => {
              const Icon = action.icon
              return (
                <Link
                  key={action.href}
                  href={action.href}
                  className={`flex items-center gap-3 ${action.color} text-white px-4 py-3 rounded-xl text-sm font-medium transition-all`}
                >
                  <Icon size={16} />
                  {action.label}
                </Link>
              )
            })}
          </div>
        </div>
      </div>

      {/* Recent wisata */}
      <div className="bg-white rounded-2xl shadow-sm border border-ngada-100 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-ngada-50">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-ngada-500" />
            <h2 className="font-display text-lg text-forest-900">Wisata Terbaru</h2>
          </div>
          <Link href="/admin/wisata" className="text-xs text-ngada-500 hover:text-ngada-700 font-medium">
            Lihat Semua →
          </Link>
        </div>
        <div className="divide-y divide-ngada-50">
          {recentWisata.length === 0 ? (
            <p className="p-6 text-forest-400 text-sm text-center">Belum ada data wisata</p>
          ) : (
            recentWisata.map(w => (
              <div key={w.id_tempat_wisata} className="flex items-center gap-4 px-6 py-4 hover:bg-ngada-50/50 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-forest-100 flex items-center justify-center flex-shrink-0">
                  <Globe size={16} className="text-forest-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-forest-900 text-sm truncate">{w.nama_tempat_wisata}</p>
                  <p className="text-xs text-forest-400">{w.kecamatan?.nama_kecamatan ?? '—'}</p>
                </div>
                <div className="text-xs text-forest-400">
                  {new Date(w.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                </div>
                <Link href={`/admin/wisata/${w.id_tempat_wisata}/edit`} className="text-xs text-ngada-500 hover:text-ngada-700 font-medium ml-2">
                  Edit
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
