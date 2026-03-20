import { MapPin, ExternalLink, Trash2 } from 'lucide-react'

type Props = {
  lat: string
  lng: string
  onChange: (key: string, value: string) => void
  onClear: () => void
}

export default function LokasiSection({ lat, lng, onChange, onClear }: Props) {
  const mapsUrl = lat && lng ? `https://www.google.com/maps?q=${lat},${lng}` : null

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-ngada-100 p-6 space-y-4">
      <div className="flex items-center justify-between border-b border-ngada-100 pb-3">
        <h2 className="font-display text-base text-forest-800 flex items-center gap-2">
          <MapPin size={15} className="text-ngada-500" /> Koordinat GPS
        </h2>
        <div className="flex items-center gap-3">
          {mapsUrl && (
            <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-ngada-500 hover:text-ngada-700 flex items-center gap-1 font-medium">
              Lihat di Maps <ExternalLink size={11} />
            </a>
          )}
          {(lat || lng) && (
            <button type="button" onClick={onClear} className="text-xs text-terra-500 hover:text-terra-700 flex items-center gap-1">
              <Trash2 size={12} /> Hapus
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-forest-700">Latitude</label>
          <input type="number" step="any" value={lat} onChange={e => onChange('lat', e.target.value)} placeholder="-8.5590" className="input-field font-mono" />
        </div>
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-forest-700">Longitude</label>
          <input type="number" step="any" value={lng} onChange={e => onChange('lng', e.target.value)} placeholder="121.0890" className="input-field font-mono" />
        </div>
      </div>

      <p className="text-xs text-forest-400">
        💡 Klik kanan di{' '}
        <a href="https://maps.google.com" target="_blank" rel="noopener" className="text-ngada-500 hover:underline">Google Maps</a>
        {' '}→ &ldquo;What&rsquo;s here?&rdquo; untuk mendapatkan koordinat
      </p>
    </div>
  )
}
