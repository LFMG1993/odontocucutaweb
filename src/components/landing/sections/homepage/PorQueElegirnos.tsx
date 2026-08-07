import { AnimatedSection } from "@/components/shared"
import { CheckCircle, Shield, Zap, Headphones, Truck } from "lucide-react"

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

export function PorQueElegirnos() {
  return (
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
  )
}
