export const dynamic = 'force-dynamic'

import { db } from '@/lib/db'
import { notFound } from 'next/navigation'
import WisataForm from '@/components/admin/WisataForm'

export default async function EditWisataPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: idStr } = await params
  const id = parseInt(idStr)
  const [wisata, kecamatan] = await Promise.all([
    db.tempatWisata.findUnique({
      where: { id_tempat_wisata: id },
      include: { lokasi: true, galeri: true },
    }),
    db.kecamatan.findMany({ orderBy: { nama_kecamatan: 'asc' } }),
  ])

  if (!wisata) notFound()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-forest-900">Edit Tempat Wisata</h1>
        <p className="text-forest-500 text-sm mt-1">{wisata.nama_tempat_wisata}</p>
      </div>
      <WisataForm
        kecamatan={kecamatan}
        defaultValues={{
          id:                  wisata.id_tempat_wisata,
          nama_tempat_wisata:  wisata.nama_tempat_wisata,
          alamat:              wisata.alamat,
          informasi1:          wisata.informasi1,
          id_kecamatan:        wisata.id_kecamatan,
          galeri_nama:         wisata.galeri?.nama_galeri ?? '',
          galeri_gambar:       wisata.galeri?.gambar ?? '',
          galeri_keterangan:   wisata.galeri?.keterangan ?? '',
          lat:                 wisata.lokasi?.lat ?? null,
          lng:                 wisata.lokasi?.lng ?? null,
        }}
      />
    </div>
  )
}
