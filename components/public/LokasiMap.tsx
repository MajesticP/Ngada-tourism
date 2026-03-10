'use client'

import { useState, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MapPin, Navigation, ExternalLink, Search,
  ChevronRight, X, ImageOff, Info, MapIcon
} from 'lucide-react'
import Link from 'next/link'
import type { MapSpot } from './LeafletMap'

// Load Leaflet map only on client (no SSR)
const LeafletMap = dynamic(() => import('./LeafletMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-ngada-50">
      <div className="flex flex-col items-center gap-3 text-forest-400">
        <div className="w-10 h-10 border-3 border-forest-200 border-t-forest-600 rounded-full animate-spin" />
        <p className="text-sm">Memuat peta…</p>
      </div>
    </div>
  ),
})

export type Spot = Omit<MapSpot, 'lat' | 'lng'> & {
  namaLokasi: string | null
  lat: number | null
  lng: number | null
}

function getDirectionsUrl(lat: number, lng: number) {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
}
function getGoogleMapsUrl(lat: number, lng: number) {
  return `https://www.google.com/maps?q=${lat},${lng}`
}

const PILL_COLORS = [
  'bg-forest-100 text-forest-700',
  'bg-ngada-100 text-ngada-700',
  'bg-terra-100 text-terra-700',
  'bg-teal-100 text-teal-700',
  'bg-purple-100 text-purple-700',
  'bg-blue-100 text-blue-700',
]

export default function LokasiMap({ spots }: { spots: Spot[] }) {
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Spot | null>(null)
  const [activeKec, setActiveKec] = useState('Semua')

  const spotsWithGPS = spots.filter(s => s.lat && s.lng) as (Spot & { lat: number; lng: number })[]
  const kabupatenList = [
    'Semua',
    ...Array.from(new Set(spots.map(s => s.kabupaten).filter(Boolean) as string[])),
  ]

  const filtered = spotsWithGPS.filter(s => {
    const q = search.toLowerCase()
    const matchSearch =
      s.nama.toLowerCase().includes(q) ||
      (s.kabupaten?.toLowerCase().includes(q) ?? false)
    const matchKec = activeKec === 'Semua' || s.kabupaten === activeKec
    return matchSearch && matchKec
  })

  const handleSelect = useCallback((spot: Spot) => {
    setSelected(prev => (prev?.id === spot.id ? null : spot))
  }, [])

  const kabColorMap = new Map(
    kabupatenList.slice(1).map((k, i) => [k, PILL_COLORS[i % PILL_COLORS.length]])
  )

  return (
    <section className="py-8 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

          {/* ── LEFT: Spot List ──────────────────────────────── */}
          <div className="lg:col-span-2 flex flex-col gap-4">

            {/* Search */}
            <div className="relative">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-forest-400 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Cari wisata atau kabupaten…"
                className="input-field pl-10"
              />
            </div>

            {/* Kabupaten filter chips */}
            <div className="flex flex-wrap gap-2">
              {kabupatenList.map(kec => (
                <button
                  key={kec}
                  onClick={() => setActiveKec(kec)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    activeKec === kec
                      ? 'bg-forest-700 text-white shadow-sm'
                      : 'bg-white border border-forest-200 text-forest-600 hover:bg-forest-50'
                  }`}
                >
                  {kec}
                </button>
              ))}
            </div>

            {/* Count */}
            <p className="text-xs font-medium text-forest-400 uppercase tracking-wider px-1">
              {filtered.length} lokasi ditemukan
            </p>

            {/* Scrollable spot list */}
            <div className="space-y-2 max-h-[540px] overflow-y-auto pr-1 -mr-1">
              {filtered.length === 0 && (
                <div className="text-center py-12 text-forest-400 text-sm">
                  Tidak ada hasil untuk pencarian ini
                </div>
              )}

              {filtered.map((spot, i) => {
                const isActive = selected?.id === spot.id
                return (
                  <motion.button
                    key={spot.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: Math.min(i * 0.03, 0.3) }}
                    onClick={() => handleSelect(spot)}
                    className={`w-full text-left rounded-xl border transition-all duration-200 overflow-hidden ${
                      isActive
                        ? 'bg-forest-800 border-forest-800 shadow-lg shadow-forest-800/20'
                        : 'bg-white border-ngada-100 hover:border-forest-300 hover:shadow-sm'
                    }`}
                  >
                    {/* Foto thumbnail strip when active */}
                    <AnimatePresence>
                      {isActive && spot.foto && (
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: 100 }}
                          exit={{ height: 0 }}
                          className="overflow-hidden"
                        >
                          <img
                            src={spot.foto}
                            alt={spot.nama}
                            className="w-full h-[100px] object-cover"
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="p-4">
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                          isActive ? 'bg-ngada-500' : 'bg-forest-100'
                        }`}>
                          <MapPin size={14} className={isActive ? 'text-white' : 'text-forest-600'} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`font-medium text-sm leading-tight ${isActive ? 'text-white' : 'text-forest-900'}`}>
                            {spot.nama}
                          </p>
                          {spot.kabupaten && (
                            <span className={`inline-block mt-1.5 text-[10px] font-medium px-2 py-0.5 rounded-full ${
                              isActive ? 'bg-white/20 text-white/80' : kabColorMap.get(spot.kabupaten) ?? PILL_COLORS[0]
                            }`}>
                              {spot.kabupaten}
                            </span>
                          )}
                          {spot.lat && spot.lng && (
                            <p className={`font-mono text-[10px] mt-1 ${isActive ? 'text-ngada-200' : 'text-forest-300'}`}>
                              {spot.lat.toFixed(4)}, {spot.lng.toFixed(4)}
                            </p>
                          )}
                        </div>
                        <ChevronRight
                          size={14}
                          className={`flex-shrink-0 mt-1 transition-transform ${isActive ? 'text-white rotate-90' : 'text-forest-300'}`}
                        />
                      </div>

                      {/* Action row when active */}
                      <AnimatePresence>
                        {isActive && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-3 pt-3 border-t border-white/20 flex gap-2"
                          >
                            <a
                              href={getDirectionsUrl(spot.lat, spot.lng)}
                              target="_blank" rel="noopener noreferrer"
                              onClick={e => e.stopPropagation()}
                              className="flex-1 flex items-center justify-center gap-1.5 bg-ngada-500 hover:bg-ngada-400 text-white text-xs font-medium py-2 rounded-lg transition-colors"
                            >
                              <Navigation size={12} />
                              Arah
                            </a>
                            <Link
                              href={`/wisata/${spot.id}`}
                              onClick={e => e.stopPropagation()}
                              className="flex-1 flex items-center justify-center gap-1.5 bg-white/20 hover:bg-white/30 text-white text-xs font-medium py-2 rounded-lg transition-colors"
                            >
                              <Info size={12} />
                              Detail
                            </Link>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.button>
                )
              })}
            </div>
          </div>

          {/* ── RIGHT: Map + Popup ───────────────────────────── */}
          <div className="lg:col-span-3">
            <div className="sticky top-24">

              {/* Map container */}
              <div className="relative rounded-2xl overflow-hidden shadow-md border border-ngada-100" style={{ height: 580 }}>

                {/* Map header bar */}
                <div className="absolute top-0 left-0 right-0 z-[1000] bg-white/90 backdrop-blur-sm border-b border-ngada-100 px-4 py-2.5 flex items-center gap-2">
                  <MapIcon size={14} className="text-forest-500" />
                  <span className="text-sm text-forest-700 font-medium">
                    {selected ? selected.nama : 'Peta Kabupaten Ngada'}
                  </span>
                  {selected && (
                    <button
                      onClick={() => setSelected(null)}
                      className="ml-auto flex items-center gap-1 text-xs text-forest-400 hover:text-forest-700 transition-colors"
                    >
                      <X size={13} />
                      Tutup
                    </button>
                  )}
                </div>

                {/* Leaflet map */}
                <div className="absolute inset-0 pt-[41px]">
                  <LeafletMap
                    spots={spotsWithGPS}
                    selected={selected}
                    onSelect={handleSelect}
                  />
                </div>

                {/* ── Popup card floating at bottom ── */}
                <AnimatePresence>
                  {selected && (
                    <motion.div
                      key={selected.id}
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 30 }}
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      className="absolute bottom-4 left-4 right-4 z-[1000] bg-white rounded-2xl shadow-2xl overflow-hidden border border-ngada-100"
                      style={{ maxHeight: 260 }}
                    >
                      <div className="flex gap-0">

                        {/* Photo */}
                        <div className="w-36 flex-shrink-0 relative bg-forest-100">
                          {selected.foto ? (
                            <img
                              src={selected.foto}
                              alt={selected.nama}
                              className="w-full h-full object-cover"
                              style={{ maxHeight: 260 }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-forest-100 to-forest-200" style={{ minHeight: 160 }}>
                              <ImageOff size={28} className="text-forest-300" />
                            </div>
                          )}
                          {/* Kabupaten badge */}
                          {selected.kabupaten && (
                            <span className="absolute top-2 left-2 bg-forest-800/85 backdrop-blur-sm text-white text-[10px] font-medium px-2 py-0.5 rounded-full">
                              {selected.kabupaten}
                            </span>
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 p-4 flex flex-col justify-between min-w-0">
                          <div>
                            <h3 className="font-display text-forest-900 text-base leading-tight line-clamp-2 mb-1">
                              {selected.nama}
                            </h3>
                            {selected.alamat && (
                              <p className="text-xs text-forest-500 flex items-start gap-1 mt-1.5">
                                <MapPin size={11} className="flex-shrink-0 mt-0.5 text-ngada-400" />
                                <span className="line-clamp-2">{selected.alamat}</span>
                              </p>
                            )}
                            {selected.deskripsi && (
                              <p className="text-xs text-forest-600 mt-2 line-clamp-3 leading-relaxed">
                                {selected.deskripsi}
                              </p>
                            )}
                          </div>

                          <div className="flex gap-2 mt-3">
                            <a
                              href={getDirectionsUrl(selected.lat, selected.lng)}
                              target="_blank" rel="noopener noreferrer"
                              className="flex items-center gap-1.5 bg-forest-700 hover:bg-forest-600 text-white text-xs font-medium px-3 py-2 rounded-lg transition-colors whitespace-nowrap"
                            >
                              <Navigation size={11} />
                              Petunjuk Arah
                            </a>
                            <Link
                              href={`/wisata/${selected.id}`}
                              className="flex items-center gap-1.5 bg-ngada-50 hover:bg-ngada-100 text-forest-700 text-xs font-medium px-3 py-2 rounded-lg transition-colors whitespace-nowrap border border-ngada-200"
                            >
                              <Info size={11} />
                              Lihat Detail
                            </Link>
                            <a
                              href={getGoogleMapsUrl(selected.lat, selected.lng)}
                              target="_blank" rel="noopener noreferrer"
                              className="ml-auto flex items-center gap-1 text-xs text-forest-400 hover:text-forest-600 px-2 py-2 transition-colors"
                              title="Buka di Google Maps"
                            >
                              <ExternalLink size={12} />
                            </a>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Hint when no selection */}
                {!selected && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[999] bg-forest-800/80 backdrop-blur-sm text-white text-xs px-4 py-2 rounded-full pointer-events-none whitespace-nowrap">
                    Klik marker untuk melihat info lokasi
                  </div>
                )}
              </div>

              {/* Quick-access grid when nothing selected */}
              <AnimatePresence>
                {!selected && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="mt-4 bg-white rounded-2xl p-5 border border-ngada-100 shadow-sm"
                  >
                    <p className="font-display text-lg text-forest-900 mb-3">Semua Lokasi</p>
                    <div className="grid grid-cols-2 gap-2">
                      {spotsWithGPS.slice(0, 8).map((spot, i) => (
                        <button
                          key={spot.id}
                          onClick={() => handleSelect(spot)}
                          className="flex items-center gap-2 p-2.5 rounded-xl bg-ngada-50 hover:bg-ngada-100 transition-colors text-left group"
                        >
                          <div className="w-6 h-6 rounded-full bg-forest-600 flex items-center justify-center flex-shrink-0">
                            <MapPin size={10} className="text-white" />
                          </div>
                          <span className="text-xs text-forest-700 font-medium line-clamp-1 group-hover:text-forest-900">
                            {spot.nama}
                          </span>
                        </button>
                      ))}
                    </div>
                    {spotsWithGPS.length > 8 && (
                      <p className="text-xs text-forest-400 text-center mt-3">
                        +{spotsWithGPS.length - 8} lokasi lainnya — pilih dari daftar kiri
                      </p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
