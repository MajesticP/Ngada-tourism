import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth'

type Params = { params: Promise<{ id: string }> }

async function requireAdmin() {
  const session = await getSession()
  return session ?? null
}

// PATCH — toggle sudah_baca
export async function PATCH(req: NextRequest, { params }: Params) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  const { sudah_baca } = await req.json()
  const updated = await db.pesan.update({
    where: { id_pesan: parseInt(id) },
    data: { sudah_baca: Boolean(sudah_baca) },
  })
  return NextResponse.json(updated)
}

// DELETE
export async function DELETE(_: NextRequest, { params }: Params) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  await db.pesan.delete({ where: { id_pesan: parseInt(id) } })
  return NextResponse.json({ success: true })
}
