import { NextResponse } from 'next/server'
import { get } from '@vercel/blob'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const filename = searchParams.get('pathname')

  if (!filename) {
    return NextResponse.json({ error: 'Missing filename' }, { status: 400 })
  }

  try {
    const blob = await get(`img/${filename}`, {
      token: process.env.BLOB_READ_WRITE_TOKEN,
    })

    const response = await fetch(blob.url)

    if (!response.ok) {
      return new NextResponse('Not found', { status: 404 })
    }

    const buffer = await response.arrayBuffer()

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': blob.contentType ?? 'image/jpeg',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (error) {
    console.error('Blob image fetch error:', error)
    return new NextResponse('Not found', { status: 404 })
  }
}
