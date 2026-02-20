import { put } from "@vercel/blob"
import { type NextRequest, NextResponse } from "next/server"
import {
  getManifest,
  saveManifest,
  validateAuth,
  generateId,
  deleteImageFromBlob,
  type PortfolioItem,
} from "@/lib/portfolio"

// GET - Fetch all portfolio items (public)
export async function GET() {
  try {
    const items = await getManifest()
    return NextResponse.json({ items }, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=30",
      },
    })
  } catch (error) {
    console.error("Error fetching portfolio:", error)
    return NextResponse.json({ error: "Failed to fetch portfolio" }, { status: 500 })
  }
}

// POST - Upload new portfolio item (auth required)
export async function POST(request: NextRequest) {
  const authenticated = await validateAuth()
  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const title = formData.get("title") as string
    const category = formData.get("category") as string
    const alt = formData.get("alt") as string
    const description = (formData.get("description") as string) || ""
    const span = (formData.get("span") as string) || "md:col-span-1 md:row-span-1"

    if (!file || !title || !category || !alt) {
      return NextResponse.json(
        { error: "File, title, category, and alt text are required" },
        { status: 400 }
      )
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/avif"]
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Only JPEG, PNG, WebP, and AVIF images are allowed" },
        { status: 400 }
      )
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size must be under 10MB" },
        { status: 400 }
      )
    }

    // Upload to Vercel Blob
    const blob = await put(`portfolio/${Date.now()}-${file.name}`, file, {
      access: "public",
    })

    // Add to manifest
    const items = await getManifest()
    const newItem: PortfolioItem = {
      id: generateId(),
      url: blob.url,
      title: title.trim(),
      category: category.trim(),
      alt: alt.trim(),
      description: description.trim(),
      span,
      order: items.length,
      uploadedAt: new Date().toISOString(),
    }

    items.push(newItem)
    await saveManifest(items)

    return NextResponse.json({ item: newItem }, { status: 201 })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}

// PUT - Update portfolio item metadata (auth required)
export async function PUT(request: NextRequest) {
  const authenticated = await validateAuth()
  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { id, title, category, alt, description, span, order } = body

    if (!id) {
      return NextResponse.json({ error: "Item ID is required" }, { status: 400 })
    }

    const items = await getManifest()
    const index = items.findIndex((item) => item.id === id)
    if (index === -1) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 })
    }

    // Update fields if provided
    if (title !== undefined) items[index].title = title.trim()
    if (category !== undefined) items[index].category = category.trim()
    if (alt !== undefined) items[index].alt = alt.trim()
    if (description !== undefined) items[index].description = description.trim()
    if (span !== undefined) items[index].span = span
    if (order !== undefined) items[index].order = order

    await saveManifest(items)

    return NextResponse.json({ item: items[index] })
  } catch (error) {
    console.error("Update error:", error)
    return NextResponse.json({ error: "Update failed" }, { status: 500 })
  }
}

// DELETE - Remove portfolio item (auth required)
export async function DELETE(request: NextRequest) {
  const authenticated = await validateAuth()
  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id } = await request.json()
    if (!id) {
      return NextResponse.json({ error: "Item ID is required" }, { status: 400 })
    }

    const items = await getManifest()
    const item = items.find((i) => i.id === id)
    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 })
    }

    // Delete image from blob
    await deleteImageFromBlob(item.url)

    // Remove from manifest and reorder
    const updatedItems = items
      .filter((i) => i.id !== id)
      .map((i, idx) => ({ ...i, order: idx }))

    await saveManifest(updatedItems)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete error:", error)
    return NextResponse.json({ error: "Delete failed" }, { status: 500 })
  }
}
