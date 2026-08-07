import { AnimatedSection } from "@/components/shared"
import { testimonios } from "@/data/siteData"
import { cn } from "@/utils/cn"
import { Star } from "lucide-react"

export function TestimoniosSection() {
  return (
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
                  <div className="w-full h-full bg-linear-to-br from-primary/20 to-secondary/20" aria-hidden="true" />
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
  )
}
