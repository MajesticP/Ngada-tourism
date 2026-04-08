'use client'

import { useEffect, useRef, useState } from 'react'

interface FasilitasMapProps {
  wisataLat: number
  wisataLng: number
  wisataName: string
  atmLat: number | null
  atmLng: number | null
  atmName: string | null   // jarak_atm label e.g. "± 2–3 km"
  rsLat: number | null
  rsLng: number | null
  rsName: string | null    // jarak_rs label e.g. "± 2 km (Puskesmas Bajawa)"
}

declare global {
  interface Window { L: any }
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

async function fetchRoute(
  fromLat: number, fromLng: number,
  toLat: number, toLng: number
): Promise<[number, number][]> {
  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${fromLng},${fromLat};${toLng},${toLat}?overview=full&geometries=geojson`
    const res = await fetch(url)
    if (!res.ok) throw new Error('OSRM error')
    const data = await res.json()
    const coords: [number, number][] = data.routes?.[0]?.geometry?.coordinates ?? []
    return coords.map(([lng, lat]) => [lat, lng])
  } catch {
    return [[fromLat, fromLng], [toLat, toLng]]
  }
}

export default function FasilitasMap({
  wisataLat, wisataLng, wisataName,
  atmLat, atmLng, atmName,
  rsLat, rsLng, rsName,
}: FasilitasMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const loadedRef = useRef(false)
  const [ready, setReady] = useState(false)

  const hasAtm = atmLat != null && atmLng != null
  const hasRs  = rsLat  != null && rsLng  != null

  useEffect(() => { setReady(true) }, [])

  useEffect(() => {
    if (!ready || loadedRef.current || !mapRef.current) return
    loadedRef.current = true

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

      // Wisata marker (green)
      const wisataIcon = L.divIcon({
        className: '',
        html: `<div style="position:relative;width:36px;height:36px;">
          <div style="width:36px;height:36px;background:#21442b;border:3px solid white;border-radius:50% 50% 50% 0;transform:rotate(-45deg);box-shadow:0 4px 12px rgba(33,68,43,0.5);"></div>
          <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-54%);font-size:14px;line-height:1;">🏔️</div>
        </div>`,
        iconSize: [36, 36], iconAnchor: [18, 36], popupAnchor: [0, -36],
      })
      L.marker([wisataLat, wisataLng], { icon: wisataIcon })
        .addTo(map)
        .bindPopup(`<div style="font-size:12px;font-weight:700;color:#1b3924;min-width:120px">${wisataName}</div><div style="font-size:11px;color:#555;margin-top:2px">📍 Lokasi Wisata</div>`)

      const allPoints: [number, number][] = [[wisataLat, wisataLng]]

      // ATM marker (blue)
      if (hasAtm) {
        allPoints.push([atmLat!, atmLng!])
        const atmIcon = L.divIcon({
          className: '',
          html: `<div style="position:relative;width:32px;height:32px;">
            <div style="width:32px;height:32px;background:#1d4ed8;border:3px solid white;border-radius:50% 50% 50% 0;transform:rotate(-45deg);box-shadow:0 4px 12px rgba(29,78,216,0.4);"></div>
            <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-54%);font-size:13px;line-height:1;">🏧</div>
          </div>`,
          iconSize: [32, 32], iconAnchor: [16, 32], popupAnchor: [0, -32],
        })
        const distKm = haversineKm(wisataLat, wisataLng, atmLat!, atmLng!)
        L.marker([atmLat!, atmLng!], { icon: atmIcon })
          .addTo(map)
          .bindPopup(`<div style="font-size:12px;font-weight:700;color:#1e3a8a;min-width:140px">ATM Terdekat</div><div style="font-size:11px;color:#555;margin-top:2px">🏧 ${atmName ?? ''} · ±${distKm.toFixed(1)} km dari wisata</div>`)
        fetchRoute(wisataLat, wisataLng, atmLat!, atmLng!).then(coords => {
          L.polyline(coords, { color: '#3b82f6', weight: 3, opacity: 0.85, dashArray: '8, 5' }).addTo(map)
        })
      }

      // RS marker (red)
      if (hasRs) {
        allPoints.push([rsLat!, rsLng!])
        const rsIcon = L.divIcon({
          className: '',
          html: `<div style="position:relative;width:32px;height:32px;">
            <div style="width:32px;height:32px;background:#dc2626;border:3px solid white;border-radius:50% 50% 50% 0;transform:rotate(-45deg);box-shadow:0 4px 12px rgba(220,38,38,0.4);"></div>
            <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-54%);font-size:13px;line-height:1;">🏥</div>
          </div>`,
          iconSize: [32, 32], iconAnchor: [16, 32], popupAnchor: [0, -32],
        })
        const distKm = haversineKm(wisataLat, wisataLng, rsLat!, rsLng!)
        L.marker([rsLat!, rsLng!], { icon: rsIcon })
          .addTo(map)
          .bindPopup(`<div style="font-size:12px;font-weight:700;color:#991b1b;min-width:140px">RS / Puskesmas</div><div style="font-size:11px;color:#555;margin-top:2px">🏥 ${rsName ?? ''} · ±${distKm.toFixed(1)} km dari wisata</div>`)
        fetchRoute(wisataLat, wisataLng, rsLat!, rsLng!).then(coords => {
          L.polyline(coords, { color: '#ef4444', weight: 3, opacity: 0.85, dashArray: '8, 5' }).addTo(map)
        })
      }

      if (allPoints.length > 1) {
        map.fitBounds(L.latLngBounds(allPoints), { padding: [40, 40] })
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
  }, [ready])

  return (
    <div className="mt-6 rounded-2xl overflow-hidden border border-ngada-100 shadow-sm">
      {/* Header */}
      <div className="bg-forest-800 px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-ngada-400 text-sm">🗺️</span>
          <span className="text-white text-sm font-semibold">Peta Akses Fasilitas</span>
        </div>
        <span className="text-white/40 text-xs">OpenStreetMap</span>
      </div>

      {/* Map */}
      <div style={{ height: 280 }}>
        <div ref={mapRef} className="w-full h-full" />
      </div>

      {/* Legend */}
      <div className="bg-white border-t border-ngada-100 px-5 py-3">
        <div className="flex flex-wrap gap-4 text-xs text-forest-700">
          <div className="flex items-center gap-1.5">
            <span className="text-sm">🏔️</span>
            <span className="font-semibold text-forest-900">{wisataName}</span>
          </div>
          {hasAtm && (
            <div className="flex items-center gap-1.5">
              <span className="w-4 inline-block" style={{ borderTop: '2px dashed #3b82f6' }} />
              <span className="text-sm">🏧</span>
              <span>ATM Terdekat</span>
              {atmName && <span className="text-forest-400">({atmName})</span>}
            </div>
          )}
          {hasRs && (
            <div className="flex items-center gap-1.5">
              <span className="w-4 inline-block" style={{ borderTop: '2px dashed #ef4444' }} />
              <span className="text-sm">🏥</span>
              <span>RS / Puskesmas</span>
              {rsName && <span className="text-forest-400">({rsName})</span>}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
