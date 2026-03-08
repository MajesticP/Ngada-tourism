export const dynamic = 'force-dynamic'

import { db } from '@/lib/db'
import Link from 'next/link'
import { getSession } from '@/lib/auth'
import KecamatanManager from '@/components/admin/KecamatanManager'

export default async function AdminKecamatanPage() {
  await getSession() // pastikan user sudah login
  const kecamatan = await db.kecamatan.findMany({
    orderBy: { nama_kecamatan: 'asc' },
    include: { _count: { select: { tempat_wisata: true } } },
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-forest-900">Data Kecamatan</h1>
        <p className="text-forest-500 text-sm mt-1">{kecamatan.length} kecamatan terdaftar di Kabupaten Ngada</p>
      </div>
      <KecamatanManager
        initialData={kecamatan.map(k => ({
          id: k.id_kecamatan,
          nama: k.nama_kecamatan,
          countWisata: k._count.tempat_wisata,
        }))}
      />
    </div>
  )
}
