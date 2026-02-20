import { NextResponse } from 'next/server'
import { head, list } from '@vercel/blob'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const filename = searchParams.get('pathname')

  if (!filename) {
    return NextResponse.json({ error: 'Missing filename' }, { status: 400 })
  }

  try {
    // List blobs with the prefix to find the matching file
    const { blobs } = await list({
      prefix: `img/${filename}`,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    })

    if (blobs.length === 0) {
      return new NextResponse('Not found', { status: 404 })
    }

    const blob = blobs[0]

    // Fetch the actual image data from the blob URL
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
