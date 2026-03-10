'use client'

import { useState } from 'react'
import { Plus, Edit2, Trash2, Save, X, Loader2, Map } from 'lucide-react'
import toast from 'react-hot-toast'

type Item = { id: number; nama: string; countWisata: number }

export default function KabupatenManager({ initialData }: { initialData: Item[] }) {
  const [data, setData] = useState<Item[]>(initialData)
  const [newNama, setNewNama] = useState('')
  const [addLoading, setAddLoading] = useState(false)
  const [editId, setEditId] = useState<number | null>(null)
  const [editNama, setEditNama] = useState('')

  const handleAdd = async () => {
    if (!newNama.trim()) return
    setAddLoading(true)
    try {
      const res = await fetch('/api/kabupaten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nama_kabupaten: newNama.trim() }),
      })
      const created = await res.json()
      if (!res.ok) throw new Error(created.error)
      setData(prev => [...prev, { id: created.id_kabupaten, nama: created.nama_kabupaten, countWisata: 0 }])
      setNewNama('')
      toast.success('Kabupaten ditambahkan!')
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setAddLoading(false)
    }
  }

  const handleEdit = async (id: number) => {
    if (!editNama.trim()) return
    try {
      const res = await fetch(`/api/kabupaten/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nama_kabupaten: editNama.trim() }),
      })
      if (!res.ok) throw new Error('Gagal memperbarui')
      setData(prev => prev.map(k => k.id === id ? { ...k, nama: editNama.trim() } : k))
      setEditId(null)
      toast.success('Kabupaten diperbarui!')
    } catch (e: any) {
      toast.error(e.message)
    }
  }

  const handleDelete = async (id: number, nama: string) => {
    try {
      const res = await fetch(`/api/kabupaten/${id}`, { method: 'DELETE' })
      const body = await res.json()
      if (!res.ok) throw new Error(body.error)
      setData(prev => prev.filter(k => k.id !== id))
      toast.success(`"${nama}" dihapus`)
    } catch (e: any) {
      toast.error(e.message)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Add form */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-2xl shadow-sm border border-ngada-100 p-6">
          <h2 className="font-display text-lg text-forest-900 mb-4 flex items-center gap-2">
            <Plus size={16} className="text-ngada-500" /> Tambah Kabupaten
          </h2>
          <div className="space-y-3">
            <input
              type="text"
              value={newNama}
              onChange={e => setNewNama(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAdd()}
              placeholder="Nama kabupaten..."
              className="input-field"
            />
            <button
              onClick={handleAdd}
              disabled={!newNama.trim() || addLoading}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {addLoading ? <Loader2 size={15} className="animate-spin" /> : <Plus size={15} />}
              Tambah
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-2xl shadow-sm border border-ngada-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-forest-800 text-white text-left">
                <th className="px-5 py-3.5 font-medium w-8">No</th>
                <th className="px-5 py-3.5 font-medium">Nama Kabupaten</th>
                <th className="px-5 py-3.5 font-medium text-center">Wisata</th>
                <th className="px-5 py-3.5 font-medium text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ngada-50">
              {data.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-5 py-10 text-center text-forest-400">Belum ada data</td>
                </tr>
              ) : (
                data.map((k, i) => (
                  <tr key={k.id} className="hover:bg-ngada-50/50">
                    <td className="px-5 py-3.5 text-forest-400">{i + 1}</td>
                    <td className="px-5 py-3.5">
                      {editId === k.id ? (
                        <input
                          type="text"
                          value={editNama}
                          onChange={e => setEditNama(e.target.value)}
                          onKeyDown={e => { if (e.key === 'Enter') handleEdit(k.id); if (e.key === 'Escape') setEditId(null) }}
                          className="input-field py-1.5 text-sm"
                          autoFocus
                        />
                      ) : (
                        <span className="font-medium text-forest-900 flex items-center gap-2">
                          <Map size={13} className="text-ngada-400" />
                          {k.nama}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <span className="badge bg-forest-100 text-forest-700">{k.countWisata}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-center gap-1.5">
                        {editId === k.id ? (
                          <>
                            <button onClick={() => handleEdit(k.id)} className="p-1.5 rounded-lg bg-forest-100 text-forest-600 hover:bg-forest-200">
                              <Save size={14} />
                            </button>
                            <button onClick={() => setEditId(null)} className="p-1.5 rounded-lg bg-ngada-50 text-forest-400 hover:bg-ngada-100">
                              <X size={14} />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => { setEditId(k.id); setEditNama(k.nama) }}
                              className="p-1.5 rounded-lg bg-ngada-50 text-ngada-600 hover:bg-ngada-100"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              onClick={() => handleDelete(k.id, k.nama)}
                              disabled={k.countWisata > 0}
                              title={k.countWisata > 0 ? 'Hapus relasi wisata dulu' : 'Hapus'}
                              className="p-1.5 rounded-lg bg-terra-50 text-terra-600 hover:bg-terra-100 disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                              <Trash2 size={14} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
