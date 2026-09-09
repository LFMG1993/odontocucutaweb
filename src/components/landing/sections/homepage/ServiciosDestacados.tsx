import { Link } from "react-router-dom"
import { AnimatedSection, Button } from "@/components/shared"
import { servicios } from "@/data/siteData"
import FlipCard from "@/components/shared/FlipCard"
import { ArrowRight } from "lucide-react"

export function ServiciosDestacados() {
  return (
    <AnimatedSection className="section-padding bg-background">
      <div className="container-main">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-4">Especialidades Odontológicas</h2>
          <p className="text-text-muted text-lg">11 especialidades bajo un mismo techo, equipo multidisciplinario coordinado para tu caso.</p>
        </div>
        <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory">
          {servicios.map((servicio) => (
            <div key={servicio.slug} className="snap-center shrink-0">
              <FlipCard
                imageUrl={servicio.imagen}
                title={servicio.titulo}
                slug={servicio.slug}
                description={servicio.descripcionCorta}
                flipDirection="horizontal"
              />
            </div>
          ))}
        </div>
        <div className="text-center mt-12">
          <Button variant="outline" size="lg" asChild>
            <Link to="/servicios">Ver Todas las Especialidades <ArrowRight className="w-5 h-5 ml-2" aria-hidden="true" /></Link>
          </Button>
        </div>
      </div>
    </AnimatedSection>
  )
}
