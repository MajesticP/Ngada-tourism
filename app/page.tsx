export const dynamic = 'force-dynamic'

import { db } from '@/lib/db'
import HomePageClient from '@/components/public/HomePageClient'

// ✅ FIX: Server component fetches real wisata with correct DB IDs.
// The old version was 'use client' with hardcoded static IDs 1–6,
// which caused 404s when those IDs didn't exist in the database.
export default async function HomePage() {
  const wisata = await db.tempatWisata.findMany({
    include: { kecamatan: true, galeri: true },
    orderBy: { id_tempat_wisata: 'asc' },
    take: 6,
  })
  return <HomePageClient wisataData={wisata} />
}
