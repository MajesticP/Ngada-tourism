'use client'

// ✅ FIX: This page was missing — caused 404 when clicking "Ganti Password"
import { use, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { Save, ArrowLeft, Loader2, Eye, EyeOff } from 'lucide-react'

export default function EditAdminPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({ password: '', confirm: '' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.password !== formData.confirm) {
      toast.error('Konfirmasi password tidak cocok')
      return
    }
    if (formData.password.length < 6) {
      toast.error('Password minimal 6 karakter')
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`/api/auth/admin/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: formData.password }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Gagal mengganti password')

      toast.success('Password berhasil diperbarui!')
      router.push('/admin/admins')
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-forest-900">Ganti Password Admin</h1>
        <p className="text-forest-500 text-sm mt-1">Perbarui password untuk admin ini</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-sm border border-ngada-100 p-8 space-y-6 max-w-md"
      >
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-forest-700">Password Baru *</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={e => setFormData(f => ({ ...f, password: e.target.value }))}
              required
              minLength={6}
              className="input-field pr-10"
              placeholder="Minimal 6 karakter"
            />
            <button
              type="button"
              onClick={() => setShowPassword(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-forest-400 hover:text-forest-600"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-forest-700">Konfirmasi Password *</label>
          <input
            type={showPassword ? 'text' : 'password'}
            value={formData.confirm}
            onChange={e => setFormData(f => ({ ...f, confirm: e.target.value }))}
            required
            className="input-field"
            placeholder="Ulangi password baru"
          />
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary flex items-center gap-2 disabled:opacity-60"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {loading ? 'Menyimpan...' : 'Simpan'}
          </button>
          <Link href="/admin/admins" className="btn-outline flex items-center gap-2">
            <ArrowLeft size={16} /> Batal
          </Link>
        </div>
      </form>
    </div>
  )
}
