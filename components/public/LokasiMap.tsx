'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Navigation, ExternalLink, Search, Map as MapIcon, ChevronRight, X } from 'lucide-react'

type Spot = {
  id: number
  nama: string
  alamat: string
  kabupaten: string | null
  lat: number | null
  lng: number | null
  namaLokasi: string | null
  foto: string | null
  deskripsi: string | null
}

declare global {
  interface Window { L: any }
}

function getDirectionsUrl(lat: number, lng: number) {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
}
function getGoogleMapsUrl(lat: number, lng: number) {
  return `https://www.google.com/maps?q=${lat},${lng}`
}

const NTT_CENTER: [number, number] = [-9.2, 122.0]
const NTT_ZOOM = 7

export default function LokasiMap({ spots }: { spots: Spot[] }) {
  const mapElRef   = useRef<HTMLDivElement>(null)
  const leafletRef = useRef<any>(null)
  const markersRef = useRef<Map<number, any>>(new Map())

  const [search, setSearch]       = useState('')
  const [activeKab, setActiveKab] = useState('Semua')
  const [selected, setSelected]   = useState<Spot | null>(null)
  const [mapReady, setMapReady]   = useState(false)

  const spotsWithGPS = spots.filter(s => s.lat && s.lng)
  const spotsNoGPS   = spots.filter(s => !s.lat || !s.lng)
  const kabList      = ['Semua', ...Array.from(new Set(spots.map(s => s.kabupaten).filter(Boolean) as string[]))]

  const filtered = spotsWithGPS.filter(s => {
    const q = search.toLowerCase()
    const matchSearch = s.nama.toLowerCase().includes(q) || (s.kabupaten?.toLowerCase().includes(q) ?? false)
    const matchKab    = activeKab === 'Semua' || s.kabupaten === activeKab
    return matchSearch && matchKab
  })

  // 1. Load Leaflet CSS + JS from CDN
  useEffect(() => {
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link')
      link.id = 'leaflet-css'
      link.rel = 'stylesheet'
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
      document.head.appendChild(link)
    }
    if (window.L) { setMapReady(true); return }
    const script = document.createElement('script')
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
    script.onload = () => setMapReady(true)
    document.head.appendChild(script)
  }, [])

  // 2. Initialise map once Leaflet JS is loaded
  useEffect(() => {
    if (!mapReady || !mapElRef.current || leafletRef.current) return
    const L = window.L
    delete (L.Icon.Default.prototype as any)._getIconUrl
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    })
    const map = L.map(mapElRef.current, { zoomControl: true }).setView(NTT_CENTER, NTT_ZOOM)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map)
    leafletRef.current = map
  }, [mapReady])

  // 3. Re-render markers whenever filter / search changes
  const refreshMarkers = useCallback(() => {
    const map = leafletRef.current
    if (!map || !window.L) return
    const L = window.L
    markersRef.current.forEach(m => map.removeLayer(m))
    markersRef.current.clear()

    filtered.forEach(spot => {
      if (!spot.lat || !spot.lng) return
      const icon = L.divIcon({
        className: '',
        html: `<div style="position:relative;width:34px;height:34px;background:#2d6a4f;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:3px solid #fff;box-shadow:0 2px 10px rgba(0,0,0,.35)"><div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;transform:rotate(45deg)"><svg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='#fff' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'><path d='M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z'/><circle cx='12' cy='10' r='3'/></svg></div></div>`,
        iconSize: [34, 34], iconAnchor: [17, 34], popupAnchor: [0, -38],
      })

      const fotoHtml = spot.foto
        ? `<img src="${spot.foto}" alt="${spot.nama}" style="width:100%;height:130px;object-fit:cover;border-radius:10px 10px 0 0;display:block;" />`
        : `<div style="width:100%;height:56px;background:linear-gradient(135deg,#2d6a4f,#40916c);border-radius:10px 10px 0 0;display:flex;align-items:center;justify-content:center;"><svg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,.6)' stroke-width='1.5'><path d='M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z'/><circle cx='12' cy='10' r='3'/></svg></div>`

      const rawDesc = spot.deskripsi ? spot.deskripsi.replace(/<[^>]*>/g, '') : ''
      const desc = rawDesc.length > 110 ? rawDesc.substring(0, 110) + '…' : rawDesc

      const popupHtml = `<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;width:240px;border-radius:10px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,.15)">${fotoHtml}<div style="padding:12px 14px 14px"><p style="margin:0 0 2px;font-size:13px;font-weight:700;color:#1b4332;line-height:1.3">${spot.nama}</p>${spot.kabupaten ? `<p style="margin:0 0 6px;font-size:11px;color:#52b788;font-weight:600">${spot.kabupaten}</p>` : ''}<p style="margin:0 0 6px;font-size:11px;color:#4b5563;line-height:1.5">📍 ${spot.alamat}</p>${desc ? `<p style="margin:0 0 10px;font-size:11px;color:#6b7280;line-height:1.5">${desc}</p>` : ''}<div style="display:flex;gap:6px"><a href="/wisata/${spot.id}" style="flex:1;text-align:center;background:#2d6a4f;color:#fff;padding:7px 8px;border-radius:6px;text-decoration:none;font-size:11px;font-weight:600">Lihat Detail</a><a href="${getDirectionsUrl(spot.lat, spot.lng)}" target="_blank" rel="noopener noreferrer" style="flex:1;text-align:center;background:#e9f5f0;color:#2d6a4f;padding:7px 8px;border-radius:6px;text-decoration:none;font-size:11px;font-weight:600">Petunjuk Arah</a></div></div></div>`

      const marker = L.marker([spot.lat, spot.lng], { icon })
        .bindPopup(popupHtml, { maxWidth: 260, minWidth: 240, className: 'ngada-popup' })
        .addTo(map)

      markersRef.current.set(spot.id, marker)
    })
  }, [filtered])

  useEffect(() => { if (mapReady) refreshMarkers() }, [mapReady, refreshMarkers])

  // 4. Fly to selected spot and open its popup
  useEffect(() => {
    const map = leafletRef.current
    if (!map || !selected?.lat || !selected?.lng) return
    map.flyTo([selected.lat, selected.lng], 14, { animate: true, duration: 1.2 })
    const marker = markersRef.current.get(selected.id)
    if (marker) setTimeout(() => marker.openPopup(), 1300)
  }, [selected])

  return (
    <section className="py-8 px-6">
      <style>{`
        .ngada-popup .leaflet-popup-content-wrapper{padding:0;border-radius:10px;overflow:hidden;box-shadow:none}
        .ngada-popup .leaflet-popup-content{margin:0}
        .ngada-popup .leaflet-popup-tip-container{display:none}
        .leaflet-container{font-family:inherit}
      `}</style>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* ── LEFT: spot list ── */}
          <div className="lg:col-span-2 space-y-4">
            <div className="relative">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-forest-400" />
              <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Cari wisata atau kabupaten..."
                className="input-field pl-10" />
            </div>

            <div className="flex flex-wrap gap-2">
              {kabList.map(kab => (
                <button key={kab} onClick={() => setActiveKab(kab)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    activeKab === kab ? 'bg-forest-700 text-white' : 'bg-white border border-forest-200 text-forest-600 hover:bg-forest-50'
                  }`}>{kab}</button>
              ))}
            </div>

            <div className="space-y-2 max-h-[540px] overflow-y-auto pr-1">
              <p className="text-xs font-medium text-forest-400 uppercase tracking-wider px-1">
                {filtered.length} lokasi ditemukan
              </p>
              {filtered.length === 0 && (
                <div className="text-center py-10 text-forest-400 text-sm">Tidak ada hasil untuk pencarian ini</div>
              )}
              {filtered.map((spot, i) => (
                <motion.button key={spot.id}
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}
                  onClick={() => setSelected(selected?.id === spot.id ? null : spot)}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-200 ${
                    selected?.id === spot.id
                      ? 'bg-forest-800 text-white border-forest-800 shadow-lg shadow-forest-800/20'
                      : 'bg-white border-ngada-100 hover:border-forest-300 hover:shadow-sm'
                  }`}>
                  <div className="flex items-start gap-3">
                    {spot.foto
                      ? <img src={spot.foto} alt={spot.nama} className="w-10 h-10 rounded-lg object-cover flex-shrink-0 mt-0.5" />
                      : <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${selected?.id === spot.id ? 'bg-ngada-500' : 'bg-forest-100'}`}>
                          <MapPin size={15} className={selected?.id === spot.id ? 'text-white' : 'text-forest-600'} />
                        </div>
                    }
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium text-sm leading-tight truncate ${selected?.id === spot.id ? 'text-white' : 'text-forest-900'}`}>{spot.nama}</p>
                      <p className={`text-xs mt-0.5 truncate ${selected?.id === spot.id ? 'text-white/70' : 'text-forest-400'}`}>{spot.kabupaten ?? '—'}</p>
                      <p className={`text-xs mt-0.5 truncate ${selected?.id === spot.id ? 'text-white/50' : 'text-forest-300'}`}>{spot.alamat}</p>
                    </div>
                    <ChevronRight size={14} className={`flex-shrink-0 mt-1 transition-transform ${selected?.id === spot.id ? 'text-white rotate-90' : 'text-forest-300'}`} />
                  </div>
                  <AnimatePresence>
                    {selected?.id === spot.id && spot.lat && spot.lng && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                        className="mt-3 pt-3 border-t border-white/20 flex gap-2">
                        <a href={getDirectionsUrl(spot.lat, spot.lng)} target="_blank" rel="noopener noreferrer"
                          onClick={e => e.stopPropagation()}
                          className="flex-1 flex items-center justify-center gap-1.5 bg-ngada-500 hover:bg-ngada-400 text-white text-xs font-medium py-2 rounded-lg transition-colors">
                          <Navigation size={12} /> Petunjuk Arah
                        </a>
                        <a href={getGoogleMapsUrl(spot.lat, spot.lng)} target="_blank" rel="noopener noreferrer"
                          onClick={e => e.stopPropagation()}
                          className="flex-1 flex items-center justify-center gap-1.5 bg-white/20 hover:bg-white/30 text-white text-xs font-medium py-2 rounded-lg transition-colors">
                          <ExternalLink size={12} /> Buka Maps
                        </a>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              ))}

              {spotsNoGPS.length > 0 && activeKab === 'Semua' && !search && (
                <div className="mt-4">
                  <p className="text-xs font-medium text-forest-300 uppercase tracking-wider px-1 mb-2">Belum ada koordinat GPS</p>
                  {spotsNoGPS.map(spot => (
                    <div key={spot.id} className="p-3 rounded-xl border border-dashed border-ngada-200 bg-ngada-50/50 mb-2 flex items-center gap-2">
                      <MapPin size={12} className="text-ngada-300 flex-shrink-0" />
                      <p className="text-sm text-forest-500 truncate">{spot.nama}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── RIGHT: Leaflet map ── */}
          <div className="lg:col-span-3">
            <div className="sticky top-24 space-y-3">
              <AnimatePresence mode="wait">
                {selected && (
                  <motion.div key={selected.id}
                    initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                    className="bg-forest-800 text-white rounded-2xl p-4 flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      {selected.foto && (
                        <img src={selected.foto} alt={selected.nama} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
                      )}
                      <div className="min-w-0">
                        <p className="font-display text-lg leading-tight">{selected.nama}</p>
                        <p className="text-white/60 text-xs mt-1 line-clamp-2">{selected.alamat}</p>
                        {selected.lat && selected.lng && (
                          <p className="font-mono text-xs text-ngada-300 mt-1">{selected.lat.toFixed(5)}, {selected.lng.toFixed(5)}</p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => { setSelected(null); leafletRef.current?.flyTo(NTT_CENTER, NTT_ZOOM, { animate: true, duration: 1 }) }}
                      className="flex-shrink-0 text-white/40 hover:text-white/80 transition-colors mt-0.5">
                      <X size={16} />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="bg-white rounded-2xl overflow-hidden shadow border border-ngada-100">
                <div className="bg-forest-50 border-b border-ngada-100 px-4 py-2.5 flex items-center gap-2">
                  <MapIcon size={14} className="text-forest-500" />
                  <span className="text-sm text-forest-600 font-medium">
                    {selected ? `Menampilkan: ${selected.nama}` : 'Peta Nusa Tenggara Timur'}
                  </span>
                  <span className="ml-auto text-xs text-forest-400">{filtered.length} pin aktif</span>
                </div>
                <div className="relative">
                  <div ref={mapElRef} style={{ width: '100%', height: '500px' }} />
                  {!mapReady && (
                    <div className="absolute inset-0 flex items-center justify-center bg-ngada-50/80">
                      <div className="text-forest-400 text-sm animate-pulse">Memuat peta…</div>
                    </div>
                  )}
                </div>
                <div className="px-4 py-2.5 bg-ngada-50 border-t border-ngada-100 flex items-center justify-between">
                  <p className="text-xs text-forest-400">© OpenStreetMap contributors</p>
                  {selected?.lat && selected?.lng && (
                    <a href={getGoogleMapsUrl(selected.lat, selected.lng)} target="_blank" rel="noopener noreferrer"
                      className="text-xs text-ngada-500 hover:text-ngada-700 flex items-center gap-1 font-medium">
                      Buka di Google Maps <ExternalLink size={10} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
