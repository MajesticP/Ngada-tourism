import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

// Required — fs is not available in the Edge runtime
export const runtime = 'nodejs'

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads')
const MAX_SIZE_MB = 5
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'Tidak ada file yang diunggah' }, { status: 400 })
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: 'Format tidak didukung. Gunakan JPG, PNG, atau WebP.' }, { status: 400 })
    }

    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      return NextResponse.json({ error: `Ukuran file maksimal ${MAX_SIZE_MB}MB` }, { status: 400 })
    }

    // Ensure uploads directory exists
    if (!existsSync(UPLOAD_DIR)) {
      await mkdir(UPLOAD_DIR, { recursive: true })
    }

    // Build a clean unique filename: timestamp-originalname.ext
    const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
    const baseName = file.name
      .replace(/\.[^.]+$/, '')           // strip extension
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')       // slugify
      .replace(/^-+|-+$/g, '')           // trim dashes
      .slice(0, 60)                       // cap length
    const filename = `${Date.now()}-${baseName}.${ext}`
    const filePath = path.join(UPLOAD_DIR, filename)

    const bytes = await file.arrayBuffer()
    await writeFile(filePath, Buffer.from(bytes))

    return NextResponse.json({ filename }, { status: 201 })
  } catch (err: any) {
    console.error('[POST /api/upload]', err)
    return NextResponse.json({ error: err.message ?? 'Gagal mengunggah file' }, { status: 500 })
  }
}
