type FasilitasFields = {
  akses_jalan: string
  parkir: string
  toilet: string
  jarak_atm: string
  jarak_rs: string
  spot_foto: string
}

type Props = FasilitasFields & {
  onChange: (key: keyof FasilitasFields, value: string) => void
}

const SELECT_OPTS: Record<string, string[]> = {
  akses_jalan: ['Sangat Baik', 'Baik', 'Baik + Laut', 'Cukup', 'Trekking', 'Sulit'],
  parkir:      ['Luas', 'Ada', 'Terbatas', 'Tidak ada'],
  toilet:      ['Ada', 'Tidak ada'],
  spot_foto:   ['Sangat Menarik', 'Menarik', 'Cukup', 'Terbatas'],
}

export default function FasilitasSection({ akses_jalan, parkir, toilet, jarak_atm, jarak_rs, spot_foto, onChange }: Props) {
  const sel = (key: keyof FasilitasFields) => (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => onChange(key, e.target.value)

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-ngada-100 p-6 space-y-4">
      <h3 className="font-semibold text-forest-900 flex items-center gap-2 text-sm">
        <span className="w-6 h-6 rounded-full bg-forest-800 text-white text-xs flex items-center justify-center">4</span>
        Data Fasilitas
      </h3>
      <p className="text-xs text-forest-400">Data ini akan ditampilkan di halaman Fasilitas publik.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {(['akses_jalan', 'parkir', 'toilet', 'spot_foto'] as const).map(key => (
          <div key={key} className="space-y-1.5">
            <label className="block text-sm font-medium text-forest-700 capitalize">{key.replace('_', ' ')}</label>
            <select value={{ akses_jalan, parkir, toilet, spot_foto }[key]} onChange={sel(key)} className="input-field">
              <option value="">— Pilih —</option>
              {SELECT_OPTS[key].map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>
        ))}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-forest-700">Jarak ATM Terdekat</label>
          <input type="text" value={jarak_atm} onChange={sel('jarak_atm')} className="input-field" placeholder="cth. ± 5-7 km" />
        </div>
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-forest-700">Jarak ke RS / Puskesmas</label>
          <input type="text" value={jarak_rs} onChange={sel('jarak_rs')} className="input-field" placeholder="cth. ± 6 km (RSUD Bajawa)" />
        </div>
      </div>
    </div>
  )
}
