import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

type Params = { params: Promise<{ id: string }> }

export async function PUT(req: NextRequest, { params }: Params) {
  const { id } = await params
  const body = await req.json()
  const kecamatan = await db.kecamatan.update({ where: { id_kecamatan: parseInt(id) }, data: body })
  return NextResponse.json(kecamatan)
}

export async function DELETE(_: NextRequest, { params }: Params) {
  const { id } = await params
  const used = await db.tempatWisata.count({ where: { id_kecamatan: parseInt(id) } })
  if (used > 0) {
    return NextResponse.json({ error: `Kecamatan ini terhubung dengan ${used} wisata` }, { status: 409 })
  }

  await db.kecamatan.delete({ where: { id_kecamatan: parseInt(id) } })
  return NextResponse.json({ success: true })
}
