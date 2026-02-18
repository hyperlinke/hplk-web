"use client"

import Image from "next/image"
import { useState } from "react"
import { X } from "lucide-react"

const portfolioItems = [
  {
    src: "/images/portrait-1.jpg",
    alt: "Moody cinematic portrait with golden window light",
    category: "Portrait",
    title: "Golden Hour",
    span: "md:col-span-2 md:row-span-2",
  },
  {
    src: "/images/landscape-1.jpg",
    alt: "Dramatic ocean waves crashing against dark volcanic rocks",
    category: "Landscape",
    title: "Coastal Fury",
    span: "md:col-span-1 md:row-span-1",
  },
  {
    src: "/images/urban-1.jpg",
    alt: "Cinematic night cityscape with neon reflections",
    category: "Urban",
    title: "Neon Nights",
    span: "md:col-span-1 md:row-span-1",
  },
  {
    src: "/images/nature-1.jpg",
    alt: "Ethereal misty forest with sunbeams filtering through trees",
    category: "Nature",
    title: "Morning Mist",
    span: "md:col-span-1 md:row-span-2",
  },
  {
    src: "/images/wedding-1.jpg",
    alt: "Elegant couple silhouette against warm sunset light",
    category: "Wedding",
    title: "Eternal Light",
    span: "md:col-span-1 md:row-span-1",
  },
  {
    src: "/images/architecture-1.jpg",
    alt: "Dramatic minimalist architecture with strong geometric lines",
    category: "Architecture",
    title: "Structure",
    span: "md:col-span-1 md:row-span-1",
  },
  {
    src: "/images/detail-1.jpg",
    alt: "Macro close-up of water droplets on a dark leaf",
    category: "Detail",
    title: "Clarity",
    span: "md:col-span-2 md:row-span-1",
  },
]

const categories = ["All", "Portrait", "Landscape", "Urban", "Nature", "Wedding", "Architecture", "Detail"]

export function PortfolioGrid() {
  const [activeCategory, setActiveCategory] = useState("All")
  const [lightboxImage, setLightboxImage] = useState<typeof portfolioItems[0] | null>(null)

  const filtered = activeCategory === "All"
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
              key={item.title}
              className={`group relative overflow-hidden ${item.span} cursor-pointer`}
              onClick={() => setLightboxImage(item)}
              aria-label={`View ${item.title}`}
            >
              <Image
                src={item.src}
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
              src={lightboxImage.src}
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
          </div>
        </div>
      )}
    </section>
  )
}
