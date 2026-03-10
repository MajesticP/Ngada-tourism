'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import toast from 'react-hot-toast'
import {
  Save, ArrowLeft, Loader2, MapPin, ExternalLink,
  ImageIcon, Trash2, Upload, X, Tag
} from 'lucide-react'

const KATEGORI_OPTIONS = [
  { value: 'wisata_alam',    label: 'Wisata Alam' },
  { value: 'wisata_budaya',  label: 'Wisata Budaya' },
  { value: 'kampung_adat',   label: 'Kampung Adat' },
  { value: 'wisata_bahari',  label: 'Wisata Bahari' },
  { value: 'pulau_eksotis',  label: 'Pulau Eksotis' },
  { value: 'penginapan',     label: 'Penginapan / Hotel' },
  { value: 'kuliner',        label: 'Kuliner' },
  { value: 'religi',         label: 'Wisata Religi' },
]

export function kategoriLabel(value: string) {
  return KATEGORI_OPTIONS.find(k => k.value === value)?.label ?? value
}

type FormData = {
  nama_tempat_wisata: string
  alamat: string
  informasi1: string
  kategori: string
  id_kecamatan: number | null
  galeri_nama: string
  galeri_gambar: string
  galeri_keterangan: string
  lat: string
  lng: string
}

type Props = {
  kecamatan: { id_kecamatan: number; nama_kecamatan: string }[]
  defaultValues?: {
    id?: number
    nama_tempat_wisata?: string
    alamat?: string
    informasi1?: string
    kategori?: string
    id_kecamatan?: number | null
    galeri_nama?: string
    galeri_gambar?: string
    galeri_keterangan?: string
    lat?: number | null
    lng?: number | null
  }
  children?: React.ReactNode
}

