import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth'
import { wisataSchema } from '@/lib/validations'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const search = searchParams.get('search') ?? undefined
  const data = await db.tempatWisata.findMany({
    where: search ? { nama_tempat_wisata: { contains: search } } : {},
    include: { kabupaten: true, lokasi: true, galeri: true },
    orderBy: { id_tempat_wisata: 'asc' },
  })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

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
    } = parsed.data

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

    let id_lokasi: number | null = null
    if (lat != null && lng != null) {
      const lokasi = await db.lokasi.create({
        data: { nama_lokasi: nama_tempat_wisata, lat, lng },
      })
      id_lokasi = lokasi.id_lokasi
    }

    const wisata = await db.tempatWisata.create({
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
      },
    })

    return NextResponse.json(wisata, { status: 201 })
  } catch (err: any) {
    console.error('[POST /api/wisata]', err)
    return NextResponse.json({ error: err.message ?? 'Terjadi kesalahan server' }, { status: 500 })
  }
}
