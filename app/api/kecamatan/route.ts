import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'


export async function GET() {
  const data = await db.kecamatan.findMany({ orderBy: { nama_kecamatan: 'asc' } })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const { nama_kecamatan } = await req.json()
  if (!nama_kecamatan) return NextResponse.json({ error: 'Nama kecamatan wajib diisi' }, { status: 400 })

  const kecamatan = await db.kecamatan.create({ data: { nama_kecamatan } })
  return NextResponse.json(kecamatan, { status: 201 })
}
