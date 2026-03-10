export const dynamic = 'force-dynamic'

import { db } from '@/lib/db'
import Link from 'next/link'
import { Plus, Edit, MapPin } from 'lucide-react'
import DeleteButton from '@/components/admin/DeleteButton'
import { getSession } from '@/lib/auth'

const KATEGORI_OPTIONS = [
  { value: 'wisata_alam',   label: 'Wisata Alam',        color: 'bg-forest-100 text-forest-700' },
  { value: 'wisata_budaya', label: 'Wisata Budaya',      color: 'bg-ngada-100 text-ngada-700' },
  { value: 'wisata_bahari', label: 'Wisata Bahari',      color: 'bg-blue-100 text-blue-700' },
  { value: 'penginapan',    label: 'Penginapan / Hotel', color: 'bg-purple-100 text-purple-700' },
  { value: 'kuliner',       label: 'Kuliner',             color: 'bg-orange-100 text-orange-700' },
  { value: 'religi',        label: 'Wisata Religi',      color: 'bg-yellow-100 text-yellow-700' },
]

function getKategori(value: string) {
  return KATEGORI_OPTIONS.find(k => k.value === value) ?? { label: value, color: 'bg-gray-100 text-gray-600' }
}

async function getWisata(search?: string, kategori?: string) {
  await getSession()
  return db.tempatWisata.findMany({
    where: {
      ...(search ? { nama_tempat_wisata: { contains: search } } : {}),
      ...(kategori ? { kategori } : {}),
    },
    include: { kecamatan: true, lokasi: true, galeri: true },
    orderBy: { id_tempat_wisata: 'asc' },
  })
}

export default async function AdminWisataPage({ searchParams }: { searchParams: Promise<{ search?: string; kategori?: string }> }) {
  const { search, kategori } = await searchParams
  const wisata = await getWisata(search, kategori)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-forest-900">Tempat & Destinasi</h1>
          <p className="text-forest-500 text-sm mt-1">{wisata.length} entri terdaftar</p>
        </div>
        <Link href="/admin/wisata/new" className="btn-primary inline-flex items-center gap-2">
          <Plus size={16} /> Tambah Baru
        </Link>
      </div>

      {/* Search + filter */}
      <form className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[180px] max-w-xs">
          <input
            name="search"
            defaultValue={search}
            placeholder="Cari nama..."
            className="input-field pl-4"
          />
        </div>
        <select name="kategori" defaultValue={kategori ?? ''} className="input-field w-auto">
          <option value="">Semua Kategori</option>
          {KATEGORI_OPTIONS.map(k => (
            <option key={k.value} value={k.value}>{k.label}</option>
          ))}
        </select>
        <button type="submit" className="btn-primary">Filter</button>
        {(search || kategori) && (
          <Link href="/admin/wisata" className="btn-outline">Reset</Link>
        )}
      </form>

      {/* Kategori tabs summary */}
      <div className="flex flex-wrap gap-2">
        {KATEGORI_OPTIONS.map(k => (
          <Link
            key={k.value}
            href={`/admin/wisata?kategori=${k.value}`}
            className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
              kategori === k.value
                ? `${k.color} border-current`
                : 'border-ngada-100 text-forest-500 hover:border-ngada-300'
            }`}
          >
            {k.label}
          </Link>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-ngada-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-forest-800 text-white text-left">
              <th className="px-5 py-3.5 font-medium w-8">No</th>
              <th className="px-5 py-3.5 font-medium">Nama</th>
              <th className="px-5 py-3.5 font-medium">Kategori</th>
              <th className="px-5 py-3.5 font-medium hidden md:table-cell">Kecamatan</th>
              <th className="px-5 py-3.5 font-medium text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ngada-50">
            {wisata.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-forest-400">
                  Tidak ada data
                </td>
              </tr>
            ) : (
              wisata.map((w, i) => {
                const kat = getKategori((w as any).kategori ?? 'wisata_alam')
                return (
                  <tr key={w.id_tempat_wisata} className="hover:bg-ngada-50/50 transition-colors">
                    <td className="px-5 py-3.5 text-forest-400">{i + 1}</td>
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-forest-900">{w.nama_tempat_wisata}</p>
                      <p className="text-xs text-forest-400 line-clamp-1 mt-0.5">{w.alamat}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${kat.color}`}>
                        {kat.label}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 hidden md:table-cell">
                      {w.kecamatan ? (
                        <span className="badge bg-forest-100 text-forest-700">
                          <MapPin size={10} />
                          {w.kecamatan.nama_kecamatan}
                        </span>
                      ) : (
                        <span className="text-forest-300">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-center gap-2">
                        <Link
                          href={`/admin/wisata/${w.id_tempat_wisata}/edit`}
                          className="p-2 rounded-lg bg-ngada-50 text-ngada-600 hover:bg-ngada-100 transition-colors"
                          title="Edit"
                        >
                          <Edit size={15} />
                        </Link>
                        <DeleteButton
                          id={w.id_tempat_wisata}
                          name={w.nama_tempat_wisata}
                          endpoint="/api/wisata"
                        />
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
