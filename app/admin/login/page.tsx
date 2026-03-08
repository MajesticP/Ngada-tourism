'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Eye, EyeOff, LogIn, MapPin } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdminLoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast.success('Selamat datang!')
      router.push('/admin/dashboard')
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex w-1/2 relative bg-forest-900 overflow-hidden flex-col justify-between p-12">
        <div className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=1600&q=80)' }} />
        <div className="absolute inset-0 bg-gradient-to-br from-forest-950/80 via-forest-900/60 to-ngada-900/70" />
        <motion.div className="relative z-10" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <div className="flex items-center gap-3 text-white">
            <div className="w-10 h-10 rounded-full bg-ngada-500 flex items-center justify-center">
              <MapPin size={18} />
            </div>
            <div>
              <div className="font-display text-xl font-semibold">Wisata Ngada</div>
              <div className="text-ngada-300 text-xs">Admin Panel</div>
            </div>
          </div>
        </motion.div>
        <motion.div className="relative z-10 text-white"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h2 className="font-display text-4xl leading-tight mb-4">
            Kelola Pariwisata<br />
            <span className="text-ngada-300 italic">Ngada</span>
          </h2>
          <p className="text-white/60 text-sm leading-relaxed max-w-sm">
            Panel administrasi untuk mengelola data tempat wisata, galeri foto, kecamatan, dan lokasi GPS.
          </p>
        </motion.div>
      </div>

      <div className="flex-1 flex items-center justify-center px-8 py-12 bg-ngada-50">
        <motion.div className="w-full max-w-md"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-3xl text-forest-900 mb-2">Masuk</h1>
          <p className="text-forest-500 text-sm mb-8">Masukkan kredensial admin Anda</p>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-forest-700 mb-1.5">Username</label>
              <input type="text" value={username} onChange={e => setUsername(e.target.value)}
                placeholder="Masukkan username" required className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-forest-700 mb-1.5">Password</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Masukkan password" required className="input-field pr-11" />
                <button type="button" onClick={() => setShowPass(v => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-forest-400">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <motion.button type="submit" disabled={loading} whileTap={{ scale: 0.98 }}
              className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-60 py-3.5">
              {loading
                ? <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                : <><LogIn size={16} />Masuk</>
              }
            </motion.button>
          </form>
          <p className="mt-6 text-center text-xs text-forest-400">Default: admin / admin123</p>
        </motion.div>
      </div>
    </div>
  )
}