import { Instagram, Youtube, Mail } from "lucide-react"

export function Footer() {
  return (
    <footer id="contact" className="border-t border-border px-6 py-24 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-16 md:grid-cols-2">
          {/* CTA */}
          <div>
            <p className="mb-3 text-sm uppercase tracking-[0.3em] text-primary">
              Contact
            </p>
            <h2 className="font-serif text-4xl tracking-tight text-foreground md:text-5xl text-balance">
              {"Let's create something together."}
            </h2>
            <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground">
              Available for freelance projects, collaborations, and
              commercial work. Based in Los Angeles, working worldwide.
            </p>
            <a
              href="mailto:hello@hplk.com"
              className="mt-8 inline-flex items-center gap-2 border border-primary bg-primary px-6 py-3 text-xs uppercase tracking-widest text-primary-foreground transition-all duration-300 hover:bg-transparent hover:text-primary"
            >
              <Mail className="h-4 w-4" />
              Get in touch
            </a>
          </div>

          {/* Links & Info */}
          <div className="flex flex-col justify-between gap-12 md:items-end md:text-right">
            <div className="space-y-4">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                Follow
              </p>
              <div className="flex gap-4 md:justify-end">
                <a
                  href="#"
                  aria-label="Instagram"
                  className="flex h-10 w-10 items-center justify-center border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  <Instagram className="h-4 w-4" />
                </a>
                <a
                  href="#"
                  aria-label="YouTube"
                  className="flex h-10 w-10 items-center justify-center border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  <Youtube className="h-4 w-4" />
                </a>
                <a
                  href="mailto:hello@hplk.com"
                  aria-label="Email"
                  className="flex h-10 w-10 items-center justify-center border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  <Mail className="h-4 w-4" />
                </a>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                hello@hplk.com
              </p>
              <p className="text-sm text-muted-foreground">
                Los Angeles, CA
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-24 flex flex-col gap-4 border-t border-border pt-8 md:flex-row md:items-center md:justify-between">
          <p className="text-lg tracking-[0.25em] font-bold uppercase text-foreground">HPLK</p>
          <p className="text-xs text-muted-foreground">
            {"All rights reserved."}
          </p>
        </div>
      </div>
    </footer>
  )
}
