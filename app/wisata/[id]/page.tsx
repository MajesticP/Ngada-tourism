export const dynamic = 'force-dynamic'

import { db } from '@/lib/db'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import Navbar from '@/components/public/Navbar'
import Footer from '@/components/public/Footer'
import PhotoCarousel from '@/components/public/PhotoCarousel'
import { MapPin, ArrowLeft, Map, Car, ParkingCircle, Toilet, Landmark, Phone, Camera } from 'lucide-react'

async function getWisata(id: string) {
  return db.tempatWisata.findUnique({
    where: { id_tempat_wisata: parseInt(id) },
    include: { kabupaten: true, lokasi: true, galeri: true, fotos: { orderBy: { urutan: 'asc' } } },
  })
}

async function getRelated(kabupatenId: number | null, currentId: number) {
  if (!kabupatenId) return []
  return db.tempatWisata.findMany({
    where: { id_kabupaten: kabupatenId, id_tempat_wisata: { not: currentId } },
    include: { galeri: true, kabupaten: true, fotos: { orderBy: { urutan: 'asc' }, take: 1 } },
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

  const related = await getRelated(wisata.id_kabupaten, wisata.id_tempat_wisata)

  // Build photo list: fotos table first, fallback to galeri, fallback to unsplash
  const photos = wisata.fotos.length > 0
    ? wisata.fotos
    : wisata.galeri?.gambar
      ? [{ id_foto: 0, url: wisata.galeri.gambar.startsWith('http') ? wisata.galeri.gambar : `/uploads/${wisata.galeri.gambar}`, urutan: 0 }]
      : [{ id_foto: 0, url: IMAGE_FALLBACKS[wisata.id_tempat_wisata % IMAGE_FALLBACKS.length], urutan: 0 }]

  const hasMap = wisata.lokasi?.lat && wisata.lokasi?.lng

  return (
    <main className="min-h-screen bg-ngada-50">
      <Navbar />

      {/* Photo carousel */}
      <div className="relative">
        <PhotoCarousel photos={photos} alt={wisata.nama_tempat_wisata} />

        <div className="absolute bottom-8 left-0 right-0 px-6 pointer-events-none">
          <div className="max-w-4xl mx-auto">
            <Link
              href="/wisata"
              className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm mb-4 transition-colors pointer-events-auto"
            >
              <ArrowLeft size={14} /> Kembali ke Daftar Wisata
            </Link>
            <h1 className="font-display text-4xl md:text-5xl text-white leading-tight">
              {wisata.nama_tempat_wisata}
            </h1>
            <div className="flex items-center gap-2 text-white/70 text-sm mt-2">
              <MapPin size={13} />
              <span>{wisata.kabupaten?.nama_kabupaten} — {wisata.alamat}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl p-8 shadow-sm">
                <h2 className="font-display text-2xl text-forest-900 mb-4">Tentang Tempat Wisata Ini</h2>
                <p className="text-forest-700 leading-relaxed text-base">{wisata.informasi1}</p>
              </div>

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

              {/* ── Fasilitas ── */}
              {(wisata.akses_jalan || wisata.parkir || wisata.toilet || wisata.jarak_atm || wisata.jarak_rs || wisata.spot_foto) && (
                <div className="bg-white rounded-2xl p-8 shadow-sm">
                  <h3 className="font-display text-xl text-forest-900 mb-5">Fasilitas & Aksesibilitas</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {wisata.akses_jalan && (
                      <div className="flex items-start gap-3 p-3 rounded-xl bg-ngada-50 border border-ngada-100">
                        <div className="w-8 h-8 rounded-lg bg-forest-800 flex items-center justify-center flex-shrink-0">
                          <Car size={14} className="text-ngada-400" />
                        </div>
                        <div>
                          <p className="text-xs text-forest-400 font-medium">Akses Jalan</p>
                          <p className="text-sm text-forest-800 font-semibold mt-0.5">{wisata.akses_jalan}</p>
                        </div>
                      </div>
                    )}
                    {wisata.parkir && (
                      <div className="flex items-start gap-3 p-3 rounded-xl bg-ngada-50 border border-ngada-100">
                        <div className="w-8 h-8 rounded-lg bg-forest-800 flex items-center justify-center flex-shrink-0">
                          <ParkingCircle size={14} className="text-ngada-400" />
                        </div>
                        <div>
                          <p className="text-xs text-forest-400 font-medium">Parkir</p>
                          <p className="text-sm text-forest-800 font-semibold mt-0.5">{wisata.parkir}</p>
                        </div>
                      </div>
                    )}
                    {wisata.toilet && (
                      <div className="flex items-start gap-3 p-3 rounded-xl bg-ngada-50 border border-ngada-100">
                        <div className="w-8 h-8 rounded-lg bg-forest-800 flex items-center justify-center flex-shrink-0">
                          <Toilet size={14} className="text-ngada-400" />
                        </div>
                        <div>
                          <p className="text-xs text-forest-400 font-medium">Toilet</p>
                          <p className="text-sm text-forest-800 font-semibold mt-0.5">{wisata.toilet}</p>
                        </div>
                      </div>
                    )}
                    {wisata.jarak_atm && (
                      <div className="flex items-start gap-3 p-3 rounded-xl bg-ngada-50 border border-ngada-100">
                        <div className="w-8 h-8 rounded-lg bg-forest-800 flex items-center justify-center flex-shrink-0">
                          <Landmark size={14} className="text-ngada-400" />
                        </div>
                        <div>
                          <p className="text-xs text-forest-400 font-medium">Jarak ATM</p>
                          <p className="text-sm text-forest-800 font-semibold mt-0.5">{wisata.jarak_atm}</p>
                        </div>
                      </div>
                    )}
                    {wisata.jarak_rs && (
                      <div className="flex items-start gap-3 p-3 rounded-xl bg-ngada-50 border border-ngada-100 col-span-2 sm:col-span-1">
                        <div className="w-8 h-8 rounded-lg bg-forest-800 flex items-center justify-center flex-shrink-0">
                          <Phone size={14} className="text-ngada-400" />
                        </div>
                        <div>
                          <p className="text-xs text-forest-400 font-medium">RS / Puskesmas</p>
                          <p className="text-sm text-forest-800 font-semibold mt-0.5">{wisata.jarak_rs}</p>
                        </div>
                      </div>
                    )}
                    {wisata.spot_foto && (
                      <div className="flex items-start gap-3 p-3 rounded-xl bg-ngada-50 border border-ngada-100">
                        <div className="w-8 h-8 rounded-lg bg-forest-800 flex items-center justify-center flex-shrink-0">
                          <Camera size={14} className="text-ngada-400" />
                        </div>
                        <div>
                          <p className="text-xs text-forest-400 font-medium">Spot Foto</p>
                          <p className="text-sm text-forest-800 font-semibold mt-0.5">{wisata.spot_foto}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-5">
              <div className="bg-forest-800 text-white rounded-2xl p-6">
                <h3 className="font-display text-lg mb-4 text-ngada-200">Informasi</h3>
                <dl className="space-y-3 text-sm">
                  <div>
                    <dt className="text-white/50">Kabupaten</dt>
                    <dd className="text-white font-medium">{wisata.kabupaten?.nama_kabupaten ?? '—'}</dd>
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
                  <div>
                    <dt className="text-white/50">Foto</dt>
                    <dd className="text-white font-medium">{photos.length} foto</dd>
                  </div>
                </dl>
              </div>

              <Link href="/wisata" className="block text-center btn-outline w-full">
                ← Destinasi Lain
              </Link>
            </div>
          </div>

          {related.length > 0 && (
            <div className="mt-14">
              <h2 className="font-display text-2xl text-forest-900 mb-6">
                Wisata Lain di {wisata.kabupaten?.nama_kabupaten}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {related.map((r, i) => {
                  const rImg = r.fotos[0]?.url ?? (r.galeri?.gambar
                    ? r.galeri.gambar.startsWith('http') ? r.galeri.gambar : `/uploads/${r.galeri.gambar}`
                    : IMAGE_FALLBACKS[i % IMAGE_FALLBACKS.length])
                  return (
                    <Link key={r.id_tempat_wisata} href={`/wisata/${r.id_tempat_wisata}`} className="card-wisata block">
                      <div className="relative h-40 overflow-hidden">
                        <Image src={rImg} alt={r.nama_tempat_wisata} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                      </div>
                      <div className="p-4">
                        <h4 className="font-display text-base text-forest-900 group-hover:text-ngada-600 transition-colors">
                          {r.nama_tempat_wisata}
                        </h4>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}
