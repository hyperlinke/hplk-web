"use client"

import Image from "next/image"
import { useState } from "react"
import { X, Camera } from "lucide-react"
import useSWR from "swr"
import type { PortfolioItem } from "@/lib/portfolio"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

function PortfolioSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:auto-rows-[280px]">
      {[
        "md:col-span-2 md:row-span-2",
        "md:col-span-1 md:row-span-1",
        "md:col-span-1 md:row-span-1",
        "md:col-span-1 md:row-span-2",
        "md:col-span-1 md:row-span-1",
        "md:col-span-1 md:row-span-1",
      ].map((span, i) => (
        <div
          key={i}
          className={`${span} animate-pulse bg-secondary`}
        />
      ))}
    </div>
  )
}

function PortfolioEmpty() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="flex h-16 w-16 items-center justify-center border border-border">
        <Camera className="h-6 w-6 text-muted-foreground" />
      </div>
      <p className="mt-6 font-serif text-xl text-foreground">
        No work uploaded yet
      </p>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
        Portfolio images will appear here once added through the admin panel.
      </p>
    </div>
  )
}

export function PortfolioGrid() {
  const { data, isLoading } = useSWR<{ items: PortfolioItem[] }>(
    "/api/portfolio",
    fetcher,
    {
      revalidateOnFocus: true,
      dedupingInterval: 30000,
    }
  )

  const portfolioItems = data?.items ?? []
  const categories = [
    "All",
    ...Array.from(new Set(portfolioItems.map((item) => item.category))),
  ]

  const [activeCategory, setActiveCategory] = useState("All")
  const [lightboxImage, setLightboxImage] = useState<PortfolioItem | null>(null)

  const filtered =
    activeCategory === "All"
      ? portfolioItems
      : portfolioItems.filter((item) => item.category === activeCategory)

  return (
    <section id="work" className="px-6 py-24 lg:px-12">
      <div className="mx-auto max-w-7xl">
        {/* Section header */}
        <div className="mb-16">
          <p className="mb-3 text-sm uppercase tracking-[0.3em] text-primary">
            Selected Work
          </p>
          <h2 className="font-serif text-4xl tracking-tight text-foreground md:text-5xl text-balance">
            Portfolio
          </h2>
        </div>

        {/* Loading state */}
        {isLoading && <PortfolioSkeleton />}

        {/* Empty state */}
        {!isLoading && portfolioItems.length === 0 && <PortfolioEmpty />}

        {/* Content */}
        {!isLoading && portfolioItems.length > 0 && (
          <>
            {/* Category filter */}
            <div className="mb-12 flex flex-wrap gap-3">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 text-xs uppercase tracking-widest transition-all duration-300 border ${
                    activeCategory === cat
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:auto-rows-[280px]">
              {filtered.map((item) => (
                <button
                  key={item.id}
                  className={`group relative overflow-hidden ${item.span} cursor-pointer`}
                  onClick={() => setLightboxImage(item)}
                  aria-label={`View ${item.title}`}
                >
                  <Image
                    src={item.url}
                    alt={item.alt}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-background/0 transition-all duration-500 group-hover:bg-background/50" />
                  <div className="absolute inset-0 flex flex-col justify-end p-6 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                    <span className="text-xs uppercase tracking-[0.2em] text-primary">
                      {item.category}
                    </span>
                    <span className="mt-1 font-serif text-xl text-foreground">
                      {item.title}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Lightbox */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 p-6 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={`Viewing ${lightboxImage.title}`}
        >
          <button
            onClick={() => setLightboxImage(null)}
            className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Close lightbox"
          >
            <X className="h-6 w-6" />
          </button>
          <div className="relative max-h-[85vh] max-w-5xl w-full aspect-[3/2]">
            <Image
              src={lightboxImage.url}
              alt={lightboxImage.alt}
              fill
              className="object-contain"
              sizes="90vw"
            />
          </div>
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center">
            <span className="text-xs uppercase tracking-[0.2em] text-primary">
              {lightboxImage.category}
            </span>
            <p className="mt-1 font-serif text-lg text-foreground">
              {lightboxImage.title}
            </p>
            {lightboxImage.description && (
              <p className="mt-2 max-w-md text-sm text-muted-foreground">
                {lightboxImage.description}
              </p>
            )}
          </div>
        </div>
      )}
    </section>
  )
}
