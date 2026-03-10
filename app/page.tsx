export const dynamic = 'force-dynamic'

import { db } from '@/lib/db'
import HomePageClient from '@/components/public/HomePageClient'

export default async function HomePage() {
  const [wisata, kecamatan, totalWisata, totalKampung, totalPulau] = await Promise.all([
    db.tempatWisata.findMany({
      include: { kecamatan: true, galeri: true },
      orderBy: { id_tempat_wisata: 'asc' },
      take: 6,
    }),
    db.kecamatan.findMany({ orderBy: { nama_kecamatan: 'asc' } }),
    db.tempatWisata.count(),
    db.tempatWisata.count({ where: { kategori: 'kampung_adat' } as any }),
    db.tempatWisata.count({ where: { kategori: 'pulau_eksotis' } as any }),
  ])

  return (
    <HomePageClient
      wisataData={wisata}
      kecamatanList={kecamatan}
      totalWisata={totalWisata}
      totalKampung={totalKampung}
      totalPulau={totalPulau}
    />
  )
}
