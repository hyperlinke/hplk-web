"use client"

import { useState, useCallback } from "react"
import Image from "next/image"
import useSWR from "swr"
import {
  Upload,
  Pencil,
  Trash2,
  LogOut,
  Plus,
  X,
  GripVertical,
  Camera,
  ArrowLeft,
} from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import type { PortfolioItem } from "@/lib/portfolio"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

const SPAN_OPTIONS = [
  { value: "md:col-span-1 md:row-span-1", label: "1x1 (Standard)" },
  { value: "md:col-span-2 md:row-span-1", label: "2x1 (Wide)" },
  { value: "md:col-span-1 md:row-span-2", label: "1x2 (Tall)" },
  { value: "md:col-span-2 md:row-span-2", label: "2x2 (Featured)" },
]

const DEFAULT_CATEGORIES = [
  "Portrait",
  "Landscape",
  "Urban",
  "Nature",
  "Wedding",
  "Architecture",
  "Detail",
  "Commercial",
  "Editorial",
]

interface AdminDashboardProps {
  onLogout: () => void
}

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const { data, mutate, isLoading } = useSWR<{ items: PortfolioItem[] }>(
    "/api/portfolio",
    fetcher
  )

  const items = data?.items ?? []
  const [showUpload, setShowUpload] = useState(false)
  const [editItem, setEditItem] = useState<PortfolioItem | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const handleLogout = useCallback(async () => {
    try {
      await fetch("/api/auth", { method: "DELETE" })
      onLogout()
    } catch {
      toast.error("Logout failed")
    }
  }, [onLogout])

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <a
              href="/"
              className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Portfolio</span>
            </a>
            <div className="h-4 w-px bg-border" />
            <h1 className="text-sm font-medium uppercase tracking-widest text-foreground">
              Admin
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={() => setShowUpload(true)}
              size="sm"
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Upload</span>
            </Button>
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Stats bar */}
      <div className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-7xl items-center gap-8 px-6 py-3">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-widest text-muted-foreground">
              Total
            </span>
            <span className="text-sm font-medium text-foreground">
              {items.length}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-widest text-muted-foreground">
              Categories
            </span>
            <span className="text-sm font-medium text-foreground">
              {new Set(items.map((i) => i.category)).size}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-6 py-8">
        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[4/3] bg-secondary" />
                <div className="mt-3 h-4 w-2/3 bg-secondary" />
                <div className="mt-2 h-3 w-1/3 bg-secondary" />
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="flex h-16 w-16 items-center justify-center border border-border">
              <Camera className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="mt-6 font-serif text-xl text-foreground">
              Your portfolio is empty
            </p>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Upload your first image to get started. It will appear on your
              portfolio page immediately.
            </p>
            <Button
              onClick={() => setShowUpload(true)}
              className="mt-6 gap-2"
            >
              <Upload className="h-4 w-4" />
              Upload first image
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <AdminCard
                key={item.id}
                item={item}
                onEdit={() => setEditItem(item)}
                onDelete={() => setDeleteConfirm(item.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Upload Dialog */}
      <UploadDialog
        open={showUpload}
        onOpenChange={setShowUpload}
        existingCategories={[
          ...new Set(items.map((i) => i.category)),
        ]}
        onSuccess={() => {
          mutate()
          setShowUpload(false)
          toast.success("Image uploaded successfully")
        }}
      />

      {/* Edit Dialog */}
      {editItem && (
        <EditDialog
          item={editItem}
          open={!!editItem}
          onOpenChange={(open) => !open && setEditItem(null)}
          existingCategories={[
            ...new Set(items.map((i) => i.category)),
          ]}
          onSuccess={() => {
            mutate()
            setEditItem(null)
            toast.success("Image updated successfully")
          }}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {deleteConfirm && (
        <DeleteDialog
          itemId={deleteConfirm}
          itemTitle={items.find((i) => i.id === deleteConfirm)?.title ?? ""}
          open={!!deleteConfirm}
          onOpenChange={(open) => !open && setDeleteConfirm(null)}
          onSuccess={() => {
            mutate()
            setDeleteConfirm(null)
            toast.success("Image deleted successfully")
          }}
        />
      )}
    </div>
  )
}

// --- Admin Card ---
function AdminCard({
  item,
  onEdit,
  onDelete,
}: {
  item: PortfolioItem
  onEdit: () => void
  onDelete: () => void
}) {
  return (
    <div className="group relative overflow-hidden border border-border bg-card transition-colors hover:border-primary/30">
      <div className="relative aspect-[4/3]">
        <Image
          src={item.url}
          alt={item.alt}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {/* Actions overlay */}
        <div className="absolute inset-0 flex items-center justify-center gap-2 bg-background/70 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <Button
            onClick={onEdit}
            size="sm"
            variant="outline"
            className="gap-1.5 bg-background/80 backdrop-blur-sm"
          >
            <Pencil className="h-3.5 w-3.5" />
            Edit
          </Button>
          <Button
            onClick={onDelete}
            size="sm"
            variant="outline"
            className="gap-1.5 border-destructive/50 bg-background/80 text-destructive backdrop-blur-sm hover:bg-destructive hover:text-destructive-foreground"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Delete
          </Button>
        </div>
      </div>
      <div className="flex items-start justify-between gap-3 p-4">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-foreground">
            {item.title}
          </p>
          <div className="mt-1.5 flex items-center gap-2">
            <Badge variant="secondary" className="text-[10px] uppercase tracking-wider">
              {item.category}
            </Badge>
            <span className="text-[10px] text-muted-foreground">
              {SPAN_OPTIONS.find((s) => s.value === item.span)?.label ?? "1x1"}
            </span>
          </div>
        </div>
        <div className="flex shrink-0 items-center text-muted-foreground">
          <GripVertical className="h-4 w-4" />
        </div>
      </div>
    </div>
  )
}

// --- Upload Dialog ---
function UploadDialog({
  open,
  onOpenChange,
  existingCategories,
  onSuccess,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  existingCategories: string[]
  onSuccess: () => void
}) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("")
  const [customCategory, setCustomCategory] = useState("")
  const [alt, setAlt] = useState("")
  const [description, setDescription] = useState("")
  const [span, setSpan] = useState("md:col-span-1 md:row-span-1")

  const allCategories = [
    ...new Set([...DEFAULT_CATEGORIES, ...existingCategories]),
  ].sort()

  function resetForm() {
    setFile(null)
    setPreview(null)
    setTitle("")
    setCategory("")
    setCustomCategory("")
    setAlt("")
    setDescription("")
    setSpan("md:col-span-1 md:row-span-1")
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0]
    if (!selected) return

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/avif"]
    if (!allowedTypes.includes(selected.type)) {
      toast.error("Only JPEG, PNG, WebP, and AVIF images are allowed")
      return
    }
    if (selected.size > 10 * 1024 * 1024) {
      toast.error("File size must be under 10MB")
      return
    }

    setFile(selected)
    const reader = new FileReader()
    reader.onload = (ev) => setPreview(ev.target?.result as string)
    reader.readAsDataURL(selected)
  }

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault()
    if (!file) return

    const finalCategory = category === "__custom__" ? customCategory : category
    if (!finalCategory.trim()) {
      toast.error("Please select or enter a category")
      return
    }

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("title", title)
      formData.append("category", finalCategory)
      formData.append("alt", alt)
      formData.append("description", description)
      formData.append("span", span)

      const response = await fetch("/api/portfolio", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Upload failed")
      }

      resetForm()
      onSuccess()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed")
    } finally {
      setUploading(false)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) resetForm()
        onOpenChange(o)
      }}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-serif text-xl">
            <Upload className="h-5 w-5 text-primary" />
            Upload Image
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleUpload} className="space-y-5">
          {/* File input */}
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-widest text-muted-foreground">
              Image
            </Label>
            {preview ? (
              <div className="relative aspect-[4/3] overflow-hidden border border-border">
                <Image
                  src={preview}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    setFile(null)
                    setPreview(null)
                  }}
                  className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center bg-background/80 text-foreground backdrop-blur-sm transition-colors hover:bg-destructive hover:text-destructive-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <label className="flex cursor-pointer flex-col items-center justify-center gap-2 border border-dashed border-border py-12 transition-colors hover:border-primary/50 hover:bg-secondary/50">
                <Camera className="h-8 w-8 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Click to select an image
                </span>
                <span className="text-xs text-muted-foreground/60">
                  JPEG, PNG, WebP, AVIF up to 10MB
                </span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  onChange={handleFileChange}
                  className="sr-only"
                />
              </label>
            )}
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="upload-title" className="text-xs uppercase tracking-widest text-muted-foreground">
              Title
            </Label>
            <Input
              id="upload-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Golden Hour"
              required
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-widest text-muted-foreground">
              Category
            </Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {allCategories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
                <SelectItem value="__custom__">
                  + Custom category
                </SelectItem>
              </SelectContent>
            </Select>
            {category === "__custom__" && (
              <Input
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                placeholder="Enter custom category"
                className="mt-2"
              />
            )}
          </div>

          {/* Alt text */}
          <div className="space-y-2">
            <Label htmlFor="upload-alt" className="text-xs uppercase tracking-widest text-muted-foreground">
              Alt Text
            </Label>
            <Input
              id="upload-alt"
              value={alt}
              onChange={(e) => setAlt(e.target.value)}
              placeholder="Describe the image for accessibility"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="upload-desc" className="text-xs uppercase tracking-widest text-muted-foreground">
              Description (Optional)
            </Label>
            <Textarea
              id="upload-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional longer description shown in lightbox"
              rows={2}
            />
          </div>

          {/* Grid span */}
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-widest text-muted-foreground">
              Grid Size
            </Label>
            <Select value={span} onValueChange={setSpan}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SPAN_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            type="submit"
            disabled={uploading || !file || !title || !alt}
            className="w-full gap-2"
          >
            {uploading ? (
              "Uploading..."
            ) : (
              <>
                <Upload className="h-4 w-4" />
                Upload Image
              </>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// --- Edit Dialog ---
function EditDialog({
  item,
  open,
  onOpenChange,
  existingCategories,
  onSuccess,
}: {
  item: PortfolioItem
  open: boolean
  onOpenChange: (open: boolean) => void
  existingCategories: string[]
  onSuccess: () => void
}) {
  const [saving, setSaving] = useState(false)
  const [title, setTitle] = useState(item.title)
  const [category, setCategory] = useState(item.category)
  const [customCategory, setCustomCategory] = useState("")
  const [alt, setAlt] = useState(item.alt)
  const [description, setDescription] = useState(item.description)
  const [span, setSpan] = useState(item.span)

  const allCategories = [
    ...new Set([...DEFAULT_CATEGORIES, ...existingCategories]),
  ].sort()

  const isCustom = !allCategories.includes(category) && category !== "__custom__"

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    const finalCategory = category === "__custom__" ? customCategory : category
    if (!finalCategory.trim()) {
      toast.error("Please select or enter a category")
      return
    }

    setSaving(true)
    try {
      const response = await fetch("/api/portfolio", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: item.id,
          title,
          category: finalCategory,
          alt,
          description,
          span,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Update failed")
      }

      onSuccess()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Update failed")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-serif text-xl">
            <Pencil className="h-5 w-5 text-primary" />
            Edit Image
          </DialogTitle>
        </DialogHeader>

        {/* Thumbnail preview */}
        <div className="relative aspect-[16/9] overflow-hidden border border-border">
          <Image
            src={item.url}
            alt={item.alt}
            fill
            className="object-cover"
          />
        </div>

        <form onSubmit={handleSave} className="space-y-5">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="edit-title" className="text-xs uppercase tracking-widest text-muted-foreground">
              Title
            </Label>
            <Input
              id="edit-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-widest text-muted-foreground">
              Category
            </Label>
            <Select
              value={isCustom ? "__custom__" : category}
              onValueChange={(val) => {
                setCategory(val)
                if (val !== "__custom__") setCustomCategory("")
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {allCategories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
                <SelectItem value="__custom__">
                  + Custom category
                </SelectItem>
              </SelectContent>
            </Select>
            {(category === "__custom__" || isCustom) && (
              <Input
                value={isCustom ? category : customCategory}
                onChange={(e) => {
                  if (isCustom) setCategory(e.target.value)
                  else setCustomCategory(e.target.value)
                }}
                placeholder="Enter custom category"
                className="mt-2"
              />
            )}
          </div>

          {/* Alt text */}
          <div className="space-y-2">
            <Label htmlFor="edit-alt" className="text-xs uppercase tracking-widest text-muted-foreground">
              Alt Text
            </Label>
            <Input
              id="edit-alt"
              value={alt}
              onChange={(e) => setAlt(e.target.value)}
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="edit-desc" className="text-xs uppercase tracking-widest text-muted-foreground">
              Description (Optional)
            </Label>
            <Textarea
              id="edit-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
            />
          </div>

          {/* Grid span */}
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-widest text-muted-foreground">
              Grid Size
            </Label>
            <Select value={span} onValueChange={setSpan}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SPAN_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            type="submit"
            disabled={saving || !title || !alt}
            className="w-full gap-2"
          >
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// --- Delete Confirmation Dialog ---
function DeleteDialog({
  itemId,
  itemTitle,
  open,
  onOpenChange,
  onSuccess,
}: {
  itemId: string
  itemTitle: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}) {
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    setDeleting(true)
    try {
      const response = await fetch("/api/portfolio", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: itemId }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Delete failed")
      }

      onSuccess()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed")
    } finally {
      setDeleting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl">
            Delete Image
          </DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          {"Are you sure you want to delete "}
          <span className="font-medium text-foreground">{itemTitle}</span>
          {"? This action cannot be undone."}
        </p>
        <div className="flex gap-3 pt-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1"
            disabled={deleting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            className="flex-1 gap-2"
            disabled={deleting}
          >
            {deleting ? "Deleting..." : (
              <>
                <Trash2 className="h-4 w-4" />
                Delete
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
