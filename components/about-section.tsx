import Image from "next/image"

export function AboutSection() {
  return (
    <section id="about" className="px-6 py-24 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-16 md:grid-cols-2 md:items-center">
          {/* Image */}
          <div className="relative aspect-[4/5] overflow-hidden">
            <Image
              src="/images/portrait-1.jpg"
              alt="Portrait of the photographer in studio environment"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 border border-border/30" />
          </div>

          {/* Content */}
          <div>
            <p className="mb-3 text-sm uppercase tracking-[0.3em] text-primary">
              About
            </p>
            <h2 className="font-serif text-4xl tracking-tight text-foreground md:text-5xl text-balance">
              Every frame tells a story
            </h2>
            <div className="mt-8 space-y-5 text-base leading-relaxed text-muted-foreground">
              <p>
                With over a decade behind the lens, I specialize in creating
                cinematic visuals that connect emotion to imagery. From
                intimate portraits to sweeping landscapes, my work lives at
                the intersection of art and authenticity.
              </p>
              <p>
                Based in Los Angeles, I work with brands, couples, and
                creatives who value intentional storytelling. My approach is
                minimal, my process is collaborative, and every project
                begins with listening.
              </p>
            </div>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-3 gap-8 border-t border-border pt-12">
              <div>
                <p className="font-serif text-3xl text-foreground">10+</p>
                <p className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">
                  Years
                </p>
              </div>
              <div>
                <p className="font-serif text-3xl text-foreground">200+</p>
                <p className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">
                  Projects
                </p>
              </div>
              <div>
                <p className="font-serif text-3xl text-foreground">15</p>
                <p className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">
                  Countries
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
