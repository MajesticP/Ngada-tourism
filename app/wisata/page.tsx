export const dynamic = 'force-dynamic'

import { db } from '@/lib/db'
import { Suspense } from 'react'
import WisataGrid from '@/components/public/WisataGrid'
import Navbar from '@/components/public/Navbar'
import Footer from '@/components/public/Footer'
import { Search, Filter } from 'lucide-react'

async function getWisata(search?: string, kabupaten?: string) {
  return db.tempatWisata.findMany({
    where: {
      AND: [
        search ? { nama_tempat_wisata: { contains: search } } : {},
        kabupaten ? { kabupaten: { nama_kabupaten: { contains: kabupaten } } } : {},
      ],
    },
    include: {
      kabupaten: true,
      lokasi: true,
      galeri: true,
    },
    orderBy: { id_tempat_wisata: 'asc' },
  })
}

async function getKabupaten() {
  return db.kabupaten.findMany({ orderBy: { nama_kabupaten: 'asc' } })
}

export default async function WisataPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; kabupaten?: string }>
}) {
  const { search, kabupaten } = await searchParams
  const [wisata, kabupatenList] = await Promise.all([
    getWisata(search, kabupaten),
    getKabupaten(),
  ])

  return (
    <main className="min-h-screen bg-ngada-50">
      <Navbar />

      {/* Header */}
      <section className="relative pt-32 pb-16 px-6 bg-forest-800 text-white overflow-hidden">
        <div
          className="absolute inset-0 opacity-20 bg-cover bg-center"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1559494007-9f5847c49d94?w=1600&q=80)' }}
        />
        <div className="relative max-w-4xl mx-auto text-center">
          <p className="text-ngada-300 uppercase tracking-widest text-sm mb-3">Temukan Destinasi</p>
          <h1 className="font-display text-4xl md:text-6xl mb-4">Semua Tempat Wisata</h1>
          <p className="text-white/70 text-lg max-w-xl mx-auto">
            {wisata.length} destinasi menakjubkan menanti Anda di Kabupaten Ngada
          </p>
        </div>
      </section>

      {/* Search & Filter */}
      <section className="sticky top-16 z-40 bg-white border-b border-ngada-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row gap-3">
          <form className="flex-1 flex gap-3">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-forest-400" />
              <input
                type="text"
                name="search"
                defaultValue={search}
                placeholder="Cari tempat wisata..."
                className="input-field pl-10"
              />
            </div>
            <div className="relative">
              <Filter size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-forest-400" />
              <select
                name="kabupaten"
                defaultValue={kabupaten}
                className="input-field pl-10 pr-8 appearance-none min-w-[160px]"
              >
                <option value="">Semua Kabupaten</option>
                {kabupatenList.map(k => (
                  <option key={k.id_kabupaten} value={k.nama_kabupaten}>
                    {k.nama_kabupaten}
                  </option>
                ))}
              </select>
            </div>
            <button type="submit" className="btn-primary whitespace-nowrap">
              Cari
            </button>
          </form>
        </div>
      </section>

      {/* Grid */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <Suspense fallback={<WisataSkeleton />}>
            <WisataGrid wisata={wisata} />
          </Suspense>
        </div>
      </section>

      <Footer />
    </main>
  )
}

function WisataSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
          <div className="h-56 bg-ngada-100" />
          <div className="p-5 space-y-3">
            <div className="h-3 bg-ngada-100 rounded w-1/3" />
            <div className="h-5 bg-ngada-100 rounded w-2/3" />
            <div className="h-3 bg-ngada-100 rounded w-full" />
          </div>
        </div>
      ))}
    </div>
  )
}
