import { Navigation } from "@/components/navigation"
import { Hero } from "@/components/hero"
import { PortfolioGrid } from "@/components/portfolio-grid"
import { FeaturedReel } from "@/components/featured-reel"
import { AboutSection } from "@/components/about-section"
import { ServicesSection } from "@/components/services-section"
import { Footer } from "@/components/footer"

export default function Page() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <Hero />
      <PortfolioGrid />
      <FeaturedReel />
      <AboutSection />
      <ServicesSection />
      <Footer />
    </main>
  )
}
