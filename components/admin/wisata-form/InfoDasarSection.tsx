import { Tag } from 'lucide-react'

const KATEGORI_OPTIONS = [
  { value: 'wisata_alam',   label: 'Wisata Alam' },
  { value: 'wisata_budaya', label: 'Wisata Budaya' },
  { value: 'kampung_adat',  label: 'Kampung Adat' },
  { value: 'wisata_bahari', label: 'Wisata Bahari' },
  { value: 'pulau_eksotis', label: 'Pulau Eksotis' },
  { value: 'penginapan',    label: 'Penginapan / Hotel' },
  { value: 'kuliner',       label: 'Kuliner' },
  { value: 'religi',        label: 'Wisata Religi' },
]

type Props = {
  nama_tempat_wisata: string
  alamat: string
  informasi1: string
  kategori: string
  id_kabupaten: number | null
  kabupaten: { id_kabupaten: number; nama_kabupaten: string }[]
  onChange: (key: string, value: string | number | null) => void
}

export default function InfoDasarSection({ nama_tempat_wisata, alamat, informasi1, kategori, id_kabupaten, kabupaten, onChange }: Props) {
  const handle = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const val = e.target.value
    onChange(key, key === 'id_kabupaten' ? (val === '' ? null : Number(val)) : val)
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-ngada-100 p-6 space-y-5">
      <h2 className="font-display text-base text-forest-800 border-b border-ngada-100 pb-3">Informasi Dasar</h2>

      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-forest-700">Nama Tempat Wisata *</label>
        <input type="text" value={nama_tempat_wisata} onChange={handle('nama_tempat_wisata')} required className="input-field" placeholder="cth. Kampung Adat Bena" />
      </div>

      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-forest-700">Alamat *</label>
        <textarea value={alamat} onChange={handle('alamat')} required rows={2} className="input-field resize-none" placeholder="cth. Desa Bena, Kabupaten Golewa, Kabupaten Ngada" />
      </div>

      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-forest-700">Deskripsi *</label>
        <textarea value={informasi1} onChange={handle('informasi1')} required rows={5} className="input-field resize-none" placeholder="Deskripsi lengkap tentang tempat wisata ini..." />
      </div>

      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-forest-700">Kabupaten</label>
        <select value={id_kabupaten ?? ''} onChange={handle('id_kabupaten')} className="input-field">
          <option value="">— Pilih Kabupaten —</option>
          {kabupaten.map(k => <option key={k.id_kabupaten} value={k.id_kabupaten}>{k.nama_kabupaten}</option>)}
        </select>
      </div>

      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-forest-700 flex items-center gap-1.5">
          <Tag size={13} className="text-ngada-500" /> Kategori / Tipe Tempat
        </label>
        <select value={kategori} onChange={handle('kategori')} className="input-field">
          {KATEGORI_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
      </div>
    </div>
  )
}
