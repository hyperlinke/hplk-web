import Image from "next/image"

export function FeaturedReel() {
  return (
    <section className="px-6 py-24 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-3 text-sm uppercase tracking-[0.3em] text-primary">
              Featured
            </p>
            <h2 className="font-serif text-4xl tracking-tight text-foreground md:text-5xl text-balance">
              Latest reel
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
            A curated selection of recent work spanning film, editorial, and
            commercial projects.
          </p>
        </div>

        {/* Cinematic banner image */}
        <div className="relative aspect-[21/9] w-full overflow-hidden">
          <Image
            src="/images/hero.jpg"
            alt="Cinematic showreel thumbnail featuring dramatic landscape"
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-background/30" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-foreground/80 bg-background/20 backdrop-blur-sm transition-transform duration-300 hover:scale-110">
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="ml-1 h-6 w-6 text-foreground"
                aria-hidden="true"
              >
                <polygon points="5,3 19,12 5,21" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
