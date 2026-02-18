"use client"

import { useState } from "react"
import { ExternalLink } from "lucide-react"

export function LightroomSection() {
  const [albumUrl, setAlbumUrl] = useState("")
  const [isEmbedded, setIsEmbedded] = useState(false)

  return (
    <section className="px-6 py-24 lg:px-12 bg-card">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16">
          <p className="mb-3 text-sm uppercase tracking-[0.3em] text-primary">
            Lightroom Cloud
          </p>
          <h2 className="font-serif text-4xl tracking-tight text-foreground md:text-5xl text-balance">
            Browse the full gallery
          </h2>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground">
            Explore the complete collection directly from Adobe Lightroom. 
            Full-resolution images, curated albums, and behind-the-scenes edits.
          </p>
        </div>

        {isEmbedded && albumUrl ? (
          <div className="w-full overflow-hidden border border-border">
            <iframe
              src={albumUrl}
              title="Adobe Lightroom Gallery"
              className="h-[500px] w-full border-0 md:h-[700px]"
              loading="lazy"
              allowFullScreen
            />
          </div>
        ) : (
          <div className="border border-border bg-secondary/50 p-12 md:p-20">
            <div className="mx-auto max-w-lg text-center">
              <div className="mb-8 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center border border-border">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-6 w-6 text-primary"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path d="M2 12l4-8h12l4 8-4 8H6L2 12z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </div>
              </div>
              <h3 className="font-serif text-2xl text-foreground">
                Connect your Lightroom
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Paste your shared Adobe Lightroom album URL below to embed
                your gallery directly on the site.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <input
                  type="url"
                  value={albumUrl}
                  onChange={(e) => setAlbumUrl(e.target.value)}
                  placeholder="https://lightroom.adobe.com/shares/..."
                  className="flex-1 border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                />
                <button
                  onClick={() => {
                    if (albumUrl) setIsEmbedded(true)
                  }}
                  className="flex items-center justify-center gap-2 border border-primary bg-primary px-6 py-3 text-xs uppercase tracking-widest text-primary-foreground transition-all duration-300 hover:bg-transparent hover:text-primary"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Embed
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
