export const dynamic = 'force-dynamic'

import { db } from '@/lib/db'
import WisataForm from '@/components/admin/WisataForm'

export default async function NewWisataPage() {
  const kecamatan = await db.kecamatan.findMany({ orderBy: { nama_kecamatan: 'asc' } })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-forest-900">Tambah Tempat Wisata</h1>
        <p className="text-forest-500 text-sm mt-1">Isi semua informasi termasuk foto dan koordinat GPS di bawah ini</p>
      </div>
      <WisataForm kecamatan={kecamatan} />
    </div>
  )
}