export default function WisataForm({ kecamatan, defaultValues, children }: Props) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(
    defaultValues?.galeri_gambar ? defaultValues.galeri_gambar.startsWith("http") ? defaultValues.galeri_gambar : `/uploads/${defaultValues.galeri_gambar}` : null
  )

  const [form, setForm] = useState<FormData>({
    nama_tempat_wisata: defaultValues?.nama_tempat_wisata ?? '',
    alamat:             defaultValues?.alamat ?? '',
    informasi1:         defaultValues?.informasi1 ?? '',
    kategori:           defaultValues?.kategori ?? 'wisata_alam',
    id_kecamatan:       defaultValues?.id_kecamatan ?? null,
    galeri_nama:        defaultValues?.galeri_nama ?? '',
    galeri_gambar:      defaultValues?.galeri_gambar ?? '',
    galeri_keterangan:  defaultValues?.galeri_keterangan ?? '',
    lat:                defaultValues?.lat?.toString() ?? '',
    lng:                defaultValues?.lng?.toString() ?? '',
  })

  const set = (key: keyof FormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const val = e.target.value
      setForm(prev => ({
        ...prev,
        [key]: key === 'id_kecamatan' ? (val === '' ? null : Number(val)) : val,
      }))
    }

  // ── File picker handler ────────────────────────────────────────
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Show local preview immediately
    const localUrl = URL.createObjectURL(file)
    setPreview(localUrl)

    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)

      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      // Auto-fill filename and label
      setForm(prev => ({
        ...prev,
        galeri_gambar: data.filename,
        galeri_nama: prev.galeri_nama || file.name.replace(/\.[^.]+$/, ''),
      }))
      toast.success('Foto berhasil diunggah!')
    } catch (err: any) {
      toast.error(err.message)
      setPreview(null)
    } finally {
      setUploading(false)
      // Reset so the same file can be picked again if needed
      e.target.value = ''
    }
  }

  const clearPhoto = () => {
    setPreview(null)
    setForm(prev => ({ ...prev, galeri_gambar: '', galeri_nama: '', galeri_keterangan: '' }))
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const clearLokasi = () => setForm(prev => ({ ...prev, lat: '', lng: '' }))

  // ── Submit ─────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const isEdit = !!defaultValues?.id
      const payload = {
        nama_tempat_wisata: form.nama_tempat_wisata,
        alamat:             form.alamat,
        informasi1:         form.informasi1,
        kategori:           form.kategori,
        id_kecamatan:       form.id_kecamatan,
        galeri_nama:        form.galeri_nama  || null,
        galeri_gambar:      form.galeri_gambar || null,
        galeri_keterangan:  form.galeri_keterangan || null,
        lat: form.lat !== '' ? parseFloat(form.lat) : null,
        lng: form.lng !== '' ? parseFloat(form.lng) : null,
      }

      const res = await fetch(
        isEdit ? `/api/wisata/${defaultValues!.id}` : '/api/wisata',
        { method: isEdit ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }
      )
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Gagal menyimpan')

      toast.success(isEdit ? 'Wisata berhasil diperbarui!' : 'Wisata berhasil ditambahkan!')
      router.push('/admin/wisata')
      router.refresh()
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  const mapsUrl = form.lat && form.lng
    ? `https://www.google.com/maps?q=${form.lat},${form.lng}`
    : null

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-2xl">

      {/* ── INFORMASI DASAR ──────────────────────────────────── */}
      <div className="bg-white rounded-2xl shadow-sm border border-ngada-100 p-6 space-y-5">
        <h2 className="font-display text-base text-forest-800 border-b border-ngada-100 pb-3">
          Informasi Dasar
        </h2>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-forest-700">Nama Tempat Wisata *</label>
          <input type="text" value={form.nama_tempat_wisata} onChange={set('nama_tempat_wisata')}
            required className="input-field" placeholder="cth. Kampung Adat Bena" />
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-forest-700">Alamat *</label>
          <textarea value={form.alamat} onChange={set('alamat')} required rows={2}
            className="input-field resize-none" placeholder="cth. Desa Bena, Kecamatan Golewa, Kabupaten Ngada" />
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-forest-700">Deskripsi *</label>
          <textarea value={form.informasi1} onChange={set('informasi1')} required rows={5}
            className="input-field resize-none" placeholder="Deskripsi lengkap tentang tempat wisata ini..." />
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-forest-700">Kecamatan</label>
          <select value={form.id_kecamatan ?? ''} onChange={set('id_kecamatan')} className="input-field">
            <option value="">— Pilih Kecamatan —</option>
            {kecamatan.map(k => (
              <option key={k.id_kecamatan} value={k.id_kecamatan}>{k.nama_kecamatan}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-forest-700 flex items-center gap-1.5">
            <Tag size={13} className="text-ngada-500" /> Kategori / Tipe Tempat
          </label>
          <select value={form.kategori} onChange={set('kategori')} className="input-field">
            {KATEGORI_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ── FOTO UTAMA ───────────────────────────────────────── */}
      <div className="bg-white rounded-2xl shadow-sm border border-ngada-100 p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-ngada-100 pb-3">
          <h2 className="font-display text-base text-forest-800 flex items-center gap-2">
            <ImageIcon size={15} className="text-ngada-500" /> Foto Utama
          </h2>
          {preview && (
            <button type="button" onClick={clearPhoto}
              className="text-xs text-terra-500 hover:text-terra-700 flex items-center gap-1">
              <Trash2 size={12} /> Hapus foto
            </button>
          )}
        </div>

        {/* Drop zone / preview */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className={`relative cursor-pointer rounded-xl border-2 border-dashed transition-colors overflow-hidden
            ${preview ? 'border-ngada-200' : 'border-ngada-200 hover:border-ngada-400 bg-ngada-50/50 hover:bg-ngada-50'}`}
        >
          {preview ? (
            <div className="relative h-52 w-full">
              <Image src={preview} alt="Preview" fill className="object-cover" unoptimized />
              {/* overlay on hover */}
              <div className="absolute inset-0 bg-black/0 hover:bg-black/30 transition-colors flex items-center justify-center">
                <span className="opacity-0 hover:opacity-100 text-white text-sm font-medium flex items-center gap-2 transition-opacity">
                  <Upload size={15} /> Ganti foto
                </span>
              </div>
              {uploading && (
                <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                  <Loader2 size={24} className="animate-spin text-ngada-500" />
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 gap-3 text-forest-400">
              {uploading
                ? <Loader2 size={28} className="animate-spin text-ngada-500" />
                : <Upload size={28} className="text-ngada-400" />
              }
              <div className="text-center">
                <p className="text-sm font-medium text-forest-600">
                  {uploading ? 'Mengunggah...' : 'Klik untuk pilih foto'}
                </p>
                <p className="text-xs text-forest-400 mt-1">JPG, PNG, WebP — maks 5MB</p>
              </div>
            </div>
          )}
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          className="hidden"
          onChange={handleFileChange}
        />

        {/* Filename badge */}
        {form.galeri_gambar && (
          <div className="flex items-center gap-2 text-xs text-forest-500 bg-ngada-50 rounded-lg px-3 py-2">
            <ImageIcon size={12} className="text-ngada-400 flex-shrink-0" />
            <span className="font-mono truncate">{form.galeri_gambar}</span>
            <button type="button" onClick={clearPhoto} className="ml-auto text-forest-400 hover:text-terra-500 flex-shrink-0">
              <X size={13} />
            </button>
          </div>
        )}

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-forest-700">Keterangan Foto</label>
          <input type="text" value={form.galeri_keterangan} onChange={set('galeri_keterangan')}
            className="input-field" placeholder="cth. Pemandangan megalitik dari atas bukit" />
        </div>
      </div>

      {/* ── KOORDINAT GPS ────────────────────────────────────── */}
      <div className="bg-white rounded-2xl shadow-sm border border-ngada-100 p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-ngada-100 pb-3">
          <h2 className="font-display text-base text-forest-800 flex items-center gap-2">
            <MapPin size={15} className="text-ngada-500" /> Koordinat GPS
          </h2>
          <div className="flex items-center gap-3">
            {mapsUrl && (
              <a href={mapsUrl} target="_blank" rel="noopener noreferrer"
                className="text-xs text-ngada-500 hover:text-ngada-700 flex items-center gap-1 font-medium">
                Lihat di Maps <ExternalLink size={11} />
              </a>
            )}
            {(form.lat || form.lng) && (
              <button type="button" onClick={clearLokasi}
                className="text-xs text-terra-500 hover:text-terra-700 flex items-center gap-1">
                <Trash2 size={12} /> Hapus
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-forest-700">Latitude</label>
            <input type="number" step="any" value={form.lat} onChange={set('lat')}
              placeholder="-8.5590" className="input-field font-mono" />
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-forest-700">Longitude</label>
            <input type="number" step="any" value={form.lng} onChange={set('lng')}
              placeholder="121.0890" className="input-field font-mono" />
          </div>
        </div>

        <p className="text-xs text-forest-400">
          💡 Klik kanan di{' '}
          <a href="https://maps.google.com" target="_blank" rel="noopener" className="text-ngada-500 hover:underline">
            Google Maps
          </a>{' '}
          → "What's here?" untuk mendapatkan koordinat
        </p>
      </div>

      {/* ── GALLERY (injected from parent) ──────────────────── */}
      {children}

      {/* ── ACTIONS ──────────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <button type="submit" disabled={loading || uploading}
          className="btn-primary flex items-center gap-2 disabled:opacity-60">
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {loading ? 'Menyimpan...' : 'Simpan'}
        </button>
        <Link href="/admin/wisata" className="btn-outline flex items-center gap-2">
          <ArrowLeft size={16} /> Batal
        </Link>
      </div>
    </form>
  )
}
