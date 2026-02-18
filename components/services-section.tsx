import { Camera, Film, Aperture, MonitorPlay } from "lucide-react"

const services = [
  {
    icon: Camera,
    title: "Photography",
    description:
      "Portraits, landscapes, editorial, and commercial photography. Shot with intention, edited with care.",
  },
  {
    icon: Film,
    title: "Videography",
    description:
      "Cinematic films, brand videos, and documentary-style storytelling. From concept to color grade.",
  },
  {
    icon: Aperture,
    title: "Wedding & Events",
    description:
      "Authentic moments captured with a cinematic eye. Timeless imagery for your most important days.",
  },
  {
    icon: MonitorPlay,
    title: "Post-Production",
    description:
      "Color grading, retouching, and editing. Crafting the final visual narrative with precision.",
  },
]

export function ServicesSection() {
  return (
    <section id="services" className="px-6 py-24 lg:px-12 bg-card">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-16">
          <p className="mb-3 text-sm uppercase tracking-[0.3em] text-primary">
            Services
          </p>
          <h2 className="font-serif text-4xl tracking-tight text-foreground md:text-5xl text-balance">
            What I offer
          </h2>
        </div>

        {/* Services grid */}
        <div className="grid grid-cols-1 gap-px bg-border md:grid-cols-2">
          {services.map((service) => (
            <div
              key={service.title}
              className="group bg-card p-10 transition-colors duration-500 hover:bg-secondary"
            >
              <service.icon className="h-5 w-5 text-primary" />
              <h3 className="mt-6 font-serif text-2xl text-foreground">
                {service.title}
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
