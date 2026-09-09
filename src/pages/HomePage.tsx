import {
  HeroSection,
  StatsSection,
  ServiciosDestacados,
  PorQueElegirnos,
  TestimoniosSection,
  FAQSection,
} from "@/components/landing/sections/homepage"
import { SEO } from "@/components/shared"

export function HomePage() {
  return (
    <div className="min-h-screen">
      <SEO
        title="Clínica Odontológica en Cúcuta"
        description="OdontoCúcuta S.A.: asistencia odontológica completa. Ortodoncia, implantología, endodoncia, cirugía maxilofacial y más en Cúcuta, con 4 sedes en Norte de Santander. Agenda tu valoración sin compromiso."
        canonicalUrl="/"
      />
      <HeroSection />
      <StatsSection />
      <ServiciosDestacados />
      <PorQueElegirnos />
      <TestimoniosSection />
      <FAQSection />
    </div>
  )
}
