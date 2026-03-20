export const dynamic = 'force-dynamic'

import { db } from '@/lib/db'
import { getSession } from '@/lib/auth'
import KabupatenManager from '@/components/admin/KabupatenManager'

export default async function AdminKecamatanPage() {
  await getSession()
  const kabupaten = await db.kabupaten.findMany({
    orderBy: { nama_kabupaten: 'asc' },
    include: { _count: { select: { tempat_wisata: true } } },
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-forest-900">Data Kecamatan</h1>
        <p className="text-forest-500 text-sm mt-1">{kabupaten.length} kecamatan terdaftar di Kabupaten Ngada</p>
      </div>
      <KabupatenManager
        initialData={kabupaten.map(k => ({
          id: k.id_kabupaten,
          nama: k.nama_kabupaten,
          countWisata: k._count.tempat_wisata,
        }))}
      />
    </div>
  )
}
