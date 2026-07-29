import { Link } from "react-router-dom"
import { Button } from "@/components/shared"
import { ArrowRight, Users, Award, GraduationCap, MapPin, Stethoscope, Building2, HeartHandshake, BookOpen, Calendar } from "lucide-react"
import { equipoMedico, sedes } from "@/data/siteData"
import { cn } from "@/utils/cn"

const valores = [
  { icon: HeartHandshake, titulo: "Humanismo", descripcion: "Tratamos personas, no dientes. Escucha activa, explicación clara, consentimiento informado real." },
  { icon: Award, titulo: "Excelencia Clínica", descripcion: "Especialistas con fellowships internacionales, educación continua obligatoria, protocolos basados en evidencia." },
  { icon: Stethoscope, titulo: "Seguridad Total", descripcion: "Bioseguridad nivel hospitalario, quirófano propio, sedación supervisada, trazabilidad completa." },
  { icon: Building2, titulo: "Tecnología Propia", descripcion: "CBCT, iTero, láser, piezo, microscopio, CAD/CAM interno, navegación 3D. Sin derivaciones externas." },
  { icon: BookOpen, titulo: "Docencia e Investigación", descripcion: "Profesores universitarios, publicaciones indexadas, formación de residentes, innovación constante." },
  { icon: Users, titulo: "Trabajo en Equipo", descripcion: "Juntas clínicas semanales, planificación multidisciplinaria, segunda opinión interna sistemática." },
]

const historia = [
  { año: "1999", titulo: "Fundación", descripcion: "Dr. Carlos Ramírez funda la primera sede en Barrio Caobos con visión de odontología integral." },
  { año: "2005", titulo: "Expansión", descripcion: "Apertura Sede Libertad. Incorporación de ortodoncia y cirugía maxilofacial." },
  { año: "2012", titulo: "Digitalización", descripcion: "Primera clínica en la región con CBCT y CAD/CAM. Inicio de implantes guiados." },
  { año: "2018", titulo: "Especialización Total", descripcion: "Equipo completo de 9 especialistas. Certificación en sedación y quirófano propio." },
  { año: "2022", titulo: "Nueva Era", descripcion: "Sedes Atalaya y Pamplona. Navegación 3D, DSD, laboratorio digital 5 ejes, teleodontología." },
  { año: "2024", titulo: "Líderes Regionales", descripcion: "45,000+ pacientes, 3,200+ implantes, referentes en Norte de Santander y Venezuela." },
]

