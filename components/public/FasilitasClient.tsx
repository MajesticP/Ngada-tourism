'use client'

import { motion } from 'framer-motion'
import { Car, Camera, Building2, Phone, CheckCircle2, XCircle, AlertCircle, MapPin } from 'lucide-react'
import Navbar from './Navbar'
import Footer from './Footer'

type WisataFasilitas = {
  id_tempat_wisata: number
  nama_tempat_wisata: string
  alamat: string
  kategori: string
  akses_jalan: string | null
  parkir: string | null
  toilet: string | null
  jarak_atm: string | null
  jarak_rs: string | null
  spot_foto: string | null
  galeri: { gambar: string | null } | null
}

const AKSES_COLOR: Record<string, string> = {
  'Sangat Baik': 'text-forest-600 bg-forest-50',
  'Baik':        'text-forest-600 bg-forest-50',
  'Baik + Laut': 'text-forest-600 bg-forest-50',
  'Cukup':       'text-ngada-600 bg-ngada-50',
  'Trekking':    'text-ngada-700 bg-ngada-50',
  'Sulit':       'text-terra-600 bg-terra-50',
}

function AksesJalanBadge({ value }: { value: string | null }) {
  if (!value) return <span className="text-forest-300 text-sm">—</span>
  const cls = AKSES_COLOR[value] ?? 'text-forest-600 bg-forest-50'
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${cls}`}>
      {value}
    </span>
  )
}

function BoolBadge({ value }: { value: string | null }) {
  if (!value) return <span className="text-forest-300 text-sm">—</span>
  const isAda = value.toLowerCase().includes('ada') || value.toLowerCase().includes('luas') || value.toLowerCase().includes('terbatas')
  const isTidak = value.toLowerCase().includes('tidak')
  const isTerbatas = value.toLowerCase().includes('terbatas')

  if (isTerbatas) return (
    <span className="inline-flex items-center gap-1 text-ngada-600 text-sm font-medium">
      <AlertCircle size={14} /> {value}
    </span>
  )
  if (isTidak) return (
    <span className="inline-flex items-center gap-1 text-terra-500 text-sm font-medium">
      <XCircle size={14} /> {value}
    </span>
  )
  if (isAda) return (
    <span className="inline-flex items-center gap-1 text-forest-600 text-sm font-medium">
      <CheckCircle2 size={14} /> {value}
    </span>
  )
  return <span className="text-forest-700 text-sm">{value}</span>
}

export default function FasilitasClient({ wisata }: { wisata: WisataFasilitas[] }) {
  const withFasilitas = wisata.filter(w =>
    w.akses_jalan || w.parkir || w.toilet || w.jarak_atm || w.jarak_rs
  )
  const withoutFasilitas = wisata.filter(w =>
    !w.akses_jalan && !w.parkir && !w.toilet && !w.jarak_atm && !w.jarak_rs
  )

  return (
    <div className="min-h-screen bg-ngada-50">
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative bg-forest-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #dc911f 0%, transparent 60%), radial-gradient(circle at 80% 20%, #285635 0%, transparent 50%)' }}
        />
        <div className="relative max-w-4xl mx-auto px-6 py-28 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 bg-ngada-500/20 border border-ngada-500/30 text-ngada-300 text-xs font-semibold px-4 py-1.5 rounded-full mb-6 uppercase tracking-widest">
              <Building2 size={12} /> Informasi Fasilitas
            </span>
            <h1 className="font-display text-4xl md:text-6xl font-bold mb-4 leading-tight">
              Data Fasilitas<br />
              <span className="text-ngada-400 italic">Tempat Wisata</span>
            </h1>
            <p className="text-white/60 text-lg max-w-xl mx-auto leading-relaxed">
              Informasi lengkap akses jalan, parkir, toilet, ATM, dan layanan darurat di setiap destinasi wisata Kabupaten Ngada.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Feature badges ── */}
      <section className="bg-white border-b border-ngada-100">
        <div className="max-w-5xl mx-auto px-6 py-6">
          <div className="grid grid-cols-3 gap-4">
            {[
              { icon: Car,       label: 'Akses Jalan',    desc: 'Mudah hingga Trekking' },
              { icon: Camera,    label: 'Spot Foto',       desc: 'Alami & Menarik' },
              { icon: Building2, label: 'Akses Fasilitas', desc: 'ATM & Puskesmas Terdekat' },
            ].map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex items-center gap-3 p-4 rounded-2xl bg-ngada-50 border border-ngada-100">
                <div className="w-10 h-10 rounded-xl bg-forest-800 flex items-center justify-center flex-shrink-0">
                  <Icon size={18} className="text-ngada-400" />
                </div>
                <div>
                  <p className="font-semibold text-forest-900 text-sm">{label}</p>
                  <p className="text-forest-400 text-xs">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Main table ── */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="font-display text-3xl text-forest-900 font-bold">Data Fasilitas Tempat Wisata</h2>
            <p className="text-forest-400 mt-1 text-sm">{withFasilitas.length} destinasi dengan data fasilitas lengkap</p>
          </div>
        </div>

        {/* Desktop table */}
        <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-ngada-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-forest-800 text-white text-left">
                <th className="px-5 py-4 font-semibold">Nama Tempat</th>
                <th className="px-5 py-4 font-semibold">Akses Jalan</th>
                <th className="px-5 py-4 font-semibold">Parkir</th>
                <th className="px-5 py-4 font-semibold">Toilet</th>
                <th className="px-5 py-4 font-semibold">Jarak ATM</th>
                <th className="px-5 py-4 font-semibold">Jarak ke RS / Puskesmas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ngada-50">
              {withFasilitas.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-forest-400">
                    Belum ada data fasilitas. Tambahkan melalui panel admin.
                  </td>
                </tr>
              ) : (
                withFasilitas.map((w, i) => (
                  <motion.tr
                    key={w.id_tempat_wisata}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="hover:bg-ngada-50/60 transition-colors"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {w.galeri?.gambar ? (
                          <img
                            src={w.galeri.gambar.startsWith('http') ? w.galeri.gambar : `/uploads/${w.galeri.gambar}`}
                            alt={w.nama_tempat_wisata}
                            className="w-9 h-9 rounded-lg object-cover flex-shrink-0"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-lg bg-forest-100 flex items-center justify-center flex-shrink-0">
                            <MapPin size={14} className="text-forest-400" />
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-forest-900">{w.nama_tempat_wisata}</p>
                          <p className="text-forest-400 text-xs line-clamp-1">{w.alamat}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4"><AksesJalanBadge value={w.akses_jalan} /></td>
                    <td className="px-5 py-4"><BoolBadge value={w.parkir} /></td>
                    <td className="px-5 py-4"><BoolBadge value={w.toilet} /></td>
                    <td className="px-5 py-4">
                      <span className="text-forest-700 text-sm">{w.jarak_atm ?? '—'}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-forest-700 text-sm">{w.jarak_rs ?? '—'}</span>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden space-y-4">
          {withFasilitas.length === 0 ? (
            <div className="text-center py-12 text-forest-400 bg-white rounded-2xl border border-ngada-100">
              Belum ada data fasilitas.
            </div>
          ) : (
            withFasilitas.map((w, i) => (
              <motion.div
                key={w.id_tempat_wisata}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-2xl border border-ngada-100 overflow-hidden shadow-sm"
              >
                <div className="flex items-center gap-3 p-4 border-b border-ngada-50">
                  {w.galeri?.gambar ? (
                    <img
                      src={w.galeri.gambar.startsWith('http') ? w.galeri.gambar : `/uploads/${w.galeri.gambar}`}
                      alt={w.nama_tempat_wisata}
                      className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-forest-100 flex items-center justify-center flex-shrink-0">
                      <MapPin size={18} className="text-forest-400" />
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-forest-900">{w.nama_tempat_wisata}</p>
                    <p className="text-forest-400 text-xs line-clamp-1">{w.alamat}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-px bg-ngada-100">
                  {[
                    { label: 'Akses Jalan', node: <AksesJalanBadge value={w.akses_jalan} /> },
                    { label: 'Parkir',      node: <BoolBadge value={w.parkir} /> },
                    { label: 'Toilet',      node: <BoolBadge value={w.toilet} /> },
                    { label: 'ATM',         node: <span className="text-forest-700 text-sm">{w.jarak_atm ?? '—'}</span> },
                  ].map(({ label, node }) => (
                    <div key={label} className="bg-white p-3">
                      <p className="text-forest-400 text-xs mb-1">{label}</p>
                      {node}
                    </div>
                  ))}
                </div>
                {w.jarak_rs && (
                  <div className="bg-forest-50 px-4 py-3 flex items-center gap-2">
                    <Phone size={13} className="text-forest-500 flex-shrink-0" />
                    <p className="text-forest-600 text-xs"><span className="font-medium">RS/Puskesmas:</span> {w.jarak_rs}</p>
                  </div>
                )}
              </motion.div>
            ))
          )}
        </div>

        {/* Spots without facility data */}
        {withoutFasilitas.length > 0 && (
          <div className="mt-6 p-4 rounded-2xl border border-dashed border-ngada-200 bg-white/60">
            <p className="text-xs font-semibold text-forest-400 uppercase tracking-wider mb-3">
              Belum ada data fasilitas ({withoutFasilitas.length} destinasi)
            </p>
            <div className="flex flex-wrap gap-2">
              {withoutFasilitas.map(w => (
                <span key={w.id_tempat_wisata} className="text-xs px-3 py-1.5 bg-white border border-ngada-100 rounded-full text-forest-500">
                  {w.nama_tempat_wisata}
                </span>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ── Info cards ── */}
      <section className="max-w-7xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-forest-800 rounded-2xl p-6 flex items-center justify-between">
            <div>
              <h3 className="font-display text-xl text-white font-bold mb-1">Info & Panduan Wisata</h3>
              <p className="text-white/60 text-sm mb-4">Tips & panduan berwisata di Ngada</p>
              <a href="/wisata" className="inline-flex items-center gap-2 bg-forest-600 hover:bg-forest-500 text-white text-sm font-medium px-4 py-2 rounded-full transition-colors">
                Lihat Destinasi
              </a>
            </div>
            <div className="w-16 h-16 rounded-2xl bg-forest-700 flex items-center justify-center flex-shrink-0">
              <MapPin size={28} className="text-ngada-400" />
            </div>
          </div>

          <div className="bg-ngada-500 rounded-2xl p-6 flex items-center justify-between">
            <div>
              <h3 className="font-display text-xl text-white font-bold mb-1">Layanan Darurat</h3>
              <p className="text-white/80 text-sm mb-4">Kontak RS & Puskesmas Terdekat</p>
              <a href="/contact" className="inline-flex items-center gap-2 bg-white text-ngada-600 hover:bg-ngada-50 text-sm font-medium px-4 py-2 rounded-full transition-colors">
                Hubungi Sekarang
              </a>
            </div>
            <div className="w-16 h-16 rounded-2xl bg-ngada-400/50 flex items-center justify-center flex-shrink-0">
              <Phone size={28} className="text-white" />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
