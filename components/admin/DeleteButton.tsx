'use client'

import { useState } from 'react'
import { Trash2, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

type Props = {
  id: number
  name: string
  endpoint: string
}

export default function DeleteButton({ id, name, endpoint }: Props) {
  const [confirm, setConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${endpoint}/${id}`, { method: 'DELETE' })
      if (res.ok) {
        toast.success(`"${name}" berhasil dihapus`)
        router.refresh()
      } else {
        const data = await res.json()
        toast.error(data.error || 'Gagal menghapus')
      }
    } catch {
      toast.error('Terjadi kesalahan')
    } finally {
      setLoading(false)
      setConfirm(false)
    }
  }

  if (confirm) {
    return (
      <div className="flex items-center gap-1 bg-terra-50 border border-terra-200 rounded-lg px-2 py-1">
        <span className="text-xs text-terra-700">Yakin?</span>
        <button
          onClick={handleDelete}
          disabled={loading}
          className="text-xs font-bold text-terra-700 hover:text-terra-900 px-1"
        >
          {loading ? <Loader2 size={12} className="animate-spin" /> : 'Ya'}
        </button>
        <button onClick={() => setConfirm(false)} className="text-xs text-forest-500">
          Batal
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => setConfirm(true)}
      className="p-2 rounded-lg bg-terra-50 text-terra-600 hover:bg-terra-100 transition-colors"
      title="Hapus"
    >
      <Trash2 size={15} />
    </button>
  )
}
