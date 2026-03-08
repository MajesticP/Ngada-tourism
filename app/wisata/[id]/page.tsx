export const dynamic = 'force-dynamic'

import { db } from '@/lib/db'
import { notFound } from 'next/navigation'
import WisataForm from '@/components/admin/WisataForm'
import PhotoUploader from '@/components/admin/PhotoUploader'

export default async function EditWisataPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: idStr } = await params
  const id = parseInt(idStr)
  const [wisata, kecamatan] = await Promise.all([
    db.tempatWisata.findUnique({
      where: { id_tempat_wisata: id },
      include: { lokasi: true, galeri: true, fotos: { orderBy: { urutan: 'asc' } } },
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
      >
        {/* Gallery section */}
        <div className="bg-white rounded-2xl shadow-sm border border-ngada-100 p-6 space-y-4">
          <div className="border-b border-ngada-100 pb-3">
            <h2 className="font-display text-base text-forest-800">Galeri Foto</h2>
            <p className="text-xs text-forest-400 mt-1">Upload hingga 5 foto untuk ditampilkan sebagai carousel</p>
          </div>
          <PhotoUploader
            wisataId={wisata.id_tempat_wisata}
            initialPhotos={wisata.fotos}
          />
        </div>
      </WisataForm>
    </div>
  )
}
