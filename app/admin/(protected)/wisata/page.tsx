export const dynamic = 'force-dynamic'

import { db } from '@/lib/db'
import Link from 'next/link'
import { Plus, Edit, Trash2, Search, MapPin } from 'lucide-react'
import DeleteButton from '@/components/admin/DeleteButton'
import { getSession } from '@/lib/auth'


async function getWisata(search?: string) {
  await getSession() // pastikan user sudah login
  return db.tempatWisata.findMany({
    where: search ? { nama_tempat_wisata: { contains: search } } : {},
    include: { kecamatan: true, lokasi: true, galeri: true },
    orderBy: { id_tempat_wisata: 'asc' },
  })
}

export default async function AdminWisataPage({ searchParams }: { searchParams: Promise<{ search?: string }> }) {
  const { search } = await searchParams
  const wisata = await getWisata(search)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-forest-900">Tempat Wisata</h1>
          <p className="text-forest-500 text-sm mt-1">{wisata.length} destinasi terdaftar</p>
        </div>
        <Link href="/admin/wisata/new" className="btn-primary inline-flex items-center gap-2">
          <Plus size={16} /> Tambah Wisata
        </Link>
      </div>

      {/* Search */}
      <form className="flex gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-forest-400" />
          <input
            name="search"
            defaultValue={search}
            placeholder="Cari nama wisata..."
            className="input-field pl-10"
          />
        </div>
        <button type="submit" className="btn-primary">Cari</button>
        {search && (
          <Link href="/admin/wisata" className="btn-outline">Reset</Link>
        )}
      </form>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-ngada-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-forest-800 text-white text-left">
              <th className="px-5 py-3.5 font-medium w-8">No</th>
              <th className="px-5 py-3.5 font-medium">Nama Wisata</th>
              <th className="px-5 py-3.5 font-medium">Kecamatan</th>
              <th className="px-5 py-3.5 font-medium hidden md:table-cell">Lokasi GPS</th>
              <th className="px-5 py-3.5 font-medium text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ngada-50">
            {wisata.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-forest-400">
                  Tidak ada data wisata
                </td>
              </tr>
            ) : (
              wisata.map((w, i) => (
                <tr key={w.id_tempat_wisata} className="hover:bg-ngada-50/50 transition-colors">
                  <td className="px-5 py-3.5 text-forest-400">{i + 1}</td>
                  <td className="px-5 py-3.5">
                    <p className="font-medium text-forest-900">{w.nama_tempat_wisata}</p>
                    <p className="text-xs text-forest-400 line-clamp-1 mt-0.5">{w.alamat}</p>
                  </td>
                  <td className="px-5 py-3.5">
                    {w.kecamatan ? (
                      <span className="badge bg-forest-100 text-forest-700">
                        <MapPin size={10} />
                        {w.kecamatan.nama_kecamatan}
                      </span>
                    ) : (
                      <span className="text-forest-300">—</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 hidden md:table-cell">
                    {w.lokasi?.lat && w.lokasi?.lng ? (
                      <span className="font-mono text-xs text-forest-500">
                        {w.lokasi.lat.toFixed(4)}, {w.lokasi.lng.toFixed(4)}
                      </span>
                    ) : (
                      <span className="text-forest-300 text-xs">—</span>
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
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
