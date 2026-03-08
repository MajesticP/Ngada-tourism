export const dynamic = 'force-dynamic'

import { db } from '@/lib/db'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import Navbar from '@/components/public/Navbar'
import Footer from '@/components/public/Footer'
import { MapPin, ArrowLeft, Map } from 'lucide-react'

async function getWisata(id: string) {
  return db.tempatWisata.findUnique({
    where: { id_tempat_wisata: parseInt(id) },
    include: { kecamatan: true, lokasi: true, galeri: true },
  })
}

async function getRelated(kecamatanId: number | null, currentId: number) {
  if (!kecamatanId) return []
  return db.tempatWisata.findMany({
    where: { id_kecamatan: kecamatanId, id_tempat_wisata: { not: currentId } },
    include: { galeri: true, kecamatan: true },
    take: 3,
  })
}

const IMAGE_FALLBACKS = [
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80',
  'https://images.unsplash.com/photo-1559494007-9f5847c49d94?w=1200&q=80',
  'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=1200&q=80',
]

export default async function WisataDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const wisata = await getWisata(id)
  if (!wisata) notFound()

  const related = await getRelated(wisata.id_kecamatan, wisata.id_tempat_wisata)
  const imgSrc = wisata.galeri?.gambar
    ? wisata.galeri.gambar.startsWith("http") ? wisata.galeri.gambar : `/uploads/${wisata.galeri.gambar}`
    : IMAGE_FALLBACKS[wisata.id_tempat_wisata % IMAGE_FALLBACKS.length]

  const hasMap = wisata.lokasi?.lat && wisata.lokasi?.lng

  return (
    <main className="min-h-screen bg-ngada-50">
      <Navbar />

      {/* Hero image */}
      <div className="relative h-[60vh] min-h-[400px]">
        <Image src={imgSrc} alt={wisata.nama_tempat_wisata} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/70" />

        <div className="absolute bottom-8 left-0 right-0 px-6">
          <div className="max-w-4xl mx-auto">
            <Link
              href="/wisata"
              className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm mb-4 transition-colors"
            >
              <ArrowLeft size={14} /> Kembali ke Daftar Wisata
            </Link>
            <h1 className="font-display text-4xl md:text-5xl text-white leading-tight">
              {wisata.nama_tempat_wisata}
            </h1>
            <div className="flex items-center gap-2 text-white/70 text-sm mt-2">
              <MapPin size={13} />
              <span>{wisata.kecamatan?.nama_kecamatan} — {wisata.alamat}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Main info */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl p-8 shadow-sm">
                <h2 className="font-display text-2xl text-forest-900 mb-4">Tentang Tempat Wisata Ini</h2>
                <p className="text-forest-700 leading-relaxed text-base">{wisata.informasi1}</p>
              </div>

              {/* Location detail */}
              <div className="bg-white rounded-2xl p-8 shadow-sm">
                <h3 className="font-display text-xl text-forest-900 mb-3">Detail Lokasi</h3>
                <p className="text-forest-600 text-sm">{wisata.alamat}</p>

                {hasMap && (
                  <a
                    href={`https://www.google.com/maps?q=${wisata.lokasi!.lat},${wisata.lokasi!.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-4 text-ngada-500 hover:text-ngada-600 text-sm font-medium transition-colors"
                  >
                    <Map size={14} /> Lihat di Google Maps
                  </a>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-5">
              <div className="bg-forest-800 text-white rounded-2xl p-6">
                <h3 className="font-display text-lg mb-4 text-ngada-200">Informasi</h3>
                <dl className="space-y-3 text-sm">
                  <div>
                    <dt className="text-white/50">Kecamatan</dt>
                    <dd className="text-white font-medium">{wisata.kecamatan?.nama_kecamatan ?? '—'}</dd>
                  </div>
                  {hasMap && (
                    <div>
                      <dt className="text-white/50">Koordinat</dt>
                      <dd className="text-white font-medium font-mono text-xs">
                        {wisata.lokasi!.lat?.toFixed(5)}, {wisata.lokasi!.lng?.toFixed(5)}
                      </dd>
                    </div>
                  )}
                  {wisata.galeri?.keterangan && (
                    <div>
                      <dt className="text-white/50">Keterangan Foto</dt>
                      <dd className="text-white">{wisata.galeri.keterangan}</dd>
                    </div>
                  )}
                </dl>
              </div>

              <Link
                href="/wisata"
                className="block text-center btn-outline w-full"
              >
                ← Destinasi Lain
              </Link>
            </div>
          </div>

          {/* Related wisata */}
          {related.length > 0 && (
            <div className="mt-14">
              <h2 className="font-display text-2xl text-forest-900 mb-6">
                Wisata Lain di {wisata.kecamatan?.nama_kecamatan}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {related.map((r, i) => (
                  <Link key={r.id_tempat_wisata} href={`/wisata/${r.id_tempat_wisata}`} className="card-wisata block">
                    <div className="relative h-40 overflow-hidden">
                      <Image
                        src={r.galeri?.gambar ? r.galeri.gambar.startsWith("http") ? r.galeri.gambar : `/uploads/${r.galeri.gambar}` : IMAGE_FALLBACKS[i % IMAGE_FALLBACKS.length]}
                        alt={r.nama_tempat_wisata}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    </div>
                    <div className="p-4">
                      <h4 className="font-display text-base text-forest-900 group-hover:text-ngada-600 transition-colors">
                        {r.nama_tempat_wisata}
                      </h4>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}
