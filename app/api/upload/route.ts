import { NextRequest, NextResponse } from 'next/server'
import { createHmac } from 'crypto'

export const runtime = 'nodejs'

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

    const bytes = await file.arrayBuffer()
    const base64 = Buffer.from(bytes).toString('base64')
    const dataUri = `data:${file.type};base64,${base64}`

    const timestamp = Math.floor(Date.now() / 1000).toString()
    const baseName = file.name
      .replace(/\.[^.]+$/, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 60)
    const publicId = `ngada/${Date.now()}-${baseName}`

    const apiSecret = process.env.CLOUDINARY_API_SECRET!
    const apiKey = process.env.CLOUDINARY_API_KEY!
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME!

    // Correct Cloudinary signature: SHA-1 of sorted params + secret
    const signatureString = `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`
    const { createHash } = await import('crypto')
    const signature = createHash('sha1').update(signatureString).digest('hex')

    const uploadForm = new FormData()
    uploadForm.append('file', dataUri)
    uploadForm.append('api_key', apiKey)
    uploadForm.append('timestamp', timestamp)
    uploadForm.append('public_id', publicId)
    uploadForm.append('signature', signature)

    const cloudRes = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      { method: 'POST', body: uploadForm }
    )

    const cloudData = await cloudRes.json()

    if (!cloudRes.ok) {
      throw new Error(cloudData.error?.message ?? 'Gagal upload ke Cloudinary')
    }

    return NextResponse.json({ filename: cloudData.secure_url }, { status: 201 })
  } catch (err: any) {
    console.error('[POST /api/upload]', err)
    return NextResponse.json({ error: err.message ?? 'Gagal mengunggah file' }, { status: 500 })
  }
}
