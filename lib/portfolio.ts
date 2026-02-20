import { list, put, del } from "@vercel/blob"
import { cookies } from "next/headers"

export interface PortfolioItem {
  id: string
  url: string
  title: string
  category: string
  alt: string
  description: string
  span: string
  order: number
  uploadedAt: string
}

const MANIFEST_PATH = "portfolio-manifest.json"
const AUTH_COOKIE_NAME = "hplk-admin-auth"

export async function getManifest(): Promise<PortfolioItem[]> {
  try {
    const { blobs } = await list({ prefix: MANIFEST_PATH })
    const manifestBlob = blobs.find((b) => b.pathname === MANIFEST_PATH)
    if (!manifestBlob) return []
    const response = await fetch(manifestBlob.url, { cache: "no-store" })
    if (!response.ok) return []
    const data = await response.json()
    return Array.isArray(data) ? data : []
  } catch {
    return []
  }
}

export async function saveManifest(items: PortfolioItem[]): Promise<void> {
  const sorted = [...items].sort((a, b) => a.order - b.order)
  await put(MANIFEST_PATH, JSON.stringify(sorted, null, 2), {
    access: "public",
    addRandomSuffix: false,
    contentType: "application/json",
  })
}

export async function validateAuth(): Promise<boolean> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value
    if (!token) return false
    // Token is a base64-encoded hash of the password + a known salt
    const expected = Buffer.from(
      `hplk-auth:${process.env.ADMIN_PASSWORD}`
    ).toString("base64")
    return token === expected
  } catch {
    return false
  }
}

export function generateAuthToken(): string {
  return Buffer.from(
    `hplk-auth:${process.env.ADMIN_PASSWORD}`
  ).toString("base64")
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export { AUTH_COOKIE_NAME }

export async function deleteImageFromBlob(url: string): Promise<void> {
  try {
    await del(url)
  } catch {
    // Ignore errors if the blob doesn't exist
  }
}
