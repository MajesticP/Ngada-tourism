'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import toast from 'react-hot-toast'
import { Upload, Trash2, Loader2, GripVertical } from 'lucide-react'

type Photo = { id_foto?: number; url: string; uploading?: boolean }

type Props = {
  wisataId: number
  initialPhotos?: { id_foto: number; url: string; urutan: number }[]
}

export default function PhotoUploader({ wisataId, initialPhotos = [] }: Props) {
  const [photos, setPhotos] = useState<Photo[]>(
    initialPhotos.sort((a, b) => a.urutan - b.urutan).map(p => ({ id_foto: p.id_foto, url: p.url }))
  )
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFiles = async (files: FileList) => {
    const remaining = 5 - photos.filter(p => !p.uploading).length
    if (remaining <= 0) {
      toast.error('Maksimal 5 foto')
      return
    }

    const toUpload = Array.from(files).slice(0, remaining)

    for (const file of toUpload) {
      const tempId = `temp-${Date.now()}-${Math.random()}`
      const localUrl = URL.createObjectURL(file)

      setPhotos(prev => [...prev, { url: localUrl, uploading: true }])

      try {
        const fd = new FormData()
        fd.append('file', file)
        const res = await fetch('/api/upload', { method: 'POST', body: fd })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error)

        // Save to DB
        const saveRes = await fetch('/api/foto', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id_tempat_wisata: wisataId,
            url: data.filename,
            urutan: photos.length,
          }),
        })
        const saved = await saveRes.json()

        setPhotos(prev =>
          prev.map(p =>
            p.url === localUrl ? { id_foto: saved.id_foto, url: data.filename } : p
          )
        )
        toast.success('Foto berhasil diunggah!')
      } catch (err: any) {
        toast.error(err.message)
        setPhotos(prev => prev.filter(p => p.url !== localUrl))
      }
    }
  }

  const handleDelete = async (photo: Photo) => {
    if (photo.id_foto) {
      await fetch(`/api/foto/${photo.id_foto}`, { method: 'DELETE' })
    }
    setPhotos(prev => prev.filter(p => p.url !== photo.url))
    toast.success('Foto dihapus')
  }

  const count = photos.filter(p => !p.uploading).length

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-forest-500">{count}/5 foto diunggah</p>
        {count < 5 && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-sm text-ngada-600 hover:text-ngada-800 flex items-center gap-1.5 font-medium"
          >
            <Upload size={14} /> Tambah Foto
          </button>
        )}
      </div>

      {/* Photo grid */}
      {photos.length > 0 ? (
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
          {photos.map((photo, i) => (
            <div key={photo.url} className="relative group aspect-square rounded-xl overflow-hidden bg-ngada-100">
              <Image src={photo.url} alt={`Foto ${i + 1}`} fill className="object-cover" unoptimized />
              {photo.uploading ? (
                <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                  <Loader2 size={20} className="animate-spin text-ngada-500" />
                </div>
              ) : (
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => handleDelete(photo)}
                    className="opacity-0 group-hover:opacity-100 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              )}
              {i === 0 && (
                <span className="absolute top-1 left-1 bg-ngada-500 text-white text-xs px-1.5 py-0.5 rounded-md">
                  Utama
                </span>
              )}
            </div>
          ))}

          {/* Add more slot */}
          {count < 5 && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="aspect-square rounded-xl border-2 border-dashed border-ngada-200 hover:border-ngada-400 bg-ngada-50 hover:bg-ngada-100 flex flex-col items-center justify-center gap-1 text-forest-400 transition-colors"
            >
              <Upload size={18} />
              <span className="text-xs">Tambah</span>
            </button>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="w-full rounded-xl border-2 border-dashed border-ngada-200 hover:border-ngada-400 bg-ngada-50 hover:bg-ngada-100 py-10 flex flex-col items-center gap-2 text-forest-400 transition-colors"
        >
          <Upload size={28} className="text-ngada-400" />
          <p className="text-sm font-medium text-forest-600">Klik untuk unggah foto</p>
          <p className="text-xs">JPG, PNG, WebP — maks 5MB, hingga 5 foto</p>
        </button>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        multiple
        className="hidden"
        onChange={e => e.target.files && handleFiles(e.target.files)}
      />
    </div>
  )
}
