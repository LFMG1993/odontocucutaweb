import { AnimatedSection } from "@/components/shared"
import { estadisticas, iconMap } from "@/data/siteData"
import { Shield } from "lucide-react"

export function StatsSection() {
  return (
    <AnimatedSection className="section-padding bg-surface">
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
  )
}
