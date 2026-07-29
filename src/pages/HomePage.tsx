import { useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/shared"
import { ArrowRight, CheckCircle, Shield, Truck, Headphones, Zap, Star, Sparkles, Users, Award, GraduationCap, MapPin, Bone, Smile, AlignCenterHorizontal, Microscope, Baby, Puzzle, HeartPulse, Brain } from "lucide-react"
import { servicios, estadisticas, testimonios } from "@/data/siteData"
import { cn } from "@/utils/cn"
import { useInView } from "@/hooks/useInView"

const iconMap = {
  Shield,
  Zap,
  Headphones,
  Truck,
  Users,
  Award,
  GraduationCap,
  MapPin,
  Smile,
  AlignCenterHorizontal,
  Bone,
  Microscope,
  Baby,
  Puzzle,
  HeartPulse,
  Brain,
} as const

const caracteristicasClinica = [
  { icon: Shield, titulo: "Bioseguridad Certificada", descripcion: "Protocolos OMS/CDC, autoclave clase B, trazabilidad completa, EPP nivel 3 para AGP." },
  { icon: Zap, titulo: "Tecnología 3D Digital", descripcion: "CBCT, escáner intraoral iTero, impresión 3D, fresado 5 ejes, cirugía guiada, DSD." },
  { icon: Headphones, titulo: "Sedación Consciente", descripcion: "Óxido nitroso, sedación endovenosa supervisada por anestesiólogo, anestesia general en quirófano." },
  { icon: Truck, titulo: "Laboratorio Propio", descripcion: "CAD/CAM interno, cerámicas E.max/Zirconia, prótesis en 24-48h, control total de calidad." },
]

const razonesElegir = [
  "Especialistas certificados con fellowships internacionales",
  "25+ años de trayectoria en Cúcuta y región",
  "Equipamiento de vanguardia (piezocirugía, láser, microscopio, navegación 3D)",
  "Financiación directa y convenios con EPS / bancos / BNPL",
  "Garantía escrita en tratamientos de alta complejidad",
  "Atención humanizada: escuchamos, explicamos, acompañamos",
]

function AnimatedSection({ children, className }: { children: React.ReactNode; className?: string }) {
  const { ref, inView } = useInView(0.1)
  return (
    <div
      ref={ref}
      className={cn("animate-fade-in", inView && "is-visible", className)}
    >
      {children}
    </div>
  )
}

const faqs = [
  {
    pregunta: "¿Cuáles son las formas de pago y opciones de financiación?",
    respuesta: "En Odontocúcuta ofrecemos financiación directa de la clínica sin interés, convenios corporativos y facilidades de pago digital (como Addi o tarjetas de crédito) para que puedas realizar tus tratamientos de forma cómoda."
  },
  {
    pregunta: "¿Atienden urgencias odontológicas?",
    respuesta: "Sí, atendemos emergencias por dolor dental, inflamación, pérdida o fractura de piezas dentales de manera prioritaria en nuestras sedes. Escríbenos por WhatsApp o llámanos para programar tu atención inmediata."
  },
  {
    pregunta: "¿Qué cubre la primera consulta de valoración?",
    respuesta: "La primera consulta incluye un diagnóstico completo por parte de nuestros especialistas, exploración clínica detallada y la formulación de tu plan de tratamiento personalizado sin ningún tipo de compromiso."
  },
  {
    pregunta: "¿Tienen convenios con empresas o EPS?",
    respuesta: "Tenemos una amplia red de convenios vigentes con EPS principales (como Nueva EPS, Salud Total, Sanitas, Sura), cajas de compensación familiar y convenios corporativos de financiación preferencial."
  }
]

export function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-linear-to-br from-background via-surface to-primary/5">
        <div className="absolute inset-0 bg-[url('/images/hero-pattern.svg')] opacity-5" aria-hidden="true" />
        <div className="container-main relative py-24 lg:py-40">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" aria-hidden="true" />
              <span>Clínica Odontológica #1 en Cúcuta • 25+ Años de Experiencia</span>
            </div>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight text-balance mb-6">
              Tu Sonrisa, Nuestra
              <span className="text-primary"> Pasión</span>
            </h1>
            <p className="text-lg sm:text-xl text-text-muted max-w-2xl mx-auto mb-10 leading-relaxed">
              Odontología integral de alta complejidad con tecnología 3D, especialistas certificados y trato humano.
              Recupera tu salud, función y estética dental en un solo lugar.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Button size="xl" asChild className="w-full sm:w-auto">
                <Link to="/cita">Agendar Mi Cita <ArrowRight className="w-5 h-5 ml-2" aria-hidden="true" /></Link>
              </Button>
              <Button size="xl" variant="outline" asChild className="w-full sm:w-auto">
                <Link to="/servicios">Ver Nuestros Servicios</Link>
              </Button>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-text-muted">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-primary" aria-hidden="true" />
                <span>Primera valoración sin compromiso</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-primary" aria-hidden="true" />
                <span>Financiación 0% interés hasta 24 meses</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-primary" aria-hidden="true" />
                <span>4 sedes en Norte de Santander</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Estadísticas */}
      <AnimatedSection className="section-padding bg-surface border-y border-border">
        <div className="container-main">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {estadisticas.map((stat) => {
              const Icon = iconMap[stat.icono as keyof typeof iconMap] || Shield
              return (
                <div key={stat.label} className="text-center">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 text-primary mb-4" aria-hidden="true">
                    <Icon className="w-7 h-7" />
                  </div>
                  <div className="font-heading text-3xl sm:text-4xl font-bold text-text">{stat.valor}</div>
                  <div className="text-sm text-text-muted mt-1">{stat.label}</div>
                </div>
              )
            })}
          </div>
        </div>
      </AnimatedSection>

      {/* Servicios Destacados */}
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

      {/* Por qué elegirnos */}
      <AnimatedSection className="section-padding bg-surface border-y border-border">
        <div className="container-main">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-6">¿Por qué elegir Odontocúcuta?</h2>
              <p className="text-text-muted text-lg mb-8">Más que una clínica dental, somos tu aliado en salud bucal integral. Cada paciente recibe un plan personalizado, explicado con claridad y ejecutado con excelencia.</p>
              <ul className="space-y-4" role="list">
                {razonesElegir.map((razon, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-primary" aria-hidden="true" />
                    </div>
                    <span className="text-text mt-1">{razon}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {caracteristicasClinica.map((item, i) => (
                <div key={i} className="bg-white p-6 rounded-xl border border-border hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4" aria-hidden="true">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-heading text-lg font-semibold mb-2">{item.titulo}</h3>
                  <p className="text-text-muted text-sm">{item.descripcion}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Testimonios */}
      <AnimatedSection className="section-padding">
        <div className="container-main">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-4">Lo que dicen nuestros pacientes</h2>
            <p className="text-text-muted text-lg">Más de 45,000 sonrisas transformadas. Estas son algunas de sus historias.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonios.map((testimonio) => (
              <article key={testimonio.id} className="bg-white rounded-2xl border border-border p-6 hover:shadow-lg transition-shadow">
                <div className="flex gap-1 mb-4" aria-label={`Calificación ${testimonio.rating} de 5 estrellas`}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={cn("w-5 h-5", i < testimonio.rating ? "fill-yellow-400 text-yellow-400" : "text-border")} aria-hidden="true" />
                  ))}
                </div>
                <p className="text-text mb-4 leading-relaxed">"{testimonio.texto}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-medium text-text">{testimonio.nombre}</p>
                    <p className="text-sm text-text-muted">{testimonio.tratamiento}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* FAQ Accordion Section */}
      <FAQSection />

      {/* CTA Final */}
      <AnimatedSection className="section-padding bg-primary text-white">
        <div className="container-main text-center">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-4 text-white">¿Listo para transformar tu sonrisa?</h2>
          <p className="text-primary-100 text-lg max-w-2xl mx-auto mb-8">Agenda tu primera valoración sin compromiso. Te escuchamos, te explicamos y diseñamos el mejor plan para ti.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="xl" variant="secondary" asChild className="w-full sm:w-auto">
              <Link to="/cita">Agendar Mi Cita <ArrowRight className="w-5 h-5 ml-2" aria-hidden="true" /></Link>
            </Button>
            <Button size="xl" variant="ghost" className="w-full sm:w-auto border border-white/30 hover:bg-white/10 text-white" asChild>
              <Link to="/contacto">WhatsApp: 318 144 1442</Link>
            </Button>
          </div>
        </div>
      </AnimatedSection>
    </div>
  )
}

function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  return (
    <AnimatedSection className="section-padding bg-surface border-y border-border">
      <div className="container-main max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-4">Preguntas Frecuentes</h2>
          <p className="text-text-muted text-lg">Todo lo que necesitas saber antes de tu consulta diagnóstica.</p>
        </div>
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index
            return (
              <div key={index} className="bg-white rounded-2xl border border-border overflow-hidden transition-all duration-300 hover:shadow-md">
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full px-6 py-5 text-left font-semibold text-lg flex items-center justify-between hover:text-primary transition-colors focus:outline-hidden cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="font-heading text-base sm:text-lg text-text">{faq.pregunta}</span>
                  <span className={cn("text-primary text-2xl font-light transition-transform duration-300 leading-none", isOpen && "rotate-45")}>+</span>
                </button>
                <div className={cn("px-6 transition-all duration-300 ease-in-out overflow-hidden", isOpen ? "max-h-60 pb-5 opacity-100" : "max-h-0 opacity-0")}>
                  <p className="text-text-muted text-sm sm:text-base leading-relaxed">{faq.respuesta}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </AnimatedSection>
  )
}