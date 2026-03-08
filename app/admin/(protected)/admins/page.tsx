export const dynamic = 'force-dynamic'

import { db } from '@/lib/db'
import Link from 'next/link'
import { Users } from 'lucide-react'

export default async function AdminsPage() {
  const admins = await db.admin.findMany({ orderBy: { id_admin: 'asc' } })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-forest-900">Data Admin</h1>
        <p className="text-forest-500 text-sm mt-1">{admins.length} admin terdaftar</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-ngada-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-forest-800 text-white text-left">
              <th className="px-5 py-3.5 font-medium">No</th>
              <th className="px-5 py-3.5 font-medium">Username</th>
              <th className="px-5 py-3.5 font-medium text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ngada-50">
            {admins.map((admin, i) => (
              <tr key={admin.id_admin} className="hover:bg-ngada-50/50">
                <td className="px-5 py-3.5 text-forest-400">{i + 1}</td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-forest-700 flex items-center justify-center">
                      <Users size={14} className="text-white" />
                    </div>
                    <span className="font-medium text-forest-900">{admin.username}</span>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-center">
                  <Link
                    href={`/admin/admins/${admin.id_admin}/edit`}
                    className="text-xs bg-ngada-50 text-ngada-600 hover:bg-ngada-100 px-3 py-1.5 rounded-lg transition-colors font-medium"
                  >
                    Ganti Password
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}