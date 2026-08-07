import { Link } from "react-router-dom"
import { AnimatedSection, Button } from "@/components/shared"
import { servicios, iconMap } from "@/data/siteData"
import { ArrowRight, CheckCircle, MapPin } from "lucide-react"

export function ServiciosDestacados() {
  return (
    <AnimatedSection className="section-padding">
      <div className="container-main">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-4">Especialidades Odontológicas</h2>
          <p className="text-text-muted text-lg">9 especialidades bajo un mismo techo, equipo multidisciplinario coordinado para tu caso.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {servicios.slice(0, 6).map((servicio) => {
            const Icon = iconMap[servicio.icono as keyof typeof iconMap] || MapPin
            return (
              <article key={servicio.slug} className="group relative bg-white rounded-2xl border border-border overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <div className="relative h-48 bg-linear-to-br from-primary/10 to-secondary/10 overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Icon className="w-16 h-16 text-primary/50 group-hover:scale-110 transition-transform duration-300" aria-hidden="true" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-16 bg-linear-to-t from-white to-transparent" aria-hidden="true" />
                </div>
                <div className="p-6">
                  <h3 className="font-heading text-xl font-semibold mb-2">{servicio.titulo}</h3>
                  <p className="text-text-muted text-sm mb-4 line-clamp-2">{servicio.descripcionCorta}</p>
                  <ul className="space-y-2 mb-4" role="list">
                    {servicio.caracteristicas.slice(0, 3).map((carac, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-text-muted">
                        <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" aria-hidden="true" />
                        {carac}
                      </li>
                    ))}
                  </ul>
                  <Link
                    to={`/servicios/${servicio.slug}`}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary-hover transition-colors"
                  >
                    Ver detalles <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </Link>
                </div>
              </article>
            )
          })}
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
