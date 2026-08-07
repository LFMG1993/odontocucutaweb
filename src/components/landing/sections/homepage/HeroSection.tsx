import { Link } from "react-router-dom"
import { Button } from "@/components/shared"
import { ArrowRight, CheckCircle, Sparkles } from "lucide-react"
import { useCitaModal } from "@/context/CitaModalContext"

export function HeroSection() {
  const { openCitaModal } = useCitaModal()
  return (
    <section className="relative overflow-hidden bg-linear-to-br from-background via-surface to-primary/5">
      <div className="absolute inset-0 bg-[url('/images/hero-pattern.svg')] opacity-5" aria-hidden="true" />
      <div className="container-main relative py-24 lg:py-40">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" aria-hidden="true" />
            <span>Clínica Odontológica en Cúcuta • Desde 1992</span>
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
            <Button size="xl" onClick={openCitaModal} className="w-full sm:w-auto">
              Agendar Mi Cita <ArrowRight className="w-5 h-5 ml-2" aria-hidden="true" />
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
  )
}
