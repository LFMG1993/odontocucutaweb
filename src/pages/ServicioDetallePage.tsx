import { Link } from "react-router-dom"
import { Button } from "@/components/shared"
import { ArrowRight, CheckCircle, Calendar, Clock, MapPin, ArrowLeft, Star } from "lucide-react"
import { useParams } from "react-router-dom"
import { servicios, equipoMedico, testimonios } from "@/data/siteData"
import { cn } from "@/utils/cn"

const iconMap = {
  Tooth: "Tooth",
  Scalpel: "Scalpel",
  Smile: "Smile",
  AlignCenterHorizontal: "AlignCenterHorizontal",
  Bone: "Bone",
  Microscope: "Microscope",
  Baby: "Baby",
  Puzzle: "Puzzle",
  HeartPulse: "HeartPulse",
  Brain: "Brain",
} as const

export function ServicioDetallePage() {
  const { slug } = useParams<{ slug: string }>()
  const servicio = servicios.find(s => s.slug === slug)

  if (!servicio) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-surface to-primary/5">
        <div className="text-center">
          <h1 className="font-heading text-3xl font-bold mb-4">Servicio no encontrado</h1>
          <Button asChild><Link to="/servicios">Ver todos los servicios</Link></Button>
        </div>
      </div>
    )
  }

  const IconName = iconMap[servicio.icono as keyof typeof iconMap] || "Tooth"

  return (
    <div className="min-h-screen">
      {/* Hero del Servicio */}
      <section className="relative bg-gradient-to-br from-background via-surface to-primary/5 py-16 lg:py-24">
        <div className="container-main">
          <div className="max-w-4xl">
            <Link to="/servicios" className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-primary transition-colors mb-6">
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              Volver a Servicios
            </Link>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <span className="capitalize">{IconName.toLowerCase()}</span>
              <span>Especialidad</span>
            </div>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-balance mb-6">
              {servicio.titulo}
            </h1>
            <p className="text-lg sm:text-xl text-text-muted max-w-2xl leading-relaxed">
              {servicio.descripcionCorta}
            </p>
          </div>
        </div>
      </section>

      {/* Info Rápida */}
      <section className="py-6 bg-white border-b border-border sticky top-16 z-40">
        <div className="container-main">
          <div className="flex flex-wrap items-center gap-6 text-sm">
            <div className="flex items-center gap-2 text-text-muted">
              <Calendar className="w-4 h-4" aria-hidden="true" />
              <span>Duración: {servicio.duracion}</span>
            </div>
            <div className="flex items-center gap-2 text-primary font-medium">
              <span>Desde {servicio.precioDesde}</span>
            </div>
            <div className="flex items-center gap-2 text-text-muted">
              <MapPin className="w-4 h-4" aria-hidden="true" />
              <span>4 sedes disponibles</span>
            </div>
            <div className="flex items-center gap-2 text-text-muted">
              <Clock className="w-4 h-4" aria-hidden="true" />
              <span>Citas: 7 AM - 7 PM</span>
            </div>
          </div>
        </div>
      </section>

      {/* Contenido Principal */}
      <section className="section-padding">
        <div className="container-main">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contenido principal */}
            <div className="lg:col-span-2 space-y-12">
              {/* Descripción completa */}
              <article className="prose prose-slate max-w-none">
                <h2 className="font-heading text-2xl font-bold mb-4">¿En qué consiste?</h2>
                <div className="text-text-muted leading-relaxed whitespace-pre-line">{servicio.descripcionLarga}</div>
              </article>

              {/* Características */}
              <article>
                <h2 className="font-heading text-2xl font-bold mb-6">Tratamientos y Procedimientos</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {servicio.caracteristicas.map((carac, i) => (
                    <div key={i} className="flex items-start gap-3 p-4 bg-white rounded-xl border border-border hover:shadow-md transition-shadow">
                      <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" aria-hidden="true" />
                      <span className="text-text">{carac}</span>
                    </div>
                  ))}
                </div>
              </article>

              {/* Beneficios */}
              <article>
                <h2 className="font-heading text-2xl font-bold mb-6">Beneficios para ti</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {servicio.beneficios.map((beneficio, i) => (
                    <div key={i} className="flex items-start gap-3 p-4 bg-surface rounded-xl border border-border">
                      <Star className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" aria-hidden="true" />
                      <span className="text-text">{beneficio}</span>
                    </div>
                  ))}
                </div>
              </article>

              {/* Especialistas relacionados */}
              <article>
                <h2 className="font-heading text-2xl font-bold mb-6">Especialistas en esta área</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {equipoMedico.filter(d => servicio.caracteristicas.some(c => d.especialidad.includes(c.split(" ")[0])) || d.especialidad.toLowerCase().includes(servicio.titulo.toLowerCase().split(" ")[0])).slice(0, 4).map((doctor) => (
                    <Link key={doctor.id} to="/nosotros#equipo" className="flex items-center gap-4 p-4 bg-white rounded-xl border border-border hover:shadow-md transition-shadow group">
                      <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <div className="w-8 h-8 rounded-full bg-primary/20" aria-hidden="true" />
                      </div>
                      <div>
                        <p className="font-medium text-text group-hover:text-primary transition-colors">{doctor.nombre}</p>
                        <p className="text-sm text-text-muted">{doctor.especialidad}</p>
                        <p className="text-xs text-text-muted">{doctor.experiencia} de experiencia</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </article>
            </div>

            {/* Sidebar - CTA y Testimonios */}
            <div className="space-y-6">
              <div className="sticky top-24 bg-primary text-white rounded-2xl p-6 lg:p-8">
                <h3 className="font-heading text-xl sm:text-2xl font-bold mb-3">¿Listo para empezar?</h3>
                <p className="text-primary-100 mb-6">Agenda tu valoración diagnóstica sin compromiso. Te explicamos todo y diseñamos tu plan personalizado.</p>
                <Button size="lg" variant="secondary" className="w-full sm:w-auto mb-3" asChild>
                  <Link to="/cita">Agendar Mi Cita <ArrowRight className="w-5 h-5 ml-2" aria-hidden="true" /></Link>
                </Button>
                <Button size="lg" variant="ghost" className="w-full sm:w-auto border-white/30 hover:bg-white/10" asChild>
                  <Link to="/contacto">WhatsApp: 318 144 1442</Link>
                </Button>
              </div>

              <div className="sticky top-24 hidden lg:block bg-white rounded-2xl border border-border p-6">
                <h3 className="font-heading text-lg font-semibold mb-4">Pacientes que eligieron este tratamiento</h3>
                <div className="space-y-4">
                  {testimonios.filter(t => servicio.caracteristicas.some(c => t.tratamiento.toLowerCase().includes(c.toLowerCase().split(" ")[0]))).slice(0, 3).map((testimonio) => (
                    <div key={testimonio.id} className="p-4 bg-surface rounded-xl border border-border">
                      <div className="flex gap-0.5 mb-2" aria-label={`Calificación ${testimonio.rating} de 5`}>
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={cn("w-4 h-4", i < testimonio.rating ? "fill-yellow-400 text-yellow-400" : "text-border")} aria-hidden="true" />
                        ))}
                      </div>
                      <p className="text-sm text-text mb-2">"{testimonio.texto.substring(0, 120)}..."</p>
                      <p className="text-xs font-medium text-text">{testimonio.nombre}</p>
                      <p className="text-xs text-text-muted">{testimonio.tratamiento}</p>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4" asChild>
                  <Link to="/nosotros#testimonios">Ver más testimonios</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="section-padding bg-primary text-white">
        <div className="container-main text-center">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-4">Tu sonrisa merece lo mejor</h2>
          <p className="text-primary-100 text-lg max-w-2xl mx-auto mb-8">Especialistas certificados, tecnología 3D y trato humano. Agenda tu cita hoy.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="xl" variant="secondary" asChild>
              <Link to="/cita">Agendar Valoración <ArrowRight className="w-5 h-5 ml-2" aria-hidden="true" /></Link>
            </Button>
            <Button size="xl" variant="ghost" className="w-full sm:w-auto border-white/30 hover:bg-white/10" asChild>
              <Link to="/contacto">Contactar por WhatsApp</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}