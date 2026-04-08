import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth'
import { wisataSchema } from '@/lib/validations'

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
    const session = await getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id: paramId } = await params
    const id = parseInt(paramId)

    const raw = await req.json()
    const parsed = wisataSchema.safeParse(raw)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validasi gagal', issues: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const {
      nama_tempat_wisata, alamat, informasi1, kategori, id_kabupaten,
      galeri_nama, galeri_gambar, galeri_keterangan,
      lat, lng,
      akses_jalan, parkir, toilet, jarak_atm, jarak_rs, spot_foto,
      atm_lat, atm_lng, rs_lat, rs_lng,
    } = parsed.data

    const existing = await db.tempatWisata.findUnique({
      where: { id_tempat_wisata: id },
      select: { id_galeri: true, id_lokasi: true },
    })

    // ── Galeri upsert ───────────────────────────────────────────
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
      id_galeri = null
    }

    // ── Lokasi upsert ───────────────────────────────────────────
    let id_lokasi: number | null = existing?.id_lokasi ?? null
    const hasCoords = lat != null && lng != null
    if (hasCoords) {
      if (id_lokasi) {
        await db.lokasi.update({
          where: { id_lokasi },
          data: { nama_lokasi: nama_tempat_wisata, lat: lat!, lng: lng! },
        })
      } else {
        const l = await db.lokasi.create({
          data: { nama_lokasi: nama_tempat_wisata, lat: lat!, lng: lng! },
        })
        id_lokasi = l.id_lokasi
      }
    } else {
      id_lokasi = null
    }

    const wisata = await db.tempatWisata.update({
      where: { id_tempat_wisata: id },
      data: {
        nama_tempat_wisata, alamat, informasi1,
        kategori: kategori ?? 'wisata_alam',
        id_kabupaten: id_kabupaten ?? null, id_galeri, id_lokasi,
        akses_jalan: akses_jalan ?? null,
        parkir:      parkir      ?? null,
        toilet:      toilet      ?? null,
        jarak_atm:   jarak_atm   ?? null,
        jarak_rs:    jarak_rs    ?? null,
        spot_foto:   spot_foto   ?? null,
        atm_lat:     atm_lat     ?? null,
        atm_lng:     atm_lng     ?? null,
        rs_lat:      rs_lat      ?? null,
        rs_lng:      rs_lng      ?? null,
      },
    })

    return NextResponse.json(wisata)
  } catch (err: any) {
    console.error('[PUT /api/wisata/:id]', err)
    return NextResponse.json({ error: err.message ?? 'Terjadi kesalahan server' }, { status: 500 })
  }
}

export async function DELETE(_: NextRequest, { params }: Params) {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params
    const numId = parseInt(id)

    // Grab FK references before deletion so we can clean up orphans
    const existing = await db.tempatWisata.findUnique({
      where: { id_tempat_wisata: numId },
      select: { id_lokasi: true, id_galeri: true },
    })

    await db.tempatWisata.delete({ where: { id_tempat_wisata: numId } })

    // Clean up orphaned Lokasi row if no other wisata references it
    if (existing?.id_lokasi) {
      const stillUsed = await db.tempatWisata.count({
        where: { id_lokasi: existing.id_lokasi },
      })
      if (stillUsed === 0) {
        await db.lokasi.delete({ where: { id_lokasi: existing.id_lokasi } }).catch(() => {})
      }
    }

    // Clean up orphaned Galeri row the same way
    if (existing?.id_galeri) {
      const stillUsed = await db.tempatWisata.count({
        where: { id_galeri: existing.id_galeri },
      })
      if (stillUsed === 0) {
        await db.galeri.delete({ where: { id_galeri: existing.id_galeri } }).catch(() => {})
      }
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('[DELETE /api/wisata/:id]', err)
    return NextResponse.json({ error: err.message ?? 'Terjadi kesalahan server' }, { status: 500 })
  }
}
