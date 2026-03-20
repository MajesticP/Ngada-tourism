import { useRef } from 'react'
import Image from 'next/image'
import { ImageIcon, Trash2, Upload, X, Loader2 } from 'lucide-react'

type Props = {
  preview: string | null
  uploading: boolean
  galeri_gambar: string
  galeri_keterangan: string
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onClear: () => void
  onKeteranganChange: (val: string) => void
}

export default function FotoSection({ preview, uploading, galeri_gambar, galeri_keterangan, onFileChange, onClear, onKeteranganChange }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-ngada-100 p-6 space-y-4">
      <div className="flex items-center justify-between border-b border-ngada-100 pb-3">
        <h2 className="font-display text-base text-forest-800 flex items-center gap-2">
          <ImageIcon size={15} className="text-ngada-500" /> Foto Utama
        </h2>
        {preview && (
          <button type="button" onClick={onClear} className="text-xs text-terra-500 hover:text-terra-700 flex items-center gap-1">
            <Trash2 size={12} /> Hapus foto
          </button>
        )}
      </div>

      <div onClick={() => fileInputRef.current?.click()} className={`relative cursor-pointer rounded-xl border-2 border-dashed transition-colors overflow-hidden ${preview ? 'border-ngada-200' : 'border-ngada-200 hover:border-ngada-400 bg-ngada-50/50 hover:bg-ngada-50'}`}>
        {preview ? (
          <div className="relative h-52 w-full">
            <Image src={preview} alt="Preview" fill className="object-cover" unoptimized />
            <div className="absolute inset-0 bg-black/0 hover:bg-black/30 transition-colors flex items-center justify-center">
              <span className="opacity-0 hover:opacity-100 text-white text-sm font-medium flex items-center gap-2 transition-opacity"><Upload size={15} /> Ganti foto</span>
            </div>
            {uploading && (
              <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                <Loader2 size={24} className="animate-spin text-ngada-500" />
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 gap-3 text-forest-400">
            {uploading ? <Loader2 size={28} className="animate-spin text-ngada-500" /> : <Upload size={28} className="text-ngada-400" />}
            <div className="text-center">
              <p className="text-sm font-medium text-forest-600">{uploading ? 'Mengunggah...' : 'Klik untuk pilih foto'}</p>
              <p className="text-xs text-forest-400 mt-1">JPG, PNG, WebP — maks 5MB</p>
            </div>
          </div>
        )}
      </div>

      <input ref={fileInputRef} type="file" accept="image/jpeg,image/jpg,image/png,image/webp" className="hidden" onChange={onFileChange} />

      {galeri_gambar && (
        <div className="flex items-center gap-2 text-xs text-forest-500 bg-ngada-50 rounded-lg px-3 py-2">
          <ImageIcon size={12} className="text-ngada-400 flex-shrink-0" />
          <span className="font-mono truncate">{galeri_gambar}</span>
          <button type="button" onClick={onClear} className="ml-auto text-forest-400 hover:text-terra-500 flex-shrink-0"><X size={13} /></button>
        </div>
      )}

      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-forest-700">Keterangan Foto</label>
        <input type="text" value={galeri_keterangan} onChange={e => onKeteranganChange(e.target.value)} className="input-field" placeholder="cth. Pemandangan megalitik dari atas bukit" />
      </div>
    </div>
  )
}
