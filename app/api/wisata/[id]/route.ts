import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

type Params = { params: Promise<{ id: string }> }

export async function GET(_: NextRequest, { params }: Params) {
  const { id } = await params
  const wisata = await db.tempatWisata.findUnique({
    where: { id_tempat_wisata: parseInt(id) },
    include: { kabupaten: true, lokasi: true, galeri: true },
  })
  if (!wisata) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(wisata)
}

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const { id: paramId } = await params
    const id = parseInt(paramId)
    const body = await req.json()
    const {
      nama_tempat_wisata, alamat, informasi1, kategori, id_kabupaten,
      galeri_nama, galeri_gambar, galeri_keterangan,
      lat, lng,
    } = body

    const existing = await db.tempatWisata.findUnique({
      where: { id_tempat_wisata: id },
      select: { id_galeri: true, id_lokasi: true },
    })

    // ── Galeri upsert ──────────────────────────────────────────
    let id_galeri: number | null = existing?.id_galeri ?? null
    if (galeri_nama) {
      if (id_galeri) {
        await db.galeri.update({
          where: { id_galeri },
          data: { nama_galeri: galeri_nama, gambar: galeri_gambar ?? null, keterangan: galeri_keterangan ?? null },
        })
      } else {
        const g = await db.galeri.create({
          data: { nama_galeri: galeri_nama, gambar: galeri_gambar ?? null, keterangan: galeri_keterangan ?? null },
        })
        id_galeri = g.id_galeri
      }
    } else {
      // Name cleared → unlink (keep row to avoid FK issues)
      id_galeri = null
    }

    // ── Lokasi upsert ──────────────────────────────────────────
    let id_lokasi: number | null = existing?.id_lokasi ?? null
    const hasCoords = lat != null && lng != null
    if (hasCoords) {
      const latNum = Number(lat)
      const lngNum = Number(lng)
      if (id_lokasi) {
        await db.lokasi.update({
          where: { id_lokasi },
          data: { nama_lokasi: nama_tempat_wisata, lat: latNum, lng: lngNum },
        })
      } else {
        const l = await db.lokasi.create({
          data: { nama_lokasi: nama_tempat_wisata, lat: latNum, lng: lngNum },
        })
        id_lokasi = l.id_lokasi
      }
    } else {
      id_lokasi = null
    }

    const wisata = await db.tempatWisata.update({
      where: { id_tempat_wisata: id },
      data: { nama_tempat_wisata, alamat, informasi1, id_kabupaten: id_kabupaten ?? null, id_galeri, id_lokasi, ...({ kategori: kategori ?? 'wisata_alam' } as any) },
    })

    return NextResponse.json(wisata)
  } catch (err: any) {
    console.error('[PUT /api/wisata/:id]', err)
    return NextResponse.json({ error: err.message ?? 'Terjadi kesalahan server' }, { status: 500 })
  }
}

export async function DELETE(_: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    await db.tempatWisata.delete({ where: { id_tempat_wisata: parseInt(id) } })
    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('[DELETE /api/wisata/:id]', err)
    return NextResponse.json({ error: err.message ?? 'Terjadi kesalahan server' }, { status: 500 })
  }
}
