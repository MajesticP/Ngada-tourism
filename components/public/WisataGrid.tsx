'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { MapPin, ArrowRight } from 'lucide-react'

type Wisata = {
  id_tempat_wisata: number
  nama_tempat_wisata: string
  alamat: string
  informasi1: string
  kategori?: string
  kabupaten: { nama_kabupaten: string } | null
  lokasi: { nama_lokasi: string; lat: number | null; lng: number | null } | null
  galeri: { gambar: string | null; nama_galeri: string } | null
}

const IMAGE_FALLBACKS = [
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
  'https://images.unsplash.com/photo-1559494007-9f5847c49d94?w=800&q=80',
  'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800&q=80',
  'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=800&q=80',
]

const KATEGORI_MAP: Record<string, { label: string; color: string }> = {
  wisata_alam:    { label: 'Wisata Alam',   color: 'bg-forest-600' },
  wisata_budaya:  { label: 'Wisata Budaya', color: 'bg-ngada-500' },
  kampung_adat:   { label: 'Kampung Adat',  color: 'bg-terra-500' },
  wisata_bahari:  { label: 'Wisata Bahari', color: 'bg-blue-500' },
  pulau_eksotis:  { label: 'Pulau Eksotis', color: 'bg-cyan-600' },
  penginapan:     { label: 'Penginapan',    color: 'bg-purple-600' },
  kuliner:        { label: 'Kuliner',        color: 'bg-orange-500' },
  religi:         { label: 'Wisata Religi', color: 'bg-yellow-600' },
}

export default function WisataGrid({ wisata }: { wisata: Wisata[] }) {
  if (wisata.length === 0) {
    return (
      <div className="text-center py-20 text-forest-400">
        <p className="font-display text-2xl mb-2">Tidak ada hasil</p>
        <p className="text-sm">Coba kata kunci atau filter yang berbeda</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
      {wisata.map((w, i) => {
        const imgSrc = w.galeri?.gambar
          ? w.galeri.gambar.startsWith("http") ? w.galeri.gambar : `/uploads/${w.galeri.gambar}`
          : IMAGE_FALLBACKS[i % IMAGE_FALLBACKS.length]
        const kat = KATEGORI_MAP[w.kategori ?? 'wisata_alam'] ?? KATEGORI_MAP.wisata_alam

        return (
          <motion.div
            key={w.id_tempat_wisata}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07, duration: 0.5 }}
          >
            <Link href={`/wisata/${w.id_tempat_wisata}`} className="card-wisata block group">
              <div className="relative h-56 overflow-hidden">
                <Image
                  src={imgSrc}
                  alt={w.nama_tempat_wisata}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = IMAGE_FALLBACKS[0]
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent" />
                <div className="absolute top-4 left-4 flex gap-2 flex-wrap">
                  <span className={`badge text-white ${kat.color}`}>
                    {kat.label}
                  </span>
                  {w.kabupaten && (
                    <span className="badge text-white bg-black/40 backdrop-blur-sm">
                      <MapPin size={10} />
                      {w.kabupaten.nama_kabupaten}
                    </span>
                  )}
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-display text-xl text-forest-900 mb-2 group-hover:text-ngada-600 transition-colors">
                  {w.nama_tempat_wisata}
                </h3>
                <p className="text-forest-600 text-sm leading-relaxed line-clamp-2">
                  {w.informasi1}
                </p>
                <div className="mt-4 flex items-center gap-1 text-ngada-500 text-sm font-medium">
                  Lihat Detail <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          </motion.div>
        )
      })}
    </div>
  )
}
