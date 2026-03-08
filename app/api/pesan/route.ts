import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth'

// POST — public, no auth needed (contact form submission)
export async function POST(req: NextRequest) {
  try {
    const { nama, email, subjek, pesan } = await req.json()

    if (!nama || !email || !pesan) {
      return NextResponse.json({ error: 'Nama, email, dan pesan wajib diisi' }, { status: 400 })
    }

    const baru = await db.pesan.create({
      data: { nama, email, subjek: subjek || null, pesan },
    })

    return NextResponse.json(baru, { status: 201 })
  } catch (err: any) {
    console.error('[POST /api/pesan]', err)
    return NextResponse.json({ error: err.message ?? 'Terjadi kesalahan server' }, { status: 500 })
  }
}

// GET — admin only
export async function GET(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const filter = searchParams.get('filter') // 'unread' | 'read' | null (all)

  const where =
    filter === 'unread' ? { sudah_baca: false }
    : filter === 'read'   ? { sudah_baca: true }
    : {}

  const [messages, unreadCount] = await Promise.all([
    db.pesan.findMany({ where, orderBy: { created_at: 'desc' } }),
    db.pesan.count({ where: { sudah_baca: false } }),
  ])

  return NextResponse.json({ messages, unreadCount })
}
