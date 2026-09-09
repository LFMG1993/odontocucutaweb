import { Link } from "react-router-dom"
import { Button } from "@/components/shared"
import { ArrowRight, CheckCircle, Smile, AlignCenterHorizontal, Bone, Microscope, Baby, Puzzle, HeartPulse, Brain, Calendar } from "lucide-react"
import { servicios } from "@/data/siteData"

const iconMap = {
   Smile,
   AlignCenterHorizontal,
   Bone,
   Microscope,
   Baby,
   Puzzle,
   HeartPulse,
   Brain,
   Tooth: Smile,
   Scalpel: Bone
} as const

export function ServiciosPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative bg-linear-to-br from-background via-surface to-primary/5 py-24 lg:py-36">
        <div className="container-main text-center">
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-balance mb-6">
            Especialidades
            <span className="text-primary"> Odontológicas</span>
          </h1>
          <p className="text-lg sm:text-xl text-text-muted max-w-2xl mx-auto">
            9 especialidades bajo un mismo techo. Equipo multidisciplinario coordinado para resolver tu caso con la máxima excelencia.
          </p>
        </div>
      </section>

      {/* Grid de Servicios */}
      <section className="section-padding">
        <div className="container-main">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {servicios.map((servicio) => {
              const Icon = iconMap[servicio.icono as keyof typeof iconMap] || Smile
              return (
                <article key={servicio.slug} className="group relative bg-white rounded-2xl border border-border overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  <div className="relative h-56 bg-gradient-to-br from-primary/10 to-secondary/10 overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Icon className="w-20 h-20 text-primary/50 group-hover:scale-110 transition-transform duration-300" aria-hidden="true" />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent" aria-hidden="true" />
                  </div>
                  <div className="p-6">
                    <h3 className="font-heading text-xl font-semibold mb-2">{servicio.titulo}</h3>
                    <p className="text-text-muted text-sm mb-4 line-clamp-2">{servicio.descripcionCorta}</p>
                    <ul className="space-y-2 mb-4" role="list">
                      {servicio.caracteristicas.slice(0, 4).map((carac, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-text-muted">
                          <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" aria-hidden="true" />
                          {carac}
                        </li>
                      ))}
                    </ul>
                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <span className="text-sm font-medium text-primary">{servicio.precioDesde}</span>
                      <Link
                        to={`/servicios/${servicio.slug}`}
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary-hover transition-colors"
                      >
                        Ver más <ArrowRight className="w-4 h-4" aria-hidden="true" />
                      </Link>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      {/* Detalle de cada servicio */}
      <section className="section-padding bg-surface">
        <div className="container-main">
          {servicios.map((servicio, index) => {
            const Icon = iconMap[servicio.icono as keyof typeof iconMap] || Smile
            return (
              <article key={servicio.slug} className="mb-20 last:mb-0" id={servicio.slug}>
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                  <div className={index % 2 === 0 ? "" : "lg:order-last"}>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                      <Icon className="w-4 h-4" aria-hidden="true" />
                      <span>Especialidad</span>
                    </div>
                    <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-4">{servicio.titulo}</h2>
                    <p className="text-text-muted text-lg mb-6 leading-relaxed">{servicio.descripcionLarga}</p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                      {servicio.caracteristicas.map((carac, i) => (
                        <div key={i} className="flex items-center gap-2 p-3 bg-white rounded-lg border border-border">
                          <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" aria-hidden="true" />
                          <span className="text-sm text-text">{carac}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      <div className="flex items-center gap-1.5 text-text-muted">
                        <Calendar className="w-4 h-4" aria-hidden="true" />
                        <span>Duración: {servicio.duracion}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-primary font-medium">
                        <span>Desde {servicio.precioDesde}</span>
                      </div>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center overflow-hidden">
                      <Icon className="w-32 h-32 text-primary/30" aria-hidden="true" />
                    </div>
                    <div className="absolute -bottom-4 -right-4 md:-bottom-6 md:-right-6 w-32 h-32 rounded-2xl bg-primary/10 flex items-center justify-center" aria-hidden="true">
                      <Icon className="w-16 h-16 text-primary" />
                    </div>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-primary text-white">
        <div className="container-main text-center">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-4">¿Necesitas ayuda para elegir?</h2>
          <p className="text-primary-100 text-lg max-w-2xl mx-auto mb-8">Nuestro equipo de coordinación clínica te guiará según tu caso. Primera valoración sin compromiso.</p>
          <Button size="xl" variant="secondary" asChild>
            <Link to="/cita">Agendar Valoración <ArrowRight className="w-5 h-5 ml-2" aria-hidden="true" /></Link>
          </Button>
        </div>
      </section>
    </div>
  )
}