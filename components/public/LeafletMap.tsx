'use client'

import { useEffect, useRef } from 'react'

export type MapSpot = {
  id: number
  nama: string
  alamat: string
  kabupaten: string | null
  lat: number
  lng: number
  deskripsi: string | null
  foto: string | null
}

interface LeafletMapProps {
  spots: MapSpot[]
  selected: MapSpot | null
  onSelect: (spot: MapSpot) => void
}

declare global {
  interface Window {
    L: any
  }
}

export default function LeafletMap({ spots, selected, onSelect }: LeafletMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markersRef = useRef<Map<number, any>>(new Map())
  const loadedRef = useRef(false)

  const createIcon = (L: any, isSelected: boolean) => {
    const size = isSelected ? 38 : 28
    const bg = isSelected ? '#1b4332' : '#40916c'
    const border = isSelected ? 4 : 3
    const shadow = isSelected
      ? '0 8px 24px rgba(27,67,50,0.5), 0 2px 8px rgba(0,0,0,0.3)'
      : '0 4px 12px rgba(0,0,0,0.25)'

    return L.divIcon({
      className: '',
      html: `
        <div style="position:relative;width:${size}px;height:${size}px;">
          <div style="
            width:${size}px;height:${size}px;
            background:${bg};
            border:${border}px solid white;
            border-radius:50% 50% 50% 0;
            transform:rotate(-45deg);
            box-shadow:${shadow};
            transition:all 0.25s cubic-bezier(.34,1.56,.64,1);
          "></div>
          ${isSelected ? `<div style="
            position:absolute;top:50%;left:50%;
            transform:translate(-50%,-50%) rotate(0deg);
            width:8px;height:8px;
            background:white;border-radius:50%;
            margin-top:-4px;
          "></div>` : ''}
        </div>
      `,
      iconSize: [size, size],
      iconAnchor: [size / 2, size],
      popupAnchor: [0, -size],
    })
  }

  // Initialize map
  useEffect(() => {
    if (loadedRef.current || !mapRef.current) return
    loadedRef.current = true

    // Load Leaflet CSS
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
    link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY='
    link.crossOrigin = ''
    document.head.appendChild(link)

    // Load Leaflet JS
    const script = document.createElement('script')
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
    script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV/XN/WLEo='
    script.crossOrigin = ''

    script.onload = () => {
      const L = window.L
      if (!mapRef.current || mapInstanceRef.current) return

      const map = L.map(mapRef.current, {
        center: [-8.65, 120.95],
        zoom: 10,
        zoomControl: false,
        attributionControl: true,
      })

      L.control.zoom({ position: 'bottomright' }).addTo(map)

      // Refined tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map)

      // Add markers for all spots
      spots.forEach(spot => {
        const marker = L.marker([spot.lat, spot.lng], {
          icon: createIcon(L, false),
          title: spot.nama,
        })
          .addTo(map)
          .on('click', () => onSelect(spot))

        markersRef.current.set(spot.id, marker)
      })

      mapInstanceRef.current = map
    }

    document.head.appendChild(script)

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
        markersRef.current.clear()
        loadedRef.current = false
      }
    }
  }, [])

  // React to selected changes
  useEffect(() => {
    if (!mapInstanceRef.current || !window.L) return
    const L = window.L

    markersRef.current.forEach((marker, id) => {
      marker.setIcon(createIcon(L, selected?.id === id))
    })

    if (selected) {
      mapInstanceRef.current.flyTo([selected.lat, selected.lng], 14, {
        duration: 1,
        easeLinearity: 0.25,
      })
    } else {
      mapInstanceRef.current.flyTo([-8.65, 120.95], 10, { duration: 1 })
    }
  }, [selected])

  return (
    <div ref={mapRef} className="w-full h-full" style={{ minHeight: '100%' }} />
  )
}
