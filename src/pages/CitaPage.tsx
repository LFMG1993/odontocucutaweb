import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/shared"
import { ArrowRight, Calendar, Phone, Mail, AlertCircle, CheckCircle2 } from "lucide-react"
import { cn } from "@/utils/cn"

const pasos = [
  { numero: 1, titulo: "Datos Personales", descripcion: "Información básica y contacto" },
  { numero: 2, titulo: "Motivo de Consulta", descripcion: "Qué necesitas y preferencias" },
  { numero: 3, titulo: "Confirmación", descripcion: "Revisamos y agendamos tu cita" },
]

const sedes = [
  { id: "caobos", nombre: "Sede Principal Caobos", direccion: "Av. 3E #13A-07", telefono: "607 595 5068" },
  { id: "libertad", nombre: "Sede Libertad", direccion: "Calle 10 #5-45", telefono: "607 501 0331" },
  { id: "atalaya", nombre: "Sede Atalaya", direccion: "Av. 4 #18-30", telefono: "607 501 0370" },
  { id: "pamplona", nombre: "Sede Pamplona", direccion: "Carrera 6 #7-25", telefono: "312 521 6991" },
]

const motivosConsulta = [
  "Valoración general / Control",
  "Ortodoncia (brackets / alineadores)",
  "Implantes dentales",
  "Cirugía (cordales, injertos, etc.)",
  "Endodoncia (conductos)",
  "Estética (carillas, blanqueamiento, DSD)",
  "Periodoncia (encías, retracciones)",
  "Odontopediatría (niños)",
  "ATM / Dolor orofacial / Bruxismo",
  "Rehabilitación / Prótesis",
  "Urgencia dental",
  "Otro motivo",
]

// const horariosDisponibles = [
//   "07:00 - 08:00", "08:00 - 09:00", "09:00 - 10:00", "10:00 - 11:00",
//   "11:00 - 12:00", "12:00 - 13:00", "14:00 - 15:00", "15:00 - 16:00",
//   "16:00 - 17:00", "17:00 - 18:00", "18:00 - 19:00",
// ]

