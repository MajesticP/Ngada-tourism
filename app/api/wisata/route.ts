import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const search = searchParams.get('search') ?? undefined
  const data = await db.tempatWisata.findMany({
    where: search ? { nama_tempat_wisata: { contains: search } } : {},
    include: { kecamatan: true, lokasi: true, galeri: true },
    orderBy: { id_tempat_wisata: 'asc' },
  })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      nama_tempat_wisata, alamat, informasi1, kategori, id_kecamatan,
      galeri_nama, galeri_gambar, galeri_keterangan,
      lat, lng,
    } = body

    if (!nama_tempat_wisata || !alamat || !informasi1) {
      return NextResponse.json({ error: 'Field wajib belum diisi' }, { status: 400 })
    }

    // Auto-create Galeri row if a name was provided
    let id_galeri: number | null = null
    if (galeri_nama) {
      const galeri = await db.galeri.create({
        data: {
          nama_galeri: galeri_nama,
          gambar: galeri_gambar ?? null,
          keterangan: galeri_keterangan ?? null,
        },
      })
      id_galeri = galeri.id_galeri
    }

    // Auto-create Lokasi row if coordinates were provided
    let id_lokasi: number | null = null
    if (lat != null && lng != null) {
      const lokasi = await db.lokasi.create({
        data: {
          nama_lokasi: nama_tempat_wisata,
          lat: Number(lat),
          lng: Number(lng),
        },
      })
      id_lokasi = lokasi.id_lokasi
    }

    const wisata = await db.tempatWisata.create({
      data: { nama_tempat_wisata, alamat, informasi1, kategori: kategori ?? 'wisata_alam', id_kecamatan: id_kecamatan ?? null, id_galeri, id_lokasi },
    })

    return NextResponse.json(wisata, { status: 201 })
  } catch (err: any) {
    console.error('[POST /api/wisata]', err)
    return NextResponse.json({ error: err.message ?? 'Terjadi kesalahan server' }, { status: 500 })
  }
}
