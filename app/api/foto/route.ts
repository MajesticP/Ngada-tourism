import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const { id_tempat_wisata, url, urutan } = await req.json()
    const foto = await db.foto.create({ data: { id_tempat_wisata, url, urutan } })
    return NextResponse.json(foto, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
