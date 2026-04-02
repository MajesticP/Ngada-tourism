'use client'

import { useEffect, useRef, useState } from 'react'

interface FasilitasMapProps {
  wisataLat: number
  wisataLng: number
  wisataName: string
}

interface NearbyPlace {
  lat: number
  lng: number
  name: string
  type: 'atm' | 'rs'
  tags?: Record<string, string>
}

declare global {
  interface Window { L: any }
}

async function fetchNearbyFacilities(lat: number, lng: number): Promise<NearbyPlace[]> {
  const radius = 15000 // 15km radius
  const query = `
    [out:json][timeout:15];
    (
      node["amenity"="atm"](around:${radius},${lat},${lng});
      node["amenity"="bank"]["atm"="yes"](around:${radius},${lat},${lng});
      node["amenity"="hospital"](around:${radius},${lat},${lng});
      node["amenity"="clinic"](around:${radius},${lat},${lng});
      node["amenity"="doctors"](around:${radius},${lat},${lng});
      node["healthcare"="hospital"](around:${radius},${lat},${lng});
    );
    out body;
  `.trim()

  const res = await fetch('https://overpass-api.de/api/interpreter', {
    method: 'POST',
    body: query,
    headers: { 'Content-Type': 'text/plain' },
  })
  const data = await res.json()

  const results: NearbyPlace[] = []
  const atmCandidates: (NearbyPlace & { dist: number })[] = []
  const rsCandidates: (NearbyPlace & { dist: number })[] = []

  for (const el of data.elements ?? []) {
    if (el.type !== 'node') continue
    const amenity = el.tags?.amenity ?? ''
    const healthcare = el.tags?.healthcare ?? ''
    const dist = Math.sqrt((el.lat - lat) ** 2 + (el.lon - lng) ** 2)
    const name = el.tags?.name ?? el.tags?.operator ?? null

    if (amenity === 'atm' || el.tags?.atm === 'yes') {
      atmCandidates.push({ lat: el.lat, lng: el.lon, name: name ?? 'ATM Terdekat', type: 'atm', tags: el.tags, dist })
    } else if (['hospital', 'clinic', 'doctors'].includes(amenity) || healthcare === 'hospital') {
      rsCandidates.push({ lat: el.lat, lng: el.lon, name: name ?? 'Fasilitas Kesehatan', type: 'rs', tags: el.tags, dist })
    }
  }

  atmCandidates.sort((a, b) => a.dist - b.dist)
  rsCandidates.sort((a, b) => a.dist - b.dist)

  if (atmCandidates[0]) results.push(atmCandidates[0])
  if (rsCandidates[0]) results.push(rsCandidates[0])

  return results
}

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export default function FasilitasMap({ wisataLat, wisataLng, wisataName }: FasilitasMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const loadedRef = useRef(false)
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [facilities, setFacilities] = useState<NearbyPlace[]>([])
  const [activeInfo, setActiveInfo] = useState<NearbyPlace | null>(null)

  useEffect(() => {
    fetchNearbyFacilities(wisataLat, wisataLng)
      .then(f => {
        setFacilities(f)
        setStatus('ready')
      })
      .catch(() => setStatus('error'))
  }, [wisataLat, wisataLng])

  useEffect(() => {
    if (status !== 'ready' || loadedRef.current || !mapRef.current) return
    loadedRef.current = true

    // Leaflet CSS
    if (!document.querySelector('link[data-leaflet]')) {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
      link.setAttribute('data-leaflet', '1')
      document.head.appendChild(link)
    }

    const initMap = () => {
      const L = window.L
      if (!mapRef.current || mapInstanceRef.current) return

      // Fit bounds around all points
      const allPoints: [number, number][] = [[wisataLat, wisataLng]]
      facilities.forEach(f => allPoints.push([f.lat, f.lng]))

      const map = L.map(mapRef.current, {
        zoomControl: false,
        scrollWheelZoom: false,
        attributionControl: false,
      })

      L.control.zoom({ position: 'bottomright' }).addTo(map)
      L.control.attribution({ prefix: false }).addTo(map)

      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OSM</a> © <a href="https://carto.com">CARTO</a>',
        maxZoom: 19,
      }).addTo(map)

      // ── Wisata marker (green) ──
      const wisataIcon = L.divIcon({
        className: '',
        html: `
          <div style="position:relative;width:36px;height:36px;">
            <div style="
              width:36px;height:36px;
              background:#21442b;
              border:3px solid white;
              border-radius:50% 50% 50% 0;
              transform:rotate(-45deg);
              box-shadow:0 4px 12px rgba(33,68,43,0.5);
            "></div>
            <div style="
              position:absolute;top:50%;left:50%;
              transform:translate(-50%,-54%);
              font-size:14px;line-height:1;
            ">🏔️</div>
          </div>`,
        iconSize: [36, 36],
        iconAnchor: [18, 36],
        popupAnchor: [0, -36],
      })

      L.marker([wisataLat, wisataLng], { icon: wisataIcon, title: wisataName })
        .addTo(map)
        .bindPopup(`<div style="font-size:12px;font-weight:700;color:#1b3924;min-width:120px">${wisataName}</div><div style="font-size:11px;color:#555;margin-top:2px">📍 Lokasi Wisata</div>`)

      // ── Facility markers ──
      const atmFacility = facilities.find(f => f.type === 'atm')
      const rsFacility = facilities.find(f => f.type === 'rs')

      if (atmFacility) {
        const atmIcon = L.divIcon({
          className: '',
          html: `
            <div style="position:relative;width:32px;height:32px;">
              <div style="
                width:32px;height:32px;
                background:#1d4ed8;
                border:3px solid white;
                border-radius:50% 50% 50% 0;
                transform:rotate(-45deg);
                box-shadow:0 4px 12px rgba(29,78,216,0.4);
              "></div>
              <div style="
                position:absolute;top:50%;left:50%;
                transform:translate(-50%,-54%);
                font-size:13px;line-height:1;
              ">🏧</div>
            </div>`,
          iconSize: [32, 32],
          iconAnchor: [16, 32],
          popupAnchor: [0, -32],
        })

        const distKm = haversineKm(wisataLat, wisataLng, atmFacility.lat, atmFacility.lng)
        L.marker([atmFacility.lat, atmFacility.lng], { icon: atmIcon, title: atmFacility.name })
          .addTo(map)
          .bindPopup(`<div style="font-size:12px;font-weight:700;color:#1e3a8a;min-width:140px">${atmFacility.name}</div><div style="font-size:11px;color:#555;margin-top:2px">🏧 ATM · ±${distKm.toFixed(1)} km dari wisata</div>`)

        // Dashed polyline wisata → ATM
        L.polyline([[wisataLat, wisataLng], [atmFacility.lat, atmFacility.lng]], {
          color: '#3b82f6',
          weight: 2.5,
          opacity: 0.8,
          dashArray: '8, 6',
        }).addTo(map)
      }

      if (rsFacility) {
        const rsIcon = L.divIcon({
          className: '',
          html: `
            <div style="position:relative;width:32px;height:32px;">
              <div style="
                width:32px;height:32px;
                background:#dc2626;
                border:3px solid white;
                border-radius:50% 50% 50% 0;
                transform:rotate(-45deg);
                box-shadow:0 4px 12px rgba(220,38,38,0.4);
              "></div>
              <div style="
                position:absolute;top:50%;left:50%;
                transform:translate(-50%,-54%);
                font-size:13px;line-height:1;
              ">🏥</div>
            </div>`,
          iconSize: [32, 32],
          iconAnchor: [16, 32],
          popupAnchor: [0, -32],
        })

        const distKm = haversineKm(wisataLat, wisataLng, rsFacility.lat, rsFacility.lng)
        L.marker([rsFacility.lat, rsFacility.lng], { icon: rsIcon, title: rsFacility.name })
          .addTo(map)
          .bindPopup(`<div style="font-size:12px;font-weight:700;color:#991b1b;min-width:140px">${rsFacility.name}</div><div style="font-size:11px;color:#555;margin-top:2px">🏥 RS/Puskesmas · ±${distKm.toFixed(1)} km dari wisata</div>`)

        // Dashed polyline wisata → RS
        L.polyline([[wisataLat, wisataLng], [rsFacility.lat, rsFacility.lng]], {
          color: '#ef4444',
          weight: 2.5,
          opacity: 0.8,
          dashArray: '8, 6',
        }).addTo(map)
      }

      // Fit map to all markers
      if (allPoints.length > 1) {
        const bounds = L.latLngBounds(allPoints)
        map.fitBounds(bounds, { padding: [40, 40] })
      } else {
        map.setView([wisataLat, wisataLng], 14)
      }

      mapInstanceRef.current = map
    }

    if (window.L) {
      initMap()
    } else {
      const script = document.createElement('script')
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
      script.onload = initMap
      document.head.appendChild(script)
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
        loadedRef.current = false
      }
    }
  }, [status, facilities])

  const atmFacility = facilities.find(f => f.type === 'atm')
  const rsFacility = facilities.find(f => f.type === 'rs')

  return (
    <div className="mt-6 rounded-2xl overflow-hidden border border-ngada-100 shadow-sm">
      {/* Header */}
      <div className="bg-forest-800 px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-ngada-400 text-sm">🗺️</span>
          <span className="text-white text-sm font-semibold">Peta Akses Fasilitas</span>
        </div>
        <span className="text-white/40 text-xs">Sumber: OpenStreetMap</span>
      </div>

      {/* Map container */}
      <div className="relative bg-ngada-50" style={{ height: 280 }}>
        {status === 'loading' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-ngada-50 z-10">
            <div className="w-6 h-6 border-2 border-forest-700 border-t-transparent rounded-full animate-spin" />
            <span className="text-forest-600 text-xs">Mencari fasilitas terdekat...</span>
          </div>
        )}
        {status === 'error' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-ngada-50 z-10">
            <span className="text-2xl">📡</span>
            <span className="text-forest-600 text-xs text-center px-6">
              Gagal memuat peta. Periksa koneksi internet.
            </span>
          </div>
        )}
        <div ref={mapRef} className="w-full h-full" />
      </div>

      {/* Legend */}
      <div className="bg-white border-t border-ngada-100 px-5 py-3">
        <div className="flex flex-wrap gap-4 text-xs text-forest-700">
          <div className="flex items-center gap-1.5">
            <span className="text-sm">🏔️</span>
            <span className="font-semibold text-forest-900">{wisataName}</span>
          </div>
          {atmFacility ? (
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-0.5 bg-blue-500 inline-block" style={{ borderTop: '2px dashed #3b82f6' }} />
              <span className="text-sm">🏧</span>
              <span>{atmFacility.name}</span>
              <span className="text-forest-400">
                (±{haversineKm(wisataLat, wisataLng, atmFacility.lat, atmFacility.lng).toFixed(1)} km)
              </span>
            </div>
          ) : status === 'ready' ? (
            <div className="flex items-center gap-1.5 text-forest-400">
              <span className="text-sm">🏧</span>
              <span>ATM tidak ditemukan dalam radius 15 km</span>
            </div>
          ) : null}
          {rsFacility ? (
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-0.5 bg-red-500 inline-block" style={{ borderTop: '2px dashed #ef4444' }} />
              <span className="text-sm">🏥</span>
              <span>{rsFacility.name}</span>
              <span className="text-forest-400">
                (±{haversineKm(wisataLat, wisataLng, rsFacility.lat, rsFacility.lng).toFixed(1)} km)
              </span>
            </div>
          ) : status === 'ready' ? (
            <div className="flex items-center gap-1.5 text-forest-400">
              <span className="text-sm">🏥</span>
              <span>RS/Puskesmas tidak ditemukan dalam radius 15 km</span>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
