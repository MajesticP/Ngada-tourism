'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { Save, ArrowLeft, Loader2 } from 'lucide-react'
import InfoDasarSection from './wisata-form/InfoDasarSection'
import FotoSection from './wisata-form/FotoSection'
import LokasiSection from './wisata-form/LokasiSection'
import FasilitasSection from './wisata-form/FasilitasSection'

export function kategoriLabel(value: string) {
  const map: Record<string, string> = {
    wisata_alam: 'Wisata Alam', wisata_budaya: 'Wisata Budaya', kampung_adat: 'Kampung Adat',
    wisata_bahari: 'Wisata Bahari', pulau_eksotis: 'Pulau Eksotis', penginapan: 'Penginapan / Hotel',
    kuliner: 'Kuliner', religi: 'Wisata Religi',
  }
  return map[value] ?? value
}

type FormData = {
  nama_tempat_wisata: string; alamat: string; informasi1: string; kategori: string
  id_kabupaten: number | null; galeri_nama: string; galeri_gambar: string; galeri_keterangan: string
  lat: string; lng: string; akses_jalan: string; parkir: string; toilet: string
  jarak_atm: string; jarak_rs: string; spot_foto: string
}

type Props = {
  kabupaten: { id_kabupaten: number; nama_kabupaten: string }[]
  defaultValues?: {
    id?: number; nama_tempat_wisata?: string; alamat?: string; informasi1?: string; kategori?: string
    id_kabupaten?: number | null; galeri_nama?: string; galeri_gambar?: string; galeri_keterangan?: string
    lat?: number | null; lng?: number | null; akses_jalan?: string | null; parkir?: string | null
    toilet?: string | null; jarak_atm?: string | null; jarak_rs?: string | null; spot_foto?: string | null
  }
  children?: React.ReactNode
}

export default function WisataForm({ kabupaten, defaultValues, children }: Props) {
  const router = useRouter()
  const [loading, setLoading]   = useState(false)
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview]   = useState<string | null>(
    defaultValues?.galeri_gambar
      ? defaultValues.galeri_gambar.startsWith('http') ? defaultValues.galeri_gambar : `/uploads/${defaultValues.galeri_gambar}`
      : null
  )

  const [form, setForm] = useState<FormData>({
    nama_tempat_wisata: defaultValues?.nama_tempat_wisata ?? '',
    alamat:             defaultValues?.alamat ?? '',
    informasi1:         defaultValues?.informasi1 ?? '',
    kategori:           defaultValues?.kategori ?? 'wisata_alam',
    id_kabupaten:       defaultValues?.id_kabupaten ?? null,
    galeri_nama:        defaultValues?.galeri_nama ?? '',
    galeri_gambar:      defaultValues?.galeri_gambar ?? '',
    galeri_keterangan:  defaultValues?.galeri_keterangan ?? '',
    lat:                defaultValues?.lat?.toString() ?? '',
    lng:                defaultValues?.lng?.toString() ?? '',
    akses_jalan:        defaultValues?.akses_jalan ?? '',
    parkir:             defaultValues?.parkir ?? '',
    toilet:             defaultValues?.toilet ?? '',
    jarak_atm:          defaultValues?.jarak_atm ?? '',
    jarak_rs:           defaultValues?.jarak_rs ?? '',
    spot_foto:          defaultValues?.spot_foto ?? '',
  })

  const setField = (key: string, value: string | number | null) =>
    setForm(prev => ({ ...prev, [key]: value }))

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setPreview(URL.createObjectURL(file))
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
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
      e.target.value = ''
    }
  }

  const clearPhoto = () => {
    setPreview(null)
    setForm(prev => ({ ...prev, galeri_gambar: '', galeri_nama: '', galeri_keterangan: '' }))
  }

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
        id_kabupaten:       form.id_kabupaten,
        galeri_nama:        form.galeri_nama  || null,
        galeri_gambar:      form.galeri_gambar || null,
        galeri_keterangan:  form.galeri_keterangan || null,
        lat: form.lat !== '' ? parseFloat(form.lat) : null,
        lng: form.lng !== '' ? parseFloat(form.lng) : null,
        akses_jalan: form.akses_jalan || null, parkir:    form.parkir    || null,
        toilet:      form.toilet      || null, jarak_atm: form.jarak_atm || null,
        jarak_rs:    form.jarak_rs    || null, spot_foto: form.spot_foto  || null,
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

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-2xl">
      <InfoDasarSection
        nama_tempat_wisata={form.nama_tempat_wisata}
        alamat={form.alamat}
        informasi1={form.informasi1}
        kategori={form.kategori}
        id_kabupaten={form.id_kabupaten}
        kabupaten={kabupaten}
        onChange={setField}
      />

      <FotoSection
        preview={preview}
        uploading={uploading}
        galeri_gambar={form.galeri_gambar}
        galeri_keterangan={form.galeri_keterangan}
        onFileChange={handleFileChange}
        onClear={clearPhoto}
        onKeteranganChange={val => setField('galeri_keterangan', val)}
      />

      <LokasiSection
        lat={form.lat}
        lng={form.lng}
        onChange={(key, val) => setField(key, val)}
        onClear={() => setForm(prev => ({ ...prev, lat: '', lng: '' }))}
      />

      <FasilitasSection
        akses_jalan={form.akses_jalan}
        parkir={form.parkir}
        toilet={form.toilet}
        jarak_atm={form.jarak_atm}
        jarak_rs={form.jarak_rs}
        spot_foto={form.spot_foto}
        onChange={(key, val) => setField(key, val)}
      />

      {children}

      <div className="flex items-center gap-3">
        <button type="submit" disabled={loading || uploading} className="btn-primary flex items-center gap-2 disabled:opacity-60">
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
