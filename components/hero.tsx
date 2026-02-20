import Image from "next/image"
import { ArrowDown } from "lucide-react"

export function Hero() {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      <Image
        src="/api/blob-image?pathname=HPL03460.jpg"
        alt="Cinematic landscape photograph showcasing dramatic mountain silhouette at golden hour"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-background/60" />

      <div className="relative z-10 flex h-full flex-col justify-end px-6 pb-20 lg:px-12">
        <div className="mx-auto w-full max-w-7xl">
          <p className="mb-4 text-sm uppercase tracking-[0.3em] text-primary">
            HPLK
          </p>
          <h1 className="font-serif text-5xl leading-tight tracking-tight text-foreground md:text-7xl lg:text-8xl text-balance">
            Capturing moments
            <br />
            that move.
          </h1>
          <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground">
            Visual storytelling through cinema and photography.
            Every frame is intentional. Every story, authentic.
          </p>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <a
            href="#work"
            aria-label="Scroll to work section"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border/50 text-muted-foreground transition-colors hover:border-primary hover:text-primary"
          >
            <ArrowDown className="h-4 w-4 animate-bounce" />
          </a>
        </div>
      </div>
    </section>
  )
}
