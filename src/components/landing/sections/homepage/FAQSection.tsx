import { useState } from "react"
import { AnimatedSection } from "@/components/shared"
import { cn } from "@/utils/cn"

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

export function FAQSection() {
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