export function NosotrosPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-background via-surface to-primary/5 py-24 lg:py-40">
        <div className="container-main">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Users className="w-4 h-4" aria-hidden="true" />
              <span>Conoce a nuestro equipo multidisciplinario</span>
            </div>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-balance mb-6">
              25+ Años Transformando
              <span className="text-primary"> Sonrisas</span>
            </h1>
            <p className="text-lg sm:text-xl text-text-muted max-w-2xl mx-auto leading-relaxed">
              Somos la clínica odontológica de referencia en Norte de Santander. Nueve especialidades, tecnología 3D de vanguardia y un equipo humano que pone tu bienestar por encima de todo.
            </p>
          </div>
        </div>
      </section>

      {/* Historia / Timeline */}
      <section className="section-padding bg-surface border-y border-border">
        <div className="container-main">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-4">Nuestra Historia</h2>
            <p className="text-text-muted text-lg">Más de dos décadas de compromiso inquebrantable con la excelencia odontológica.</p>
          </div>
          <div className="relative max-w-3xl mx-auto">
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-primary/20 -translate-x-1/2" aria-hidden="true" />
            <div className="space-y-12 relative">
              {historia.map((item, i) => (
                <div key={item.año} className={cn("relative flex items-start gap-6", i % 2 === 0 ? "lg:pr-20" : "lg:pl-20 lg:flex-row-reverse")}>
                  <div className={cn("absolute lg:absolute lg:left-1/2 w-6 h-6 rounded-full bg-primary border-4 border-white z-10", i % 2 === 0 ? "lg:-translate-x-1/2 -translate-y-1/2 top-2" : "lg:-translate-x-1/2 -translate-y-1/2 top-2")} aria-hidden="true" />
                  <div className={cn("flex-1 bg-white p-6 rounded-xl border border-border shadow-sm", i % 2 === 0 ? "lg:text-right" : "")}>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-3">
                      <Calendar className="w-3 h-3" aria-hidden="true" />
                      <span>{item.año}</span>
                    </div>
                    <h3 className="font-heading text-xl font-semibold mb-2">{item.titulo}</h3>
                    <p className="text-text-muted">{item.descripcion}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Valores */}
      <section className="section-padding">
        <div className="container-main">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-4">Nuestros Valores</h2>
            <p className="text-text-muted text-lg">Principios que guían cada decisión, cada tratamiento, cada interacción con nuestros pacientes.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {valores.map((valor, i) => (
              <article key={i} className="bg-white p-8 rounded-2xl border border-border hover:shadow-xl transition-all duration-300 group">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform" aria-hidden="true">
                  <valor.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-heading text-xl font-semibold mb-3">{valor.titulo}</h3>
                <p className="text-text-muted">{valor.descripcion}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Equipo Médico */}
      <section className="section-padding bg-surface border-y border-border">
        <div className="container-main">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-4">Equipo Médico Especialista</h2>
            <p className="text-text-muted text-lg">9 especialistas certificados, fellowships internacionales, dedicación exclusiva a su área.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {equipoMedico.map((doctor) => (
              <article key={doctor.id} className="bg-white rounded-2xl border border-border overflow-hidden hover:shadow-xl transition-shadow group">
                <div className="relative h-56 bg-gradient-to-br from-primary/10 to-secondary/10">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Users className="w-16 h-16 text-primary/30 group-hover:scale-110 transition-transform" aria-hidden="true" />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-heading text-lg font-semibold mb-1">{doctor.nombre}</h3>
                  <p className="text-primary text-sm font-medium mb-3">{doctor.especialidad}</p>
                  <p className="text-text-muted text-sm mb-4 line-clamp-2">{doctor.bio}</p>
                  <div className="flex items-center gap-2 text-xs text-text-muted">
                    <GraduationCap className="w-3 h-3" aria-hidden="true" />
                    <span>{doctor.experiencia} experiencia</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <div className="text-center mt-12">
            <Button variant="outline" size="lg" asChild>
              <Link to="/nosotros#equipo">Ver Equipo Completo <ArrowRight className="w-5 h-5 ml-2" aria-hidden="true" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Sedes */}
      <section className="section-padding">
        <div className="container-main">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-4">Nuestras Sedes</h2>
            <p className="text-text-muted text-lg">4 ubicaciones estratégicas en Norte de Santander para estar cerca de ti.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {sedes.map((sede) => (
              <article key={sede.id} className="bg-white rounded-2xl border border-border overflow-hidden hover:shadow-xl transition-shadow">
                <div className="relative h-48 bg-gradient-to-br from-primary/10 to-secondary/10">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <MapPin className="w-16 h-16 text-primary/30" aria-hidden="true" />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-heading text-xl font-semibold mb-3">{sede.nombre}</h3>
                  <div className="space-y-3 text-sm text-text-muted mb-6">
                    <p className="flex items-center gap-2"><MapPin className="w-4 h-4" aria-hidden="true" />{sede.direccion}</p>
                    {sede.telefono && <p className="flex items-center gap-2"><Calendar className="w-4 h-4" aria-hidden="true" />{sede.telefono}</p>}
                    <p className="flex items-center gap-2"><Calendar className="w-4 h-4" aria-hidden="true" />{sede.celular}</p>
                    <p className="flex items-center gap-2">{sede.horario}</p>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline" size="sm" asChild>
                      <Link to={sede.mapaUrl} target="_blank" rel="noopener noreferrer">Ver en Mapa</Link>
                    </Button>
                    <Button size="sm" asChild>
                      <Link to={`tel:${sede.celular.replace(/\s/g, '')}`}>Llamar</Link>
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-primary text-white">
        <div className="container-main text-center">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-4">Confía tu sonrisa a especialistas</h2>
          <p className="text-primary-100 text-lg max-w-2xl mx-auto mb-8">Agenda tu primera valoración sin compromiso. Te escuchamos, te explicamos y diseñamos tu plan personalizado.</p>
          <Button size="xl" variant="secondary" asChild>
            <Link to="/cita">Agendar Mi Cita <ArrowRight className="w-5 h-5 ml-2" aria-hidden="true" /></Link>
          </Button>
        </div>
      </section>
    </div>
  )
}