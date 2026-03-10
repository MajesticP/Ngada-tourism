'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Navigation, ExternalLink, Search, Map, ChevronRight } from 'lucide-react'
import Link from 'next/link'

type Spot = {
  id: number
  nama: string
  alamat: string
  deskripsi: string
  kabupaten: string | null
  lat: number | null
  lng: number | null
  namaLokasi: string | null
  foto: string | null
  fotos: string[]
}

function getGoogleMapsUrl(lat: number, lng: number) {
  return `https://www.google.com/maps?q=${lat},${lng}`
}

function getDirectionsUrl(lat: number, lng: number) {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
}

const CATEGORY_COLORS = [
  'bg-forest-500', 'bg-ngada-500', 'bg-terra-500',
  'bg-purple-500', 'bg-blue-500', 'bg-teal-500',
]

export default function LokasiMap({ spots }: { spots: Spot[] }) {
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Spot | null>(null)
  const [activeKec, setActiveKec] = useState<string>('Semua')

  const spotsWithGPS = spots.filter(s => s.lat && s.lng)
  const spotsNoGPS = spots.filter(s => !s.lat || !s.lng)

  // Unique kabupaten list
  const kabupatenList = ['Semua', ...Array.from(new Set(spots.map(s => s.kabupaten).filter(Boolean) as string[]))]

  const filtered = spotsWithGPS.filter(s => {
    const matchSearch = s.nama.toLowerCase().includes(search.toLowerCase()) ||
      (s.kabupaten?.toLowerCase().includes(search.toLowerCase()) ?? false)
    const matchKec = activeKec === 'Semua' || s.kabupaten === activeKec
    return matchSearch && matchKec
  })

  // Build embed URL using first available spot or center of Ngada
  const centerLat = selected?.lat ?? -8.559
  const centerLng = selected?.lng ?? 121.089
  const zoom = selected ? 14 : 10

  const embedUrl = `https://www.google.com/maps/embed/v1/place?key=AIzaSyD-placeholder&q=${centerLat},${centerLng}&zoom=${zoom}`

  // Fallback: use OpenStreetMap iframe (no API key needed)
  const osmUrl = selected
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${centerLng - 0.05},${centerLat - 0.05},${centerLng + 0.05},${centerLat + 0.05}&layer=mapnik&marker=${centerLat},${centerLng}`
    : `https://www.openstreetmap.org/export/embed.html?bbox=120.7,−8.9,121.4,−8.2&layer=mapnik`

  return (
    <section className="py-8 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* ── LEFT PANEL: spot list ───────────────────────────────── */}
          <div className="lg:col-span-2 space-y-4">

            {/* Search */}
            <div className="relative">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-forest-400" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Cari wisata atau kabupaten..."
                className="input-field pl-10"
              />
            </div>

            {/* Kabupaten filter */}
            <div className="flex flex-wrap gap-2">
              {kabupatenList.map(kec => (
                <button
                  key={kec}
                  onClick={() => setActiveKec(kec)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    activeKec === kec
                      ? 'bg-forest-700 text-white'
                      : 'bg-white border border-forest-200 text-forest-600 hover:bg-forest-50'
                  }`}
                >
                  {kec}
                </button>
              ))}
            </div>

            {/* Spots with GPS */}
            <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
              <p className="text-xs font-medium text-forest-400 uppercase tracking-wider px-1">
                {filtered.length} lokasi ditemukan
              </p>

              {filtered.length === 0 && (
                <div className="text-center py-10 text-forest-400 text-sm">
                  Tidak ada hasil untuk pencarian ini
                </div>
              )}

              {filtered.map((spot, i) => (
                <motion.button
                  key={spot.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  onClick={() => setSelected(selected?.id === spot.id ? null : spot)}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-200 ${
                    selected?.id === spot.id
                      ? 'bg-forest-800 text-white border-forest-800 shadow-lg shadow-forest-800/20'
                      : 'bg-white border-ngada-100 hover:border-forest-300 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      selected?.id === spot.id ? 'bg-ngada-500' : 'bg-forest-100'
                    }`}>
                      <MapPin size={14} className={selected?.id === spot.id ? 'text-white' : 'text-forest-600'} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium text-sm leading-tight ${selected?.id === spot.id ? 'text-white' : 'text-forest-900'}`}>
                        {spot.nama}
                      </p>
                      <p className={`text-xs mt-1 ${selected?.id === spot.id ? 'text-white/70' : 'text-forest-400'}`}>
                        {spot.kabupaten ?? '—'}
                      </p>
                      {spot.lat && spot.lng && (
                        <p className={`font-mono text-xs mt-0.5 ${selected?.id === spot.id ? 'text-ngada-200' : 'text-forest-300'}`}>
                          {spot.lat.toFixed(4)}, {spot.lng.toFixed(4)}
                        </p>
                      )}
                    </div>
                    <ChevronRight size={14} className={`flex-shrink-0 mt-1 transition-transform ${selected?.id === spot.id ? 'text-white rotate-90' : 'text-forest-300'}`} />
                  </div>

                  {/* Action buttons when selected */}
                  <AnimatePresence>
                    {selected?.id === spot.id && spot.lat && spot.lng && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-3 pt-3 border-t border-white/20 flex gap-2"
                      >
                        <a
                          href={getDirectionsUrl(spot.lat, spot.lng)}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={e => e.stopPropagation()}
                          className="flex-1 flex items-center justify-center gap-1.5 bg-ngada-500 hover:bg-ngada-400 text-white text-xs font-medium py-2 rounded-lg transition-colors"
                        >
                          <Navigation size={12} />
                          Petunjuk Arah
                        </a>
                        <a
                          href={getGoogleMapsUrl(spot.lat, spot.lng)}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={e => e.stopPropagation()}
                          className="flex-1 flex items-center justify-center gap-1.5 bg-white/20 hover:bg-white/30 text-white text-xs font-medium py-2 rounded-lg transition-colors"
                        >
                          <ExternalLink size={12} />
                          Buka Maps
                        </a>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              ))}

              {/* Spots without GPS */}
              {spotsNoGPS.length > 0 && activeKec === 'Semua' && !search && (
                <div className="mt-4">
                  <p className="text-xs font-medium text-forest-300 uppercase tracking-wider px-1 mb-2">
                    Belum ada koordinat GPS
                  </p>
                  {spotsNoGPS.map(spot => (
                    <div key={spot.id} className="p-3 rounded-xl border border-dashed border-ngada-200 bg-ngada-50/50 mb-2">
                      <div className="flex items-center gap-2">
                        <MapPin size={12} className="text-ngada-300" />
                        <p className="text-sm text-forest-500">{spot.nama}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── RIGHT PANEL: map ────────────────────────────────────── */}
          <div className="lg:col-span-3">
            <div className="sticky top-24 space-y-4">

              {/* Selected spot info card */}
              <AnimatePresence mode="wait">
                {selected && (
                  <motion.div
                    key={selected.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-forest-800 text-white rounded-2xl overflow-hidden"
                  >
                    {/* Photo */}
                    {(selected.fotos.length > 0 || selected.foto) && (
                      <div className="relative h-44 bg-forest-900 overflow-hidden">
                        <img
                          src={selected.fotos[0] ?? selected.foto ?? ''}
                          alt={selected.nama}
                          className="w-full h-full object-cover opacity-90"
                          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-forest-900/80 to-transparent" />
                        {selected.fotos.length > 1 && (
                          <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                            {selected.fotos.length} foto
                          </div>
                        )}
                      </div>
                    )}

                    <div className="p-5 flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="font-display text-xl">{selected.nama}</p>
                        <p className="text-white/60 text-sm mt-1">{selected.alamat}</p>
                        {selected.deskripsi && (
                          <p className="text-white/50 text-xs mt-2 line-clamp-2 leading-relaxed">
                            {selected.deskripsi}
                          </p>
                        )}
                        {selected.lat && selected.lng && (
                          <p className="font-mono text-xs text-ngada-300 mt-2">
                            {selected.lat.toFixed(6)}, {selected.lng.toFixed(6)}
                          </p>
                        )}
                      </div>
                      {selected.lat && selected.lng && (
                        <div className="flex flex-col gap-2 flex-shrink-0">
                          <a
                            href={getDirectionsUrl(selected.lat, selected.lng)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 bg-ngada-500 hover:bg-ngada-400 text-white text-xs font-medium px-3 py-2 rounded-lg transition-colors whitespace-nowrap"
                          >
                            <Navigation size={13} />
                            Petunjuk Arah
                          </a>
                          <a
                            href={getGoogleMapsUrl(selected.lat, selected.lng)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-medium px-3 py-2 rounded-lg transition-colors whitespace-nowrap"
                          >
                            <ExternalLink size={13} />
                            Buka Google Maps
                          </a>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Map iframe (OpenStreetMap — no API key needed) */}
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-ngada-100">
                <div className="bg-forest-50 border-b border-ngada-100 px-4 py-2.5 flex items-center gap-2">
                  <Map size={14} className="text-forest-500" />
                  <span className="text-sm text-forest-600 font-medium">
                    {selected ? `Menampilkan: ${selected.nama}` : 'Peta Kabupaten Ngada'}
                  </span>
                  {selected && (
                    <button
                      onClick={() => setSelected(null)}
                      className="ml-auto text-xs text-forest-400 hover:text-forest-600"
                    >
                      Reset peta
                    </button>
                  )}
                </div>
                <iframe
                  key={selected?.id ?? 'default'}
                  src={osmUrl}
                  width="100%"
                  height="460"
                  className="block"
                  title="Peta Wisata Ngada"
                  loading="lazy"
                />
                <div className="px-4 py-2.5 bg-ngada-50 border-t border-ngada-100 flex items-center justify-between">
                  <p className="text-xs text-forest-400">
                    © OpenStreetMap contributors
                  </p>
                  {selected?.lat && selected?.lng && (
                    <a
                      href={getGoogleMapsUrl(selected.lat, selected.lng)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-ngada-500 hover:text-ngada-700 flex items-center gap-1 font-medium"
                    >
                      Buka di Google Maps <ExternalLink size={10} />
                    </a>
                  )}
                </div>
              </div>

              {/* All spots Google Maps links grid */}
              {!selected && (
                <div className="bg-white rounded-2xl p-5 border border-ngada-100 shadow-sm">
                  <p className="font-display text-lg text-forest-900 mb-4">Buka Semua Lokasi</p>
                  <div className="grid grid-cols-2 gap-2">
                    {spotsWithGPS.slice(0, 6).map((spot, i) => (
                      <a
                        key={spot.id}
                        href={getDirectionsUrl(spot.lat!, spot.lng!)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 p-2.5 rounded-xl bg-ngada-50 hover:bg-ngada-100 transition-colors group"
                      >
                        <div className={`w-6 h-6 rounded-full ${CATEGORY_COLORS[i % CATEGORY_COLORS.length]} flex items-center justify-center flex-shrink-0`}>
                          <Navigation size={10} className="text-white" />
                        </div>
                        <span className="text-xs text-forest-700 font-medium line-clamp-1 group-hover:text-forest-900">
                          {spot.nama}
                        </span>
                      </a>
                    ))}
                  </div>
                  {spotsWithGPS.length > 6 && (
                    <p className="text-xs text-forest-400 text-center mt-3">
                      +{spotsWithGPS.length - 6} lokasi lainnya — pilih dari daftar di kiri
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