export function CitaPage() {
  const navigate = useNavigate()
  const [pasoActual, setPasoActual] = useState(1)
  const [formData, setFormData] = useState({
    // Paso 1
    nombre: "",
    apellido: "",
    telefono: "",
    email: "",
    documento: "",
    fechaNacimiento: "",
    sede: "caobos",
    // Paso 2
    motivo: "",
    descripcion: "",
    tieneRadiografia: false,
    preferenciaHorario: "mañana",
    // Paso 3
    terminos: false,
    tratamientoDatos: false,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const validatePaso1 = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.nombre.trim()) newErrors.nombre = "Nombre es requerido"
    if (!formData.apellido.trim()) newErrors.apellido = "Apellido es requerido"
    if (!formData.telefono.trim()) newErrors.telefono = "Teléfono es requerido"
    else if (!/^[\d\s\+\-]{10,}$/.test(formData.telefono)) newErrors.telefono = "Teléfono inválido"
    if (!formData.email.trim()) newErrors.email = "Email es requerido"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Email inválido"
    if (!formData.documento.trim()) newErrors.documento = "Documento es requerido"
    if (!formData.fechaNacimiento) newErrors.fechaNacimiento = "Fecha de nacimiento es requerida"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validatePaso2 = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.motivo) newErrors.motivo = "Selecciona un motivo de consulta"
    if (!formData.descripcion.trim()) newErrors.descripcion = "Cuéntanos brevemente tu caso"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validatePaso3 = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.terminos) newErrors.terminos = "Debes aceptar los términos y condiciones"
    if (!formData.tratamientoDatos) newErrors.tratamientoDatos = "Debes autorizar el tratamiento de datos"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    let isValid = false
    if (pasoActual === 1) isValid = validatePaso1()
    else if (pasoActual === 2) isValid = validatePaso2()
    else if (pasoActual === 3) isValid = validatePaso3()

    if (isValid) {
      if (pasoActual < 3) setPasoActual(pasoActual + 1)
      else handleSubmit()
    }
  }

  const handleBack = () => {
    if (pasoActual > 1) setPasoActual(pasoActual - 1)
  }

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: "" }))
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    // Simular envío a API
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsSubmitting(false)
    setSubmitSuccess(true)
    setTimeout(() => {
      setSubmitSuccess(false)
      setPasoActual(1)
      setFormData({
        nombre: "", apellido: "", telefono: "", email: "", documento: "", fechaNacimiento: "",
        sede: "caobos", motivo: "", descripcion: "", tieneRadiografia: false,
        preferenciaHorario: "mañana", terminos: false, tratamientoDatos: false
      })
    }, 3000)
  }

  if (submitSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-surface to-primary/5">
        <div className="container-main text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-100 mb-6" aria-hidden="true">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold mb-4">¡Cita Agendada!</h1>
          <p className="text-text-muted text-lg mb-8 max-w-md mx-auto">
            Hemos recibido tu solicitud. Nuestro equipo de coordinación te contactará en menos de 2 horas para confirmar tu cita.
          </p>
          <Button size="lg" asChild onClick={() => navigate("/")}>
            <Link to="/">Volver al Inicio <ArrowRight className="w-5 h-5 ml-2" aria-hidden="true" /></Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-background via-surface to-primary/5 py-16 lg:py-24">
        <div className="container-main">
          <div className="max-w-3xl">
            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-4">
              Agenda tu
              <span className="text-primary"> Cita</span>
            </h1>
            <p className="text-text-muted text-lg">
              Proceso rápido en 3 pasos. Sin compromiso. Te contactamos para confirmar.
            </p>
          </div>
        </div>
      </section>

      {/* Progress Steps */}
      <section className="py-6 bg-white border-b border-border sticky top-16 z-40" aria-label="Pasos del formulario">
        <div className="container-main">
          <div className="flex items-center justify-between">
            {pasos.map((paso, index) => (
              <div key={paso.numero} className="flex items-center">
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all",
                    index < pasoActual - 1 ? "bg-green-500 text-white" :
                    index === pasoActual - 1 ? "bg-primary text-white" :
                    "bg-border text-text-muted"
                  )}>
                    {index < pasoActual - 1 ? <CheckCircle2 className="w-5 h-5" /> : paso.numero}
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className={cn("font-medium text-sm", index === pasoActual - 1 ? "text-text" : "text-text-muted")}>
                      {paso.titulo}
                    </p>
                    <p className="text-xs text-text-muted">{paso.descripcion}</p>
                  </div>
                </div>
                {index < pasos.length - 1 && (
                  <div className={cn("w-20 h-1 mx-4", index < pasoActual - 1 ? "bg-green-500" : "bg-border")} aria-hidden="true" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Formulario */}
      <section className="section-padding">
        <div className="container-main">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Formulario principal */}
            <div className="lg:col-span-2">
              <form className="bg-white rounded-2xl border border-border p-6 sm:p-8" noValidate>
                {/* Paso 1: Datos Personales */}
                {pasoActual === 1 && (
                  <fieldset>
                    <legend className="sr-only">Datos Personales</legend>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="nombre" className="block text-sm font-medium text-text mb-1">Nombres *</label>
                        <input
                          type="text"
                          id="nombre"
                          value={formData.nombre}
                          onChange={e => handleChange("nombre", e.target.value)}
                          className={cn("w-100% px-4 py-3 rounded-lg border transition-colors", errors.nombre ? "border-red-500 focus:ring-red-500" : "border-border focus:ring-primary")}
                          aria-invalid={!!errors.nombre}
                          aria-describedby={errors.nombre ? "nombre-error" : undefined}
                        />
                        {errors.nombre && <p id="nombre-error" className="mt-1 text-sm text-red-500" role="alert">{errors.nombre}</p>}
                      </div>
                      <div>
                        <label htmlFor="apellido" className="block text-sm font-medium text-text mb-1">Apellidos *</label>
                        <input
                          type="text"
                          id="apellido"
                          value={formData.apellido}
                          onChange={e => handleChange("apellido", e.target.value)}
                          className={cn("w-100% px-4 py-3 rounded-lg border transition-colors", errors.apellido ? "border-red-500 focus:ring-red-500" : "border-border focus:ring-primary")}
                          aria-invalid={!!errors.apellido}
                        />
                        {errors.apellido && <p className="mt-1 text-sm text-red-500" role="alert">{errors.apellido}</p>}
                      </div>
                      <div>
                        <label htmlFor="telefono" className="block text-sm font-medium text-text mb-1">Teléfono / WhatsApp *</label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" aria-hidden="true" />
                          <input
                            type="tel"
                            id="telefono"
                            value={formData.telefono}
                            onChange={e => handleChange("telefono", e.target.value)}
                            placeholder="3XX XXX XXXX"
                            className={cn("w-100% px-4 py-3 rounded-lg border transition-colors pl-10", errors.telefono ? "border-red-500 focus:ring-red-500" : "border-border focus:ring-primary")}
                            aria-invalid={!!errors.telefono}
                          />
                        </div>
                        {errors.telefono && <p className="mt-1 text-sm text-red-500" role="alert">{errors.telefono}</p>}
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-text mb-1">Correo Electrónico *</label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" aria-hidden="true" />
                          <input
                            type="email"
                            id="email"
                            value={formData.email}
                            onChange={e => handleChange("email", e.target.value)}
                            placeholder="tucorreo@ejemplo.com"
                            className={cn("w-100% px-4 py-3 rounded-lg border transition-colors pl-10", errors.email ? "border-red-500 focus:ring-red-500" : "border-border focus:ring-primary")}
                            aria-invalid={!!errors.email}
                          />
                        </div>
                        {errors.email && <p className="mt-1 text-sm text-red-500" role="alert">{errors.email}</p>}
                      </div>
                      <div>
                        <label htmlFor="documento" className="block text-sm font-medium text-text mb-1">Documento de Identidad *</label>
                        <input
                          type="text"
                          id="documento"
                          value={formData.documento}
                          onChange={e => handleChange("documento", e.target.value)}
                          placeholder="CC / TI / CE / Pasaporte"
                          className={cn("w-100% px-4 py-3 rounded-lg border transition-colors", errors.documento ? "border-red-500 focus:ring-red-500" : "border-border focus:ring-primary")}
                          aria-invalid={!!errors.documento}
                        />
                        {errors.documento && <p className="mt-1 text-sm text-red-500" role="alert">{errors.documento}</p>}
                      </div>
                      <div>
                        <label htmlFor="fechaNacimiento" className="block text-sm font-medium text-text mb-1">Fecha de Nacimiento *</label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" aria-hidden="true" />
                          <input
                            type="date"
                            id="fechaNacimiento"
                            value={formData.fechaNacimiento}
                            onChange={e => handleChange("fechaNacimiento", e.target.value)}
                            max={new Date().toISOString().split("T")[0]}
                            className={cn("w-100% px-4 py-3 rounded-lg border transition-colors pl-10", errors.fechaNacimiento ? "border-red-500 focus:ring-red-500" : "border-border focus:ring-primary")}
                            aria-invalid={!!errors.fechaNacimiento}
                          />
                        </div>
                        {errors.fechaNacimiento && <p className="mt-1 text-sm text-red-500" role="alert">{errors.fechaNacimiento}</p>}
                      </div>
                      <div>
                        <label htmlFor="sede" className="block text-sm font-medium text-text mb-1">Sede Preferida *</label>
                        <select
                          id="sede"
                          value={formData.sede}
                          onChange={e => handleChange("sede", e.target.value)}
                          className="w-100% px-4 py-3 rounded-lg border border-border focus:ring-primary focus:border-primary transition-colors"
                        >
                          {sedes.map(s => (
                            <option key={s.id} value={s.id}>{s.nombre} - {s.direccion}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </fieldset>
                )}

                {/* Paso 2: Motivo de Consulta */}
                {pasoActual === 2 && (
                  <fieldset>
                    <legend className="sr-only">Motivo de Consulta</legend>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-text mb-3">Motivo Principal de la Consulta *</label>
                        <div className="relative">
                          <select
                            value={formData.motivo}
                            onChange={e => handleChange("motivo", e.target.value)}
                            className={cn("w-100% px-4 py-3 rounded-lg border transition-colors appearance-none pr-10", errors.motivo ? "border-red-500 focus:ring-red-500" : "border-border focus:ring-primary")}
                            aria-invalid={!!errors.motivo}
                          >
                            <option value="">Selecciona un motivo...</option>
                            {motivosConsulta.map(m => (
                              <option key={m} value={m}>{m}</option>
                            ))}
                          </select>
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                            <AlertCircle className="w-5 h-5 text-text-muted" aria-hidden="true" />
                          </div>
                        </div>
                        {errors.motivo && <p className="mt-1 text-sm text-red-500" role="alert">{errors.motivo}</p>}
                      </div>

                      <div>
                        <label htmlFor="descripcion" className="block text-sm font-medium text-text mb-1">Describe brevemente tu caso / síntomas *</label>
                        <textarea
                          id="descripcion"
                          value={formData.descripcion}
                          onChange={e => handleChange("descripcion", e.target.value)}
                          rows={4}
                          placeholder="Ej: Tengo dolor en la muela del juicio inferior derecha hace 3 días, encía inflamada..."
                          className={cn("w-100% px-4 py-3 rounded-lg border transition-colors resize-none", errors.descripcion ? "border-red-500 focus:ring-red-500" : "border-border focus:ring-primary")}
                          aria-invalid={!!errors.descripcion}
                        />
                        {errors.descripcion && <p className="mt-1 text-sm text-red-500" role="alert">{errors.descripcion}</p>}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-text mb-1">¿Tienes radiografías o estudios previos?</label>
                          <div className="flex gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="radio"
                                name="radiografia"
                                value="true"
                                checked={formData.tieneRadiografia}
                                onChange={e => handleChange("tieneRadiografia", e.target.value === "true")}
                                className="w-4 h-4 text-primary border-border focus:ring-primary"
                              />
                              <span className="text-sm">Sí, los traeré / puedo enviar</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="radio"
                                name="radiografia"
                                value="false"
                                checked={!formData.tieneRadiografia}
                                onChange={e => handleChange("tieneRadiografia", e.target.value === "true")}
                                className="w-4 h-4 text-primary border-border focus:ring-primary"
                              />
                              <span className="text-sm">No, los necesito hacer aquí</span>
                            </label>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-text mb-1">Preferencia Horaria</label>
                          <select
                            value={formData.preferenciaHorario}
                            onChange={e => handleChange("preferenciaHorario", e.target.value)}
                            className="w-100% px-4 py-3 rounded-lg border border-border focus:ring-primary focus:border-primary transition-colors"
                          >
                            <option value="mañana">Mañana (7:00 AM - 12:00 PM)</option>
                            <option value="tarde">Tarde (2:00 PM - 7:00 PM)</option>
                            <option value="indiferente">Indiferente / Cualquier hora</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </fieldset>
                )}

                {/* Paso 3: Confirmación */}
                {pasoActual === 3 && (
                  <fieldset>
                    <legend className="sr-only">Confirmación y Términos</legend>
                    <div className="bg-surface rounded-xl p-6 mb-6">
                      <h3 className="font-heading text-lg font-semibold mb-4 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-primary" aria-hidden="true" />
                        Resumen de tu Solicitud
                      </h3>
                      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                        <div><dt className="text-text-muted">Paciente:</dt> <dd className="font-medium">{formData.nombre} {formData.apellido}</dd></div>
                        <div><dt className="text-text-muted">Teléfono:</dt> <dd className="font-medium">{formData.telefono}</dd></div>
                        <div><dt className="text-text-muted">Email:</dt> <dd className="font-medium">{formData.email}</dd></div>
                        <div><dt className="text-text-muted">Sede:</dt> <dd className="font-medium">{sedes.find(s => s.id === formData.sede)?.nombre}</dd></div>
                        <div><dt className="text-text-muted">Motivo:</dt> <dd className="font-medium">{formData.motivo}</dd></div>
                        <div><dt className="text-text-muted">Horario:</dt> <dd className="font-medium">{formData.preferenciaHorario === "mañana" ? "Mañana" : formData.preferenciaHorario === "tarde" ? "Tarde" : "Indiferente"}</dd></div>
                      </dl>
                    </div>

                    <div className="space-y-4 mb-6">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.tratamientoDatos}
                          onChange={e => handleChange("tratamientoDatos", e.target.checked)}
                          className="w-4 h-4 mt-0.5 text-primary border-border rounded focus:ring-primary"
                          required
                        />
                        <div className="text-sm text-text">
                          <span className="font-medium">Autorizo el tratamiento de mis datos personales</span> según la 
                          <Link to="/politica-de-privacidad" className="text-primary hover:underline">Política de Privacidad</Link> 
                          y la Ley 1581 de 2012 (Habeas Data).
                        </div>
                      </label>
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.terminos}
                          onChange={e => handleChange("terminos", e.target.checked)}
                          className="w-4 h-4 mt-0.5 text-primary border-border rounded focus:ring-primary"
                          required
                        />
                        <div className="text-sm text-text">
                          Acepto los <Link to="/terminos-y-condiciones" className="text-primary hover:underline">Términos y Condiciones</Link> 
                          y autorizo ser contactado por WhatsApp, llamada o email para agendar mi cita.
                        </div>
                      </label>
                    </div>

                    {errors.terminos && <p className="text-sm text-red-500" role="alert">{errors.terminos}</p>}
                    {errors.tratamientoDatos && <p className="text-sm text-red-500" role="alert">{errors.tratamientoDatos}</p>}
                  </fieldset>
                )}

                {/* Botones de navegación */}
                <div className="flex items-center justify-between pt-6 border-t border-border mt-8">
                  <Button type="button" variant="ghost" onClick={handleBack} disabled={pasoActual === 1}>
                    ← Anterior
                  </Button>
                  <Button type="button" onClick={handleNext} isLoading={isSubmitting}>
                    {pasoActual === 3 ? (isSubmitting ? "Enviando..." : "Confirmar y Agendar") : "Siguiente →"}
                  </Button>
                </div>
              </form>
            </div>

            {/* Sidebar Informativo */}
            <div className="hidden lg:block">
              <div className="sticky top-24 space-y-6">
                <div className="bg-white rounded-2xl border border-border p-6">
                  <h3 className="font-heading text-lg font-semibold mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" aria-hidden="true" />
                    Horarios de Atención
                  </h3>
                  <ul className="space-y-2 text-sm text-text-muted">
                    <li className="flex justify-between"><span>Lunes - Viernes</span><span className="font-medium text-text">7:00 AM - 7:00 PM</span></li>
                    <li className="flex justify-between"><span>Sábados</span><span className="font-medium text-text">8:00 AM - 2:00 PM</span></li>
                    <li className="flex justify-between"><span>Domingos y Festivos</span><span className="font-medium text-text">Cerrado</span></li>
                  </ul>
                </div>

                <div className="bg-white rounded-2xl border border-border p-6">
                  <h3 className="font-heading text-lg font-semibold mb-4 flex items-center gap-2">
                    <Phone className="w-5 h-5 text-primary" aria-hidden="true" />
                    Contacto Directo
                  </h3>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-center gap-2 text-text-muted"><Phone className="w-4 h-4" aria-hidden="true" /><a href="tel:+576075955068" className="hover:text-primary transition-colors">PBX: 607 595 5068</a></li>
                    <li className="flex items-center gap-2 text-text-muted"><Phone className="w-4 h-4" aria-hidden="true" /><a href="tel:+573181441442" className="hover:text-primary transition-colors">WhatsApp: 318 144 1442</a></li>
                    <li className="flex items-center gap-2 text-text-muted"><Mail className="w-4 h-4" aria-hidden="true" /><a href="mailto:citas@odontocucuta.com" className="hover:text-primary transition-colors">citas@odontocucuta.com</a></li>
                  </ul>
                </div>

                <div className="bg-primary text-white rounded-2xl p-6">
                  <h3 className="font-heading text-lg font-semibold mb-2">¿Primera vez?</h3>
                  <p className="text-primary-100 text-sm mb-4">Tu primera valoración diagnóstica no tiene compromiso. Evaluamos tu caso y te explicamos opciones.</p>
                  <ul className="space-y-2 text-sm text-primary-100">
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4" aria-hidden="true" />Examen clínico completo</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4" aria-hidden="true" />Radiografías si se requieren</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4" aria-hidden="true" />Plan de tratamiento y presupuesto</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4" aria-hidden="true" />Resolvemos todas tus dudas</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}