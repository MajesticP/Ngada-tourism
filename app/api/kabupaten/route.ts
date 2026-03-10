import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'


export async function GET() {
  const data = await db.kabupaten.findMany({ orderBy: { nama_kabupaten: 'asc' } })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const { nama_kabupaten } = await req.json()
  if (!nama_kabupaten) return NextResponse.json({ error: 'Nama kabupaten wajib diisi' }, { status: 400 })

  const kabupaten = await db.kabupaten.create({ data: { nama_kabupaten } })
  return NextResponse.json(kabupaten, { status: 201 })
}
