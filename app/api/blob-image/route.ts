import { NextResponse } from 'next/server'
import { get } from '@vercel/blob'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const filename = searchParams.get('pathname')

  if (!filename) {
    return NextResponse.json({ error: 'Missing filename' }, { status: 400 })
  }

  try {
    const result = await get(`img/${filename}`, {
      access: 'private',
      token: process.env.BLOB_READ_WRITE_TOKEN,
    })

    if (!result) {
      return new NextResponse('Not found', { status: 404 })
    }

    const buffer = await result.arrayBuffer()

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': result.contentType ?? 'image/jpeg',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (error) {
    console.error('[v0] Blob image fetch error:', error)
    return new NextResponse('Not found', { status: 404 })
  }
}
