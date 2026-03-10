'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MapPin, Navigation, ExternalLink, Search, X,
  ChevronLeft, ChevronRight, Camera, Info, Map,
  Mountain, Waves, Trees, Building2
} from 'lucide-react'
import Link from 'next/link'

export type Spot = {
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
  kategori: string
}

function getDirectionsUrl(lat: number, lng: number) {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
}
function getGoogleMapsUrl(lat: number, lng: number) {
  return `https://www.google.com/maps?q=${lat},${lng}`
}

const KATEGORI_ICON: Record<string, React.ReactNode> = {
  wisata_alam: <Mountain size={13} />,
  wisata_bahari: <Waves size={13} />,
  wisata_budaya: <Building2 size={13} />,
  wisata_buatan: <Trees size={13} />,
}
const KATEGORI_LABEL: Record<string, string> = {
  wisata_alam: 'Alam',
  wisata_bahari: 'Bahari',
  wisata_budaya: 'Budaya',
  wisata_buatan: 'Buatan',
}
const MARKER_COLORS: Record<string, string> = {
  wisata_alam: '#2d6a4f',
  wisata_bahari: '#1e6091',
  wisata_budaya: '#9c6644',
  wisata_buatan: '#606c38',
}

// ── Leaflet Map (client-only) ──────────────────────────────────────────────
function LeafletMap({
  spots,
  selected,
  onSelect,
}: {
  spots: Spot[]
  selected: Spot | null
  onSelect: (spot: Spot) => void
}) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<import('leaflet').Map | null>(null)
  const markersRef = useRef<Record<number, import('leaflet').Marker>>({})

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    import('leaflet').then((L) => {
      delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      })

      const map = L.map(mapRef.current!, {
        center: [-8.659, 121.0536],
        zoom: 10,
        zoomControl: false,
        attributionControl: false,
      })

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18,
      }).addTo(map)

      L.control.zoom({ position: 'bottomright' }).addTo(map)
      L.control.attribution({ position: 'bottomright', prefix: false }).addTo(map)

      spots.forEach((spot) => {
        if (!spot.lat || !spot.lng) return
        const color = MARKER_COLORS[spot.kategori] ?? '#2d6a4f'
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="42" viewBox="0 0 32 42">
          <filter id="sh"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-opacity="0.3"/></filter>
          <path d="M16 0C7.163 0 0 7.163 0 16c0 10.5 16 26 16 26S32 26.5 32 16C32 7.163 24.837 0 16 0z" fill="${color}" filter="url(#sh)"/>
          <circle cx="16" cy="16" r="7" fill="white" opacity="0.95"/>
          <circle cx="16" cy="16" r="4" fill="${color}"/>
        </svg>`

        const icon = L.divIcon({
          html: svg,
          className: '',
          iconSize: [32, 42],
          iconAnchor: [16, 42],
          popupAnchor: [0, -44],
        })

        const marker = L.marker([spot.lat, spot.lng], { icon })
          .addTo(map)
          .on('click', () => onSelect(spot))

        marker.bindTooltip(
          `<div style="font-weight:600;font-size:12px;white-space:nowrap;max-width:160px;overflow:hidden;text-overflow:ellipsis;">${spot.nama}</div>`,
          { direction: 'top', offset: [0, -44], className: 'leaflet-ngada-tooltip' }
        )

        markersRef.current[spot.id] = marker
      })

      mapInstanceRef.current = map
    })

    return () => {
      mapInstanceRef.current?.remove()
      mapInstanceRef.current = null
      markersRef.current = {}
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!selected || !mapInstanceRef.current) return
    if (!selected.lat || !selected.lng) return
    mapInstanceRef.current.flyTo([selected.lat, selected.lng], 14, { animate: true, duration: 1.2 })
    Object.entries(markersRef.current).forEach(([id, marker]) => {
      const el = marker.getElement()
      if (!el) return
      if (Number(id) === selected.id) {
        el.style.filter = 'drop-shadow(0 4px 14px rgba(0,0,0,0.45))'
        el.style.zIndex = '1000'
        el.style.transform = (el.style.transform || '') + ' scale(1.35)'
        el.style.transition = 'transform 0.3s ease'
      } else {
        el.style.filter = ''
        el.style.zIndex = ''
        el.style.transform = (el.style.transform || '').replace(' scale(1.35)', '')
      }
    })
  }, [selected])

  return (
    <>
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <style>{`
        .leaflet-ngada-tooltip { background:#1a2e1a;color:#fff;border:none;border-radius:8px;padding:6px 10px;font-family:inherit;box-shadow:0 4px 16px rgba(0,0,0,.25); }
        .leaflet-ngada-tooltip::before { border-top-color:#1a2e1a !important; }
        .leaflet-control-zoom a { font-size:16px!important;line-height:28px!important;width:28px!important;height:28px!important; }
        .leaflet-bottom.leaflet-right { bottom:12px;right:12px; }
      `}</style>
      <div ref={mapRef} className="w-full h-full" />
    </>
  )
}

// ── Photo Carousel ─────────────────────────────────────────────────────────
function PhotoCarousel({ fotos, fallback }: { fotos: string[]; fallback: string | null }) {
  const [idx, setIdx] = useState(0)
  const images = fotos.length > 0 ? fotos : fallback ? [fallback] : []

  if (images.length === 0) {
    return (
      <div className="w-full h-52 bg-gradient-to-br from-forest-800 to-forest-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-2 text-white/30">
          <Camera size={36} />
          <span className="text-xs">Belum ada foto</span>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full h-52 overflow-hidden bg-forest-900 group">
      <AnimatePresence mode="wait">
        <motion.img
          key={idx}
          src={images[idx]}
          alt="Foto wisata"
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.35 }}
          className="w-full h-full object-cover"
          onError={(e) => {
            ;(e.currentTarget as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=70'
          }}
        />
      </AnimatePresence>
      {images.length > 1 && (
        <>
          <button
            onClick={() => setIdx((i) => (i - 1 + images.length) % images.length)}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => setIdx((i) => (i + 1) % images.length)}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
          >
            <ChevronRight size={16} />
          </button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                className={`rounded-full transition-all ${i === idx ? 'w-4 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/50'}`}
              />
            ))}
          </div>
          <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
            {idx + 1}/{images.length}
          </div>
        </>
      )}
    </div>
  )
}

// ── Main Component ─────────────────────────────────────────────────────────
export default function LokasiMap({ spots }: { spots: Spot[] }) {
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Spot | null>(null)
  const [activeKab, setActiveKab] = useState('Semua')
  const [panelOpen, setPanelOpen] = useState(false)

  const spotsWithGPS = spots.filter((s) => s.lat && s.lng)
  const spotsNoGPS = spots.filter((s) => !s.lat || !s.lng)

  const kabList = [
    'Semua',
    ...Array.from(new Set(spots.map((s) => s.kabupaten).filter(Boolean) as string[])),
  ]

  const filtered = spotsWithGPS.filter((s) => {
    const q = search.toLowerCase()
    const matchSearch =
      s.nama.toLowerCase().includes(q) ||
      (s.kabupaten?.toLowerCase().includes(q) ?? false) ||
      (s.namaLokasi?.toLowerCase().includes(q) ?? false)
    const matchKab = activeKab === 'Semua' || s.kabupaten === activeKab
    return matchSearch && matchKab
  })

  const handleSelect = useCallback((spot: Spot) => {
    setSelected(spot)
    setPanelOpen(true)
  }, [])

  const closePanel = () => {
    setPanelOpen(false)
    setTimeout(() => setSelected(null), 300)
  }

  return (
    <div className="relative flex flex-col lg:flex-row h-[calc(100vh-5rem)] min-h-[600px] overflow-hidden">

      {/* ── SIDEBAR ──────────────────────────── */}
      <div className="w-full lg:w-80 xl:w-96 flex flex-col bg-white border-r border-ngada-100 z-10 shadow-lg flex-shrink-0">

        <div className="p-4 border-b border-ngada-100 space-y-3">
          <div className="relative">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-forest-400 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari destinasi wisata..."
              className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-ngada-200 text-sm text-forest-800 placeholder:text-forest-300 focus:outline-none focus:ring-2 focus:ring-forest-500/30 focus:border-forest-400 transition-all bg-ngada-50"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-forest-300 hover:text-forest-600"
              >
                <X size={14} />
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {kabList.map((kab) => (
              <button
                key={kab}
                onClick={() => setActiveKab(kab)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                  activeKab === kab
                    ? 'bg-forest-700 text-white shadow-sm'
                    : 'bg-ngada-50 border border-ngada-200 text-forest-600 hover:bg-ngada-100'
                }`}
              >
                {kab}
              </button>
            ))}
          </div>
        </div>

        <div className="px-4 py-2.5 border-b border-ngada-50 flex items-center justify-between">
          <span className="text-xs text-forest-400">
            <span className="font-semibold text-forest-700">{filtered.length}</span> lokasi ditemukan
          </span>
          <div className="flex items-center gap-1 text-xs text-forest-300">
            <Map size={11} />
            <span>Kabupaten Ngada</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-forest-300 gap-3">
              <MapPin size={32} className="opacity-30" />
              <p className="text-sm">Tidak ada hasil ditemukan</p>
            </div>
          ) : (
            <div className="p-3 space-y-2">
              {filtered.map((spot, i) => {
                const isActive = selected?.id === spot.id
                const thumb = spot.fotos[0] ?? spot.foto
                return (
                  <motion.button
                    key={spot.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    onClick={() => handleSelect(spot)}
                    className={`w-full text-left rounded-xl overflow-hidden border transition-all duration-200 ${
                      isActive
                        ? 'border-forest-700 shadow-lg shadow-forest-800/15 ring-2 ring-forest-700/20'
                        : 'border-ngada-100 hover:border-forest-300 hover:shadow-sm'
                    }`}
                  >
                    {thumb && (
                      <div className="relative h-24 bg-ngada-100 overflow-hidden">
                        <img
                          src={thumb}
                          alt={spot.nama}
                          className="w-full h-full object-cover"
                          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        {spot.fotos.length > 1 && (
                          <div className="absolute bottom-1.5 right-2 flex items-center gap-1 bg-black/50 text-white text-xs px-1.5 py-0.5 rounded-full">
                            <Camera size={9} />{spot.fotos.length}
                          </div>
                        )}
                      </div>
                    )}
                    <div className={`p-3 ${isActive ? 'bg-forest-800 text-white' : 'bg-white'}`}>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className={`font-semibold text-sm leading-tight truncate ${isActive ? 'text-white' : 'text-forest-900'}`}>
                            {spot.nama}
                          </p>
                          <p className={`text-xs mt-0.5 truncate ${isActive ? 'text-white/60' : 'text-forest-400'}`}>
                            {spot.kabupaten ?? spot.namaLokasi ?? '—'}
                          </p>
                        </div>
                        <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${
                          isActive ? 'bg-white/20 text-white/80' : 'bg-ngada-50 text-forest-500 border border-ngada-100'
                        }`}>
                          {KATEGORI_ICON[spot.kategori]}
                          {KATEGORI_LABEL[spot.kategori] ?? spot.kategori}
                        </span>
                      </div>
                    </div>
                  </motion.button>
                )
              })}

              {spotsNoGPS.length > 0 && activeKab === 'Semua' && !search && (
                <div className="mt-3 pt-3 border-t border-ngada-100">
                  <p className="text-xs text-forest-300 uppercase tracking-wider font-medium mb-2 px-1">
                    Belum ada koordinat GPS
                  </p>
                  {spotsNoGPS.map((spot) => (
                    <div key={spot.id} className="flex items-center gap-2 py-2 px-3 rounded-xl border border-dashed border-ngada-200 mb-1.5 bg-ngada-50/50">
                      <MapPin size={12} className="text-ngada-300 flex-shrink-0" />
                      <span className="text-xs text-forest-400 truncate">{spot.nama}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── MAP ──────────────────────────────── */}
      <div className="flex-1 relative bg-ngada-100">
        <LeafletMap spots={spotsWithGPS} selected={selected} onSelect={handleSelect} />
        <AnimatePresence>
          {!selected && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-forest-900/90 text-white text-xs px-4 py-2.5 rounded-full flex items-center gap-2 pointer-events-none backdrop-blur-sm shadow-lg z-10"
            >
              <MapPin size={12} className="text-ngada-300" />
              Klik marker pada peta untuk melihat detail wisata
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── DETAIL PANEL ─────────────────────── */}
      <AnimatePresence>
        {panelOpen && selected && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closePanel}
              className="fixed inset-0 bg-black/40 z-20 lg:hidden"
            />
            <motion.div
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="fixed lg:absolute right-0 top-0 bottom-0 w-full max-w-sm bg-white z-30 shadow-2xl flex flex-col overflow-hidden"
            >
              {/* Photo header */}
              <div className="relative bg-forest-900 flex-shrink-0">
                <PhotoCarousel fotos={selected.fotos} fallback={selected.foto} />
                <button
                  onClick={closePanel}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors backdrop-blur-sm z-10"
                >
                  <X size={15} />
                </button>
                <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-forest-900/70 text-white text-xs px-2.5 py-1 rounded-full backdrop-blur-sm">
                  {KATEGORI_ICON[selected.kategori]}
                  {KATEGORI_LABEL[selected.kategori] ?? selected.kategori}
                </div>
              </div>

              {/* Scrollable content */}
              <div className="flex-1 overflow-y-auto">
                <div className="p-5 border-b border-ngada-100">
                  <h2 className="font-display text-2xl text-forest-900 leading-tight">{selected.nama}</h2>
                  <div className="flex items-start gap-1.5 mt-2">
                    <MapPin size={13} className="text-ngada-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-forest-500 leading-snug">{selected.alamat}</p>
                  </div>
                  {selected.kabupaten && (
                    <div className="mt-2 inline-flex items-center gap-1.5 bg-forest-50 text-forest-600 text-xs px-3 py-1 rounded-full border border-forest-100">
                      <Map size={10} />{selected.kabupaten}
                    </div>
                  )}
                </div>

                {selected.deskripsi && (
                  <div className="p-5 border-b border-ngada-100">
                    <div className="flex items-center gap-2 mb-2.5">
                      <Info size={13} className="text-forest-400" />
                      <span className="text-xs font-semibold text-forest-400 uppercase tracking-wider">Informasi</span>
                    </div>
                    <p className="text-sm text-forest-600 leading-relaxed line-clamp-6">{selected.deskripsi}</p>
                    <Link
                      href={`/wisata/${selected.id}`}
                      className="mt-3 inline-flex items-center gap-1 text-xs text-ngada-600 hover:text-ngada-800 font-medium transition-colors"
                    >
                      Lihat selengkapnya <ChevronRight size={12} />
                    </Link>
                  </div>
                )}

                {selected.lat && selected.lng && (
                  <div className="px-5 py-3">
                    <p className="font-mono text-xs text-forest-300">
                      {selected.lat.toFixed(6)}, {selected.lng.toFixed(6)}
                    </p>
                  </div>
                )}
              </div>

              {/* CTA buttons */}
              {selected.lat && selected.lng && (
                <div className="p-4 border-t border-ngada-100 grid grid-cols-2 gap-3 flex-shrink-0 bg-white">
                  <a
                    href={getDirectionsUrl(selected.lat, selected.lng)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-forest-700 hover:bg-forest-800 text-white text-sm font-medium py-3 rounded-xl transition-colors"
                  >
                    <Navigation size={15} />
                    Petunjuk Arah
                  </a>
                  <a
                    href={getGoogleMapsUrl(selected.lat, selected.lng)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-ngada-50 hover:bg-ngada-100 text-forest-700 border border-ngada-200 text-sm font-medium py-3 rounded-xl transition-colors"
                  >
                    <ExternalLink size={15} />
                    Google Maps
                  </a>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
