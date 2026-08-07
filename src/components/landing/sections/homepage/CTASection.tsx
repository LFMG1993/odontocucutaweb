import { AnimatedSection, Button } from "@/components/shared"
import { ArrowRight } from "lucide-react"
import { useCitaModal } from "@/context/CitaModalContext"

export function CTASection() {
  const { openCitaModal } = useCitaModal()
  return (
    <AnimatedSection className="section-padding bg-primary text-white">
      <div className="container-main text-center">
        <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-4 text-white">¿Listo para transformar tu sonrisa?</h2>
        <p className="text-primary-100 text-lg max-w-2xl mx-auto mb-8">Agenda tu primera valoración sin compromiso. Te escuchamos, te explicamos y diseñamos el mejor plan para ti.</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button size="xl" variant="secondary" onClick={openCitaModal} className="w-full sm:w-auto">
            Agendar Mi Cita <ArrowRight className="w-5 h-5 ml-2" aria-hidden="true" />
          </Button>
          <Button size="xl" variant="ghost" className="w-full sm:w-auto border border-white/30 hover:bg-white/10 text-white" asChild>
            <a href="https://wa.me/573181441442" target="_blank" rel="noopener noreferrer">
              WhatsApp: 318 144 1442
            </a>
          </Button>
        </div>
      </div>
    </AnimatedSection>
  )
}
