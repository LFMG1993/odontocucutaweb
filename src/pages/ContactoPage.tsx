import { Link } from "react-router-dom"
import { Button } from "@/components/shared"
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageSquare,
  Send,
  CheckCircle2,
  MapPin as MapPinIcon,
  Calendar
} from "lucide-react"
import { sedes, convenios } from "@/data/siteData"
import { cn } from "@/utils/cn"
import { useState } from "react"

export function ContactoPage() {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    sede: "caobos",
    asunto: "",
    mensaje: "",
    terminos: false,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: "" }))
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.nombre.trim()) newErrors.nombre = "Nombre es requerido"
    if (!formData.email.trim()) newErrors.email = "Email es requerido"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Email inválido"
    if (!formData.telefono.trim()) newErrors.telefono = "Teléfono es requerido"
    if (!formData.asunto.trim()) newErrors.asunto = "Asunto es requerido"
    if (!formData.mensaje.trim()) newErrors.mensaje = "Mensaje es requerido"
    if (!formData.terminos) newErrors.terminos = "Debes aceptar los términos"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setIsSubmitting(true)
    await new Promise(r => setTimeout(r, 1500))
    setIsSubmitting(false)
    setSubmitSuccess(true)
    setFormData({ nombre: "", email: "", telefono: "", sede: "caobos", asunto: "", mensaje: "", terminos: false })
  }

  if (submitSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center py-20 px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-green-600" aria-hidden="true" />
          </div>
          <h2 className="font-heading text-2xl font-bold mb-2">¡Mensaje Enviado!</h2>
          <p className="text-text-muted mb-6">Gracias por contactarnos. Te responderemos en menos de 2 horas hábiles.</p>
          <Button onClick={() => setSubmitSuccess(false)}>Volver al Inicio</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-background via-surface to-primary/5 py-16 lg:py-24">
        <div className="container-main text-center">
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-4">
            Contáctanos
          </h1>
          <p className="text-text-muted text-lg max-w-2xl mx-auto">
            Estamos aquí para ayudarte. Escríbenos, llámanos o visítanos en cualquiera de nuestras 4 sedes.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-main">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Info de Contacto */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white rounded-2xl border border-border p-6 sticky top-24">
                <h3 className="font-heading text-lg font-semibold mb-6">Canales Directos</h3>
                <div className="space-y-4">
                  <a href="tel:+576075955068" className="flex items-center gap-3 p-3 rounded-xl bg-surface hover:bg-border transition-colors group">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                      <Phone className="w-5 h-5 text-primary group-hover:text-white" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-sm text-text-muted">PBX Principal</p>
                      <p className="font-medium text-text">607 595 5068</p>
                    </div>
                  </a>
                  <a href="https://wa.me/573181441442" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-xl bg-surface hover:bg-border transition-colors group">
                    <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center group-hover:bg-green-500 group-hover:text-white transition-colors">
                      <MessageSquare className="w-5 h-5 text-green-600 group-hover:text-white" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-sm text-text-muted">WhatsApp Citas</p>
                      <p className="font-medium text-text">318 144 1442</p>
                    </div>
                  </a>
                  <a href="mailto:info@odontocucuta.com" className="flex items-center gap-3 p-3 rounded-xl bg-surface hover:bg-border transition-colors group">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                      <Mail className="w-5 h-5 text-primary group-hover:text-white" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-sm text-text-muted">Email General</p>
                      <p className="font-medium text-text">info@odontocucuta.com</p>
                    </div>
                  </a>
                  <a href="mailto:citas@odontocucuta.com" className="flex items-center gap-3 p-3 rounded-xl bg-surface hover:bg-border transition-colors group">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                      <Calendar className="w-5 h-5 text-primary group-hover:text-white" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-sm text-text-muted">Email Citas</p>
                      <p className="font-medium text-text">citas@odontocucuta.com</p>
                    </div>
                  </a>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-border p-6">
                <h3 className="font-heading text-lg font-semibold mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" aria-hidden="true" />
                  Horarios de Atención
                </h3>
                <ul className="space-y-3 text-sm">
                  <li className="flex justify-between py-2 border-b border-border/50"><span className="text-text-muted">Lunes - Viernes</span><span className="font-medium text-text">7:00 AM - 7:00 PM</span></li>
                  <li className="flex justify-between py-2 border-b border-border/50"><span className="text-text-muted">Sábados</span><span className="font-medium text-text">8:00 AM - 2:00 PM</span></li>
                  <li className="flex justify-between py-2"><span className="text-text-muted">Domingos y Festivos</span><span className="font-medium text-text">Cerrado</span></li>
                </ul>
                <p className="text-xs text-text-muted mt-4">* Horarios pueden variar por sede. Confirma al agendar.</p>
              </div>
            </div>

            {/* Formulario */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl border border-border p-6 md:p-8">
                <h2 className="font-heading text-2xl font-bold mb-2">Envíanos un Mensaje</h2>
                <p className="text-text-muted mb-6">Completa el formulario y te responderemos a la brevedad posible.</p>
                
                <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="nombre" className="block text-sm font-medium text-text mb-1">Nombres *</label>
                      <input
                        type="text"
                        id="nombre"
                        value={formData.nombre}
                        onChange={e => handleChange("nombre", e.target.value)}
                        className={cn("w-full px-4 py-3 rounded-lg border transition-colors", errors.nombre ? "border-red-500 focus:ring-red-500" : "border-border focus:ring-primary")}
                        aria-invalid={!!errors.nombre}
                        aria-describedby={errors.nombre ? "nombre-error" : undefined}
                      />
                      {errors.nombre && <p id="nombre-error" className="mt-1 text-sm text-red-500" role="alert">{errors.nombre}</p>}
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-text mb-1">Email *</label>
                      <input
                        type="email"
                        id="email"
                        value={formData.email}
                        onChange={e => handleChange("email", e.target.value)}
                        className={cn("w-full px-4 py-3 rounded-lg border transition-colors", errors.email ? "border-red-500 focus:ring-red-500" : "border-border focus:ring-primary")}
                        aria-invalid={!!errors.email}
                        aria-describedby={errors.email ? "email-error" : undefined}
                      />
                      {errors.email && <p id="email-error" className="mt-1 text-sm text-red-500" role="alert">{errors.email}</p>}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="telefono" className="block text-sm font-medium text-text mb-1">Teléfono / WhatsApp *</label>
                      <input
                        type="tel"
                        id="telefono"
                        value={formData.telefono}
                        onChange={e => handleChange("telefono", e.target.value)}
                        placeholder="+57 3XX XXX XXXX"
                        className={cn("w-full px-4 py-3 rounded-lg border transition-colors", errors.telefono ? "border-red-500 focus:ring-red-500" : "border-border focus:ring-primary")}
                        aria-invalid={!!errors.telefono}
                        aria-describedby={errors.telefono ? "telefono-error" : undefined}
                      />
                      {errors.telefono && <p id="telefono-error" className="mt-1 text-sm text-red-500" role="alert">{errors.telefono}</p>}
                    </div>
                    <div>
                      <label htmlFor="sede" className="block text-sm font-medium text-text mb-1">Sede Preferida</label>
                      <select
                        id="sede"
                        value={formData.sede}
                        onChange={e => handleChange("sede", e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-border focus:ring-primary focus:border-primary transition-colors"
                      >
                        {sedes.map(s => <option key={s.id} value={s.id}>{s.nombre}</option>)}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="asunto" className="block text-sm font-medium text-text mb-1">Asunto *</label>
                    <select
                      id="asunto"
                      value={formData.asunto}
                      onChange={e => handleChange("asunto", e.target.value)}
                      className={cn("w-full px-4 py-3 rounded-lg border transition-colors", errors.asunto ? "border-red-500 focus:ring-red-500" : "border-border focus:ring-primary")}
                      aria-invalid={!!errors.asunto}
                      aria-describedby={errors.asunto ? "asunto-error" : undefined}
                    >
                      <option value="">Selecciona un tema</option>
                      <option value="cita">Solicitar Cita</option>
                      <option value="informacion">Información de Tratamientos</option>
                      <option value="presupuesto">Solicitar Presupuesto</option>
                      <option value="convenios">Convenios y Financiación</option>
                      <option value="sugerencia">Sugerencia / Felicitación</option>
                      <option value="reclamo">Reclamo / PQR</option>
                      <option value="trabajo">Trabaja con Nosotros</option>
                      <option value="otro">Otro</option>
                    </select>
                    {errors.asunto && <p id="asunto-error" className="mt-1 text-sm text-red-500" role="alert">{errors.asunto}</p>}
                  </div>

                  <div>
                    <label htmlFor="mensaje" className="block text-sm font-medium text-text mb-1">Mensaje *</label>
                    <textarea
                      id="mensaje"
                      value={formData.mensaje}
                      onChange={e => handleChange("mensaje", e.target.value)}
                      rows={5}
                      placeholder="Cuéntanos brevemente tu caso, duda o solicitud..."
                      className={cn("w-full px-4 py-3 rounded-lg border transition-colors resize-none", errors.mensaje ? "border-red-500 focus:ring-red-500" : "border-border focus:ring-primary")}
                      aria-invalid={!!errors.mensaje}
                      aria-describedby={errors.mensaje ? "mensaje-error" : undefined}
                    />
                    {errors.mensaje && <p id="mensaje-error" className="mt-1 text-sm text-red-500" role="alert">{errors.mensaje}</p>}
                  </div>

                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="terminos"
                      checked={formData.terminos}
                      onChange={e => handleChange("terminos", e.target.checked)}
                      className="w-4 h-4 mt-0.5 text-primary border-border rounded focus:ring-primary"
                      required
                    />
                    <label htmlFor="terminos" className="text-sm text-text">
                      Acepto la <Link to="/politica-de-privacidad" className="text-primary hover:underline">Política de Privacidad</Link> y 
                      <Link to="/terminos-y-condiciones" className="text-primary hover:underline">Términos y Condiciones</Link>. 
                      Autorizo el tratamiento de mis datos para ser contactado. *
                    </label>
                  </div>
                  {errors.terminos && <p className="text-sm text-red-500" role="alert">{errors.terminos}</p>}

                  <Button type="submit" className="w-full md:w-auto" size="lg" isLoading={isSubmitting}>
                    <Send className="w-5 h-5 mr-2" aria-hidden="true" />
                    Enviar Mensaje
                  </Button>
                </form>
              </div>
            </div>
          </div>

          {/* Mapa de Sedes */}
          <div className="mt-16">
            <h3 className="font-heading text-2xl font-bold mb-8 text-center">Nuestras Sedes</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {sedes.map((sede) => (
                <article key={sede.id} className="bg-white rounded-2xl border border-border overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="relative h-40 bg-gradient-to-br from-primary/10 to-secondary/10">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <MapPinIcon className="w-12 h-12 text-primary/30" aria-hidden="true" />
                    </div>
                  </div>
                  <div className="p-5">
                    <h4 className="font-heading text-lg font-semibold mb-3">{sede.nombre}</h4>
                    <div className="space-y-2 text-sm text-text-muted mb-4">
                      <p className="flex items-center gap-2"><MapPin className="w-4 h-4" aria-hidden="true" />{sede.direccion}</p>
                      {sede.telefono && <p className="flex items-center gap-2"><Phone className="w-4 h-4" aria-hidden="true" />{sede.telefono}</p>}
                      <p className="flex items-center gap-2"><Phone className="w-4 h-4" aria-hidden="true" />{sede.celular}</p>
                      <p className="flex items-center gap-2"><Clock className="w-4 h-4" aria-hidden="true" />{sede.horario}</p>
                    </div>
                    <div className="flex gap-2">
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
        </div>
      </section>

      {/* Convenios */}
      <section className="section-padding bg-surface border-y border-border">
        <div className="container-main">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-heading text-2xl sm:text-3xl font-bold mb-4">Convenios y Financiación</h2>
            <p className="text-text-muted">Trabajamos con las principales EPS, cajas de compensación y entidades financieras para facilitar tu acceso a tratamientos de calidad.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {convenios.map((convenio) => (
              <div key={convenio.id} className="bg-white rounded-xl border border-border p-6 text-center hover:shadow-lg transition-shadow">
                <div className="w-20 h-20 mx-auto mb-4 bg-surface rounded-lg flex items-center justify-center">
                  <div className="w-16 h-16 bg-primary/10 rounded flex items-center justify-center">
                    <MapPinIcon className="w-8 h-8 text-primary" aria-hidden="true" />
                  </div>
                </div>
                <h4 className="font-medium text-text mb-1">{convenio.nombre}</h4>
                <p className="text-sm text-text-muted">{convenio.descripcion}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}