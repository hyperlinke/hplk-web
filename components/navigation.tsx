"use client"

import { useState } from "react"
import Image from "next/image"
import { Menu, X } from "lucide-react"

const navLinks = [
  { label: "work", href: "#work" },
  { label: "about", href: "#about" },
  { label: "services", href: "#services" },
  { label: "contact", href: "#contact" },
]

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="relative flex h-16 items-center">
          {/* Desktop nav - left aligned */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300 tracking-wide"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Logo - centered */}
          <a href="#" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" aria-label="HPLK Home">
            <Image
              src="/images/logo.png"
              alt="HPLK logo"
              width={36}
              height={36}
              className="h-9 w-9 object-contain"
              priority
            />
          </a>

          {/* Mobile toggle - right aligned */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden ml-auto text-foreground"
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-background border-t border-border/50">
          <div className="px-6 py-6 flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300 tracking-wide"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}
