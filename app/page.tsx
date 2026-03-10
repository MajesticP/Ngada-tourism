export const dynamic = 'force-dynamic'

import { db } from '@/lib/db'
import HomePageClient from '@/components/public/HomePageClient'

export default async function HomePage() {
  const [wisata, kabupaten, totalWisata, totalKampung, totalPulau] = await Promise.all([
    db.tempatWisata.findMany({
      include: { kabupaten: true, galeri: true },
      orderBy: { id_tempat_wisata: 'asc' },
      take: 6,
    }),
    db.kabupaten.findMany({ orderBy: { nama_kabupaten: 'asc' } }),
    db.tempatWisata.count(),
    db.tempatWisata.count({ where: { kategori: 'kampung_adat' } as any }),
    db.tempatWisata.count({ where: { kategori: 'pulau_eksotis' } as any }),
  ])

  return (
    <HomePageClient
      wisataData={wisata}
      kabupatenList={kabupaten}
      totalWisata={totalWisata}
      totalKampung={totalKampung}
      totalPulau={totalPulau}
    />
  )
}
