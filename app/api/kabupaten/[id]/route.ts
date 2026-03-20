import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth'

type Params = { params: Promise<{ id: string }> }

export async function PUT(req: NextRequest, { params }: Params) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const body = await req.json()
  const kabupaten = await db.kabupaten.update({ where: { id_kabupaten: parseInt(id) }, data: body })
  return NextResponse.json(kabupaten)
}

export async function DELETE(_: NextRequest, { params }: Params) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const used = await db.tempatWisata.count({ where: { id_kabupaten: parseInt(id) } })
  if (used > 0) {
    return NextResponse.json({ error: `Kabupaten ini terhubung dengan ${used} wisata` }, { status: 409 })
  }

  await db.kabupaten.delete({ where: { id_kabupaten: parseInt(id) } })
  return NextResponse.json({ success: true })
}
