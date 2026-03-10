'use client'

import { useEffect, useRef, useState } from 'react'
import { Search, Navigation, ExternalLink, X, MapPin, Camera } from 'lucide-react'

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
}

export default function LokasiMap({ spots }: { spots: Spot[] }) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<import('leaflet').Map | null>(null)
  const [search, setSearch] = useState('')
  const [activeKab, setActiveKab] = useState('Semua')
  const [selected, setSelected] = useState<Spot | null>(null)
  const [photoIdx, setPhotoIdx] = useState(0)

  const spotsWithGPS = spots.filter(s => s.lat && s.lng)

  const kabList = [
    'Semua',
    ...Array.from(new Set(spots.map(s => s.kabupaten).filter(Boolean) as string[])),
  ]

  const filtered = spotsWithGPS.filter(s => {
    const q = search.toLowerCase()
    const matchSearch =
      s.nama.toLowerCase().includes(q) ||
      (s.kabupaten?.toLowerCase().includes(q) ?? false)
    const matchKab = activeKab === 'Semua' || s.kabupaten === activeKab
    return matchSearch && matchKab
  })

  // Init Leaflet map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    import('leaflet').then(L => {
      delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      })

      const map = L.map(mapRef.current!, {
        center: [-8.659, 121.0536],
        zoom: 10,
        zoomControl: true,
      })

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18,
      }).addTo(map)

      spotsWithGPS.forEach(spot => {
        if (!spot.lat || !spot.lng) return

        const markerHtml = `
          <div style="
            width:36px;height:36px;border-radius:50% 50% 50% 0;
            background:#2d6a4f;border:3px solid white;
            box-shadow:0 2px 8px rgba(0,0,0,0.35);
            transform:rotate(-45deg);
            cursor:pointer;
          ">
            <div style="
              width:10px;height:10px;background:white;border-radius:50%;
              position:absolute;top:50%;left:50%;
              transform:translate(-50%,-50%) rotate(45deg);
            "></div>
          </div>`

        const icon = L.divIcon({
          html: markerHtml,
          className: '',
          iconSize: [36, 36],
          iconAnchor: [18, 36],
        })

        L.marker([spot.lat, spot.lng], { icon })
          .addTo(map)
          .on('click', () => {
            setSelected(spot)
            setPhotoIdx(0)
          })
      })

      mapInstanceRef.current = map
    })

    return () => {
      mapInstanceRef.current?.remove()
      mapInstanceRef.current = null
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Fly to selected
  useEffect(() => {
    if (!selected?.lat || !selected?.lng || !mapInstanceRef.current) return
    mapInstanceRef.current.flyTo([selected.lat, selected.lng], 14, { duration: 1 })
  }, [selected])

  const photos = selected ? (selected.fotos.length > 0 ? selected.fotos : selected.foto ? [selected.foto] : []) : []

  return (
    <section className="py-8 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* ── LEFT: Spot list ── */}
          <div className="lg:col-span-2 space-y-4">

            {/* Search */}
            <div className="relative">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-forest-400" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Cari wisata atau kabupaten..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-ngada-200 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500/20 focus:border-forest-400 bg-white"
              />
            </div>

            {/* Kabupaten filter */}
            <div className="flex flex-wrap gap-2">
              {kabList.map(kab => (
                <button
                  key={kab}
                  onClick={() => setActiveKab(kab)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    activeKab === kab
                      ? 'bg-forest-700 text-white'
                      : 'bg-white border border-forest-200 text-forest-600 hover:bg-forest-50'
                  }`}
                >
                  {kab}
                </button>
              ))}
            </div>

            {/* List */}
            <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
              <p className="text-xs font-medium text-forest-400 uppercase tracking-wider px-1">
                {filtered.length} lokasi ditemukan
              </p>

              {filtered.map(spot => (
                <button
                  key={spot.id}
                  onClick={() => { setSelected(spot); setPhotoIdx(0) }}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-200 ${
                    selected?.id === spot.id
                      ? 'bg-forest-800 text-white border-forest-800 shadow-lg'
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
                    </div>
                  </div>
                </button>
              ))}

              {/* No GPS spots */}
              {spots.filter(s => !s.lat || !s.lng).length > 0 && activeKab === 'Semua' && !search && (
                <div className="mt-4">
                  <p className="text-xs font-medium text-forest-300 uppercase tracking-wider px-1 mb-2">
                    Belum ada koordinat GPS
                  </p>
                  {spots.filter(s => !s.lat || !s.lng).map(spot => (
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

          {/* ── RIGHT: Map ── */}
          <div className="lg:col-span-3">
            <div className="sticky top-24 space-y-4">

              {/* Leaflet CSS */}
              <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />

              {/* Map container */}
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-ngada-100">
                <div className="bg-forest-50 border-b border-ngada-100 px-4 py-2.5 flex items-center gap-2">
                  <MapPin size={14} className="text-forest-500" />
                  <span className="text-sm text-forest-600 font-medium">Peta Kabupaten Ngada</span>
                  {selected && (
                    <button
                      onClick={() => setSelected(null)}
                      className="ml-auto text-xs text-forest-400 hover:text-forest-600 flex items-center gap-1"
                    >
                      <X size={12} /> Reset
                    </button>
                  )}
                </div>
                <div ref={mapRef} style={{ height: '460px', width: '100%' }} />
                <div className="px-4 py-2 bg-ngada-50 border-t border-ngada-100">
                  <p className="text-xs text-forest-400">© OpenStreetMap contributors</p>
                </div>
              </div>

              {/* Popup card when marker clicked */}
              {selected && (
                <div className="bg-forest-800 text-white rounded-2xl overflow-hidden shadow-xl">

                  {/* Photo */}
                  {photos.length > 0 ? (
                    <div className="relative h-48 bg-forest-900">
                      <img
                        key={photoIdx}
                        src={photos[photoIdx]}
                        alt={selected.nama}
                        className="w-full h-full object-cover"
                        onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-forest-900/60 to-transparent" />
                      {photos.length > 1 && (
                        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
                          {photos.map((_, i) => (
                            <button
                              key={i}
                              onClick={() => setPhotoIdx(i)}
                              className={`rounded-full transition-all ${
                                i === photoIdx ? 'w-4 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/50'
                              }`}
                            />
                          ))}
                        </div>
                      )}
                      <button
                        onClick={() => setSelected(null)}
                        className="absolute top-3 right-3 w-7 h-7 rounded-full bg-black/50 flex items-center justify-center hover:bg-black/70 transition-colors"
                      >
                        <X size={13} />
                      </button>
                    </div>
                  ) : (
                    <div className="relative h-20 bg-forest-900 flex items-center justify-center">
                      <Camera size={24} className="text-white/20" />
                      <button
                        onClick={() => setSelected(null)}
                        className="absolute top-3 right-3 w-7 h-7 rounded-full bg-black/50 flex items-center justify-center hover:bg-black/70 transition-colors"
                      >
                        <X size={13} />
                      </button>
                    </div>
                  )}

                  {/* Info */}
                  <div className="p-5">
                    <p className="font-display text-xl leading-tight">{selected.nama}</p>
                    <p className="text-white/60 text-sm mt-1.5 flex items-start gap-1.5">
                      <MapPin size={13} className="mt-0.5 flex-shrink-0 text-ngada-400" />
                      {selected.alamat}
                    </p>
                    {selected.deskripsi && (
                      <p className="text-white/50 text-xs mt-3 leading-relaxed line-clamp-3">
                        {selected.deskripsi}
                      </p>
                    )}
                    {selected.lat && selected.lng && (
                      <p className="font-mono text-xs text-ngada-300 mt-3">
                        {selected.lat.toFixed(6)}, {selected.lng.toFixed(6)}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  {selected.lat && selected.lng && (
                    <div className="px-5 pb-5 flex gap-3">
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${selected.lat},${selected.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 bg-ngada-500 hover:bg-ngada-400 text-white text-sm font-medium py-2.5 rounded-xl transition-colors"
                      >
                        <Navigation size={14} /> Petunjuk Arah
                      </a>
                      <a
                        href={`https://www.google.com/maps?q=${selected.lat},${selected.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium py-2.5 rounded-xl transition-colors"
                      >
                        <ExternalLink size={14} /> Google Maps
                      </a>
                    </div>
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
