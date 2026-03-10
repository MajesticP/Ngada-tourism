export const dynamic = 'force-dynamic'

import { db } from '@/lib/db'
import Navbar from '@/components/public/Navbar'
import Footer from '@/components/public/Footer'
import LokasiMap from '@/components/public/LokasiMap'

async function getAllWisata() {
  return db.tempatWisata.findMany({
    include: {
      kabupaten: true,
      lokasi: true,
      galeri: true,
      fotos: { orderBy: { urutan: 'asc' } },
    },
    orderBy: { nama_tempat_wisata: 'asc' },
  })
}

export default async function LokasiPage() {
  const allWisata = await getAllWisata()

  const spots = allWisata.map(w => ({
    id: w.id_tempat_wisata,
    nama: w.nama_tempat_wisata,
    alamat: w.alamat,
    deskripsi: w.informasi1 ?? '',
    kabupaten: w.kabupaten?.nama_kabupaten ?? null,
    lat: w.lokasi?.lat ? Number(w.lokasi.lat) : null,
    lng: w.lokasi?.lng ? Number(w.lokasi.lng) : null,
    namaLokasi: w.lokasi?.nama_lokasi ?? null,
    foto: w.galeri?.gambar ?? null,
    fotos: w.fotos?.map(f => f.url) ?? [],
  }))

  return (
    <main className="min-h-screen bg-ngada-50">
      <Navbar />

      {/* Header */}
      <section className="relative pt-32 pb-16 px-6 bg-forest-800 text-white overflow-hidden">
        <div
          className="absolute inset-0 opacity-20 bg-cover bg-center"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=80)' }}
        />
        <div className="relative max-w-4xl mx-auto text-center">
          <p className="text-ngada-300 uppercase tracking-widest text-sm mb-3">Temukan Lokasinya</p>
          <h1 className="font-display text-4xl md:text-6xl mb-4">Peta Wisata Ngada</h1>
          <p className="text-white/70 text-lg max-w-xl mx-auto">
            {spots.filter(s => s.lat && s.lng).length} destinasi — klik pin di peta untuk foto, alamat &amp; deskripsi
          </p>
        </div>
      </section>

      <LokasiMap spots={spots} />

      <Footer />
    </main>
  )
}
