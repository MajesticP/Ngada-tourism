export const dynamic = 'force-dynamic'

import { db } from '@/lib/db'
import HomePageClient from '@/components/public/HomePageClient'

export default async function HomePage() {
  const [wisata, kecamatan] = await Promise.all([
    db.tempatWisata.findMany({
      include: { kecamatan: true, galeri: true },
      orderBy: { id_tempat_wisata: 'asc' },
      take: 6,
    }),
    db.kecamatan.findMany({
      orderBy: { nama_kecamatan: 'asc' },
    }),
  ])

  const totalWisata = await db.tempatWisata.count()

  return (
    <HomePageClient
      wisataData={wisata}
      kecamatanList={kecamatan}
      totalWisata={totalWisata}
    />
  )
}
