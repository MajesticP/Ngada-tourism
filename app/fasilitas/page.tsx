export const dynamic = 'force-dynamic'

import { db } from '@/lib/db'
import FasilitasClient from '@/components/public/FasilitasClient'

export const metadata = {
  title: 'Fasilitas Wisata — Wisata Ngada',
  description: 'Data fasilitas lengkap tempat wisata di Kabupaten Ngada: akses jalan, parkir, toilet, ATM, dan layanan darurat.',
}

export default async function FasilitasPage() {
  const wisata = await db.tempatWisata.findMany({
    orderBy: { nama_tempat_wisata: 'asc' },
    select: {
      id_tempat_wisata:   true,
      nama_tempat_wisata: true,
      alamat:             true,
      kategori:           true,
      akses_jalan:        true,
      parkir:             true,
      toilet:             true,
      jarak_atm:          true,
      jarak_rs:           true,
      spot_foto:          true,
      galeri: {
        select: { gambar: true },
      },
    },
  })

  return <FasilitasClient wisata={wisata} />
}
