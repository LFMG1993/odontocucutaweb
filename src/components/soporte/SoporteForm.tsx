import React, { useState, useRef, useEffect, useMemo } from 'react'
import {
  User,
  Building,
  FileText,
  Phone,
  Paperclip,
  X,
  Send,
  AlertCircle,
  Clock,
  Sparkles,
  CheckCircle,
  MessageSquare,
  Search,
  Check,
  ChevronDown,
} from 'lucide-react'
import { Button } from '@/components/shared'
import type {
  SoportePublicoFormData,
  CrearTicketPayload,
  TicketPrioridad,
  UsuarioDlOption,
} from '@/types/soporte'

interface SoporteFormProps {
  catalogos: SoportePublicoFormData
  onSubmit: (payload: CrearTicketPayload) => Promise<unknown>
  isSubmitting: boolean
  validationErrors?: Record<string, string>
}

const PRIORIDADES: { id: TicketPrioridad; label: string; color: string; desc: string }[] = [
  { id: 'baja', label: 'Baja', color: 'border-slate-200 text-slate-700 bg-slate-50', desc: 'Consultas o dudas' },
  { id: 'media', label: 'Media', color: 'border-blue-200 text-blue-700 bg-blue-50/60', desc: 'Atención estándar' },
  { id: 'alta', label: 'Alta', color: 'border-amber-200 text-amber-700 bg-amber-50/60', desc: 'Afecta operación de sede' },
  { id: 'urgente', label: 'Urgente', color: 'border-red-200 text-red-700 bg-red-50/60', desc: 'Servicio detenido totalmente' },
]

export const SoporteForm: React.FC<SoporteFormProps> = ({
  catalogos,
  onSubmit,
  isSubmitting,
  validationErrors = {},
}) => {
  const [selectedUsuarioId, setSelectedUsuarioId] = useState<string>('')
  const [userSearchQuery, setUserSearchQuery] = useState<string>('')
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false)

  const [solicitante, setSolicitante] = useState<string>(
    catalogos.equipo?.usuario_asignado || ''
  )
  const [telefono, setTelefono] = useState<string>('')
  const [sede, setSede] = useState<string>(catalogos.equipo?.sede || '')
  const [motivo, setMotivo] = useState<string>('')
  const [prioridad, setPrioridad] = useState<TicketPrioridad>('media')
  const [descripcion, setDescripcion] = useState<string>('')
  const [mensajeWhatsapp, setMensajeWhatsapp] = useState<string>('')
  const [archivo, setArchivo] = useState<File | null>(null)
  const [archivoError, setArchivoError] = useState<string | null>(null)
  const [localErrors, setLocalErrors] = useState<Record<string, string>>({})

  const fileInputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Cerrar dropdown al hacer click afuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Filtrado rápido de usuarios
  const filteredUsuarios = useMemo(() => {
    if (!catalogos.usuarios) return []
    const q = userSearchQuery.toLowerCase().trim()
    if (!q) return catalogos.usuarios.slice(0, 8)
    return catalogos.usuarios
      .filter((u) => {
        const matchName = u.nombre.toLowerCase().includes(q)
        const matchSucursal = u.nombre_sucursal_dl?.toLowerCase().includes(q)
        return matchName || matchSucursal
      })
      .slice(0, 10)
  }, [catalogos.usuarios, userSearchQuery])

  const handleSelectUsuario = (user: UsuarioDlOption) => {
    setSelectedUsuarioId(String(user.id_usuario_dl))
    setUserSearchQuery(user.nombre)
    setSolicitante(user.nombre)
    setIsDropdownOpen(false)

    if (user.celular || user.telefono) {
      setTelefono(user.celular || user.telefono || '')
    }
    if (user.nombre_sucursal_dl) {
      const matchedSede = catalogos.sucursales.find(
        (s) => s.nombre.toLowerCase() === user.nombre_sucursal_dl?.toLowerCase()
      )
      if (matchedSede) {
        setSede(matchedSede.nombre)
      }
    }
  }

  const handleLimpiarUsuario = () => {
    setSelectedUsuarioId('')
    setUserSearchQuery('')
  }

  // Manejo de archivo adjunto con límite de 10MB y formatos válidos
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setArchivoError(null)
    const file = e.target.files?.[0]
    if (!file) return

    const MAX_SIZE_MB = 10
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setArchivoError(`El archivo supera el límite de ${MAX_SIZE_MB}MB. Por favor sube uno más ligero.`)
      if (fileInputRef.current) fileInputRef.current.value = ''
      return
    }

    setArchivo(file)
  }

  const handleRemoverArchivo = () => {
    setArchivo(null)
    setArchivoError(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs: Record<string, string> = {}

    if (!solicitante.trim()) {
      errs.solicitante = 'Por favor ingresa tu nombre completo.'
    }
    if (!sede) {
      errs.sede = 'Selecciona la sede donde ocurre la falla.'
    }
    if (!motivo) {
      errs.motivo = 'Selecciona el motivo de la incidencia.'
    }
    if (!descripcion.trim() || descripcion.trim().length < 10) {
      errs.descripcion = 'Describe con mayor detalle la falla (mínimo 10 caracteres).'
    }

    setLocalErrors(errs)
    if (Object.keys(errs).length > 0) return

    await onSubmit({
      solicitante: solicitante.trim(),
      id_usuario_dl: selectedUsuarioId ? Number(selectedUsuarioId) : null,
      telefono: telefono.trim() || undefined,
      sede,
      motivo,
      prioridad,
      descripcion: descripcion.trim(),
      mensaje_whatsapp: mensajeWhatsapp.trim() || undefined,
      adjunto: archivo,
    })
  }

  const getError = (field: string) => localErrors[field] || validationErrors[field]

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-3xl border border-slate-800 p-6 sm:p-8 shadow-xl shadow-slate-200/40 space-y-6"
    >
      {/* Encabezado del Formulario */}
      <div className="border-b border-slate-100 pb-5">
        <div className="flex items-center gap-2 text-2xl font-bold text-blue-700 tracking-wider mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Mesa de Ayuda OdontoCucuta</span>
        </div>
      </div>

      {/* Sección 1: Datos del Solicitante */}
      <div className="space-y-4">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <User className="w-3.5 h-3.5 text-blue-600" />
          <span>1. ¿Quién reporta la novedad?</span>
        </h3>

        {/* Buscador y Selector Escribible de Usuario Dentalink */}
        {catalogos.usuarios && catalogos.usuarios.length > 0 && (
          <div className="relative" ref={dropdownRef}>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Search className="w-3.5 h-3.5" />
              </div>
              <input
                type="text"
                value={userSearchQuery}
                onFocus={() => setIsDropdownOpen(true)}
                onChange={(e) => {
                  setUserSearchQuery(e.target.value)
                  setIsDropdownOpen(true)
                  if (selectedUsuarioId && e.target.value !== solicitante) {
                    setSelectedUsuarioId('')
                  }
                }}
                placeholder="Escribe el nombre del colaborador o doctor..."
                className="w-full text-xs sm:text-sm pl-9 pr-16 py-2.5 rounded-xl border border-slate-200 bg-slate-50/60 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all text-slate-800"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 gap-1">
                {userSearchQuery && (
                  <button
                    type="button"
                    onClick={handleLimpiarUsuario}
                    className="p-1 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-200/50"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen((prev) => !prev)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-md"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Dropdown flotante compacto */}
            {isDropdownOpen && (
              <div className="absolute z-30 mt-1.5 w-full bg-white rounded-2xl shadow-xl border border-slate-200 py-1.5 max-h-56 overflow-y-auto">
                {filteredUsuarios.length > 0 ? (
                  filteredUsuarios.map((u) => {
                    const isSelected = String(u.id_usuario_dl) === selectedUsuarioId
                    return (
                      <button
                        key={u.id_usuario_dl}
                        type="button"
                        onClick={() => handleSelectUsuario(u)}
                        className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between transition-colors ${
                          isSelected
                            ? 'bg-blue-50 text-blue-700 font-bold'
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <div className="min-w-0 pr-2">
                          <p className="truncate font-medium">{u.nombre}</p>
                          {u.nombre_sucursal_dl && (
                            <p className="text-[10px] text-slate-400 truncate">
                              Sede: {u.nombre_sucursal_dl}
                            </p>
                          )}
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
                      </button>
                    )
                  })
                ) : (
                  <div className="px-4 py-3 text-center text-xs text-slate-400">
                    No se encontró ningún colaborador con ese nombre.
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Nombre Completo <small className="text-red-500">*</small>
            </label>
            <input
              type="text"
              value={solicitante}
              onChange={(e) => {
                setSolicitante(e.target.value)
                if (localErrors.solicitante) setLocalErrors((prev) => ({ ...prev, solicitante: '' }))
              }}
              placeholder="Ej: Dra. Daniela Rosales"
              required
              className={`w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border bg-slate-50/60 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all ${
                getError('solicitante') ? 'border-red-400 bg-red-50/30' : 'border-slate-200'
              }`}
            />
            {getError('solicitante') && (
              <p className="mt-1 text-[11px] text-red-600 font-medium flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {getError('solicitante')}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Teléfono / WhatsApp <small className="text-red-500">*</small>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Phone className="w-3.5 h-3.5" />
              </div>
              <input
                type="tel"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                placeholder="Ej: +57 321 3574133"
                className="w-full text-xs sm:text-sm pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/60 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
              />
            </div>
            {getError('telefono') && (
              <p className="mt-1 text-[11px] text-red-600 font-medium">{getError('telefono')}</p>
            )}
          </div>
        </div>
      </div>

      {/* Sección 2: Ubicación y Clasificación de la Falla */}
      <div className="space-y-4 pt-2 border-t border-slate-100">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Building className="w-3.5 h-3.5 text-blue-600" />
          <span>2. Ubicación y Motivo</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Sede Odontocúcuta <small className="text-red-500">*</small>
            </label>
            <select
              value={sede}
              onChange={(e) => {
                setSede(e.target.value)
                if (localErrors.sede) setLocalErrors((prev) => ({ ...prev, sede: '' }))
              }}
              required
              className={`w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border bg-slate-50/60 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all ${
                getError('sede') ? 'border-red-400 bg-red-50/30' : 'border-slate-200'
              }`}
            >
              <option value="">-- Selecciona la sede --</option>
              {catalogos.sucursales.map((s) => (
                <option key={s.id_sucursal} value={s.nombre}>
                  {s.nombre}
                </option>
              ))}
            </select>
            {getError('sede') && (
              <p className="mt-1 text-[11px] text-red-600 font-medium flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {getError('sede')}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Motivo de la Solicitud <small className="text-red-500">*</small>
            </label>
            <select
              value={motivo}
              onChange={(e) => {
                setMotivo(e.target.value)
                if (localErrors.motivo) setLocalErrors((prev) => ({ ...prev, motivo: '' }))
              }}
              required
              className={`w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border bg-slate-50/60 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all ${
                getError('motivo') ? 'border-red-400 bg-red-50/30' : 'border-slate-200'
              }`}
            >
              <option value="">-- Selecciona el tipo de falla --</option>
              {catalogos.motivos.map((m) => (
                <option key={m.id} value={m.nombre}>
                  {m.nombre} {m.categoria ? `(${m.categoria})` : ''}
                </option>
              ))}
              <option value="Otro motivo de soporte">Otro motivo técnico no listado</option>
            </select>
            {getError('motivo') && (
              <p className="mt-1 text-[11px] text-red-600 font-medium flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {getError('motivo')}
              </p>
            )}
          </div>
        </div>

        {/* Selector Visual de Prioridad */}
        <div>
          <label className="text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Nivel de Prioridad</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {PRIORIDADES.map((p) => {
              const isSelected = prioridad === p.id
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPrioridad(p.id)}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'border-blue-600 ring-2 ring-blue-500/20 bg-blue-50/60 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">{p.label}</span>
                    {isSelected && <CheckCircle className="w-3.5 h-3.5 text-blue-600" />}
                  </div>
                  <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">{p.desc}</p>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Sección 3: Descripción Detallada y Evidencia */}
      <div className="space-y-4 pt-2 border-t border-slate-100">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5 text-blue-600" />
          <span>3. Detalle de la Novedad y Evidencias</span>
        </h3>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Descripción Detallada de la Falla <small className="text-red-500">*</small>
          </label>
          <textarea
            rows={4}
            value={descripcion}
            onChange={(e) => {
              setDescripcion(e.target.value)
              if (localErrors.descripcion) setLocalErrors((prev) => ({ ...prev, descripcion: '' }))
            }}
            placeholder="Describe qué ocurrió, qué mensaje de error aparece en pantalla, o qué equipo no enciende..."
            required
            className={`w-full text-xs sm:text-sm p-3.5 rounded-xl border bg-slate-50/60 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all resize-none ${
              getError('descripcion') ? 'border-red-400 bg-red-50/30' : 'border-slate-200'
            }`}
          />
          {getError('descripcion') && (
            <p className="mt-1 text-[11px] text-red-600 font-medium flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {getError('descripcion')}
            </p>
          )}
        </div>

        {/* Nota / Mensaje WhatsApp adicional */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
            <span>Mensaje o Nota Adicional (Opcional)</span>
          </label>
          <input
            type="text"
            value={mensajeWhatsapp}
            onChange={(e) => setMensajeWhatsapp(e.target.value)}
            placeholder="Ej: Llamar antes de las 11am o acudir directamente al consultorio 2"
            className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/60 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
          />
        </div>

        {/* Subida de Archivo Adjunto */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Foto, Captura de Pantalla o Documento (Opcional - Máx 10MB)
          </label>

          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileChange}
            accept=".jpg,.jpeg,.png,.webp,.pdf,.docx,.xlsx,.txt"
            className="hidden"
            id="soporte-adjunto-input"
          />

          {!archivo ? (
            <label
              htmlFor="soporte-adjunto-input"
              className="border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-2xl p-4 flex flex-col items-center justify-center gap-1.5 cursor-pointer hover:bg-blue-50/30 transition-all text-center group"
            >
              <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-700 flex items-center justify-center transition-colors">
                <Paperclip className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-700 group-hover:text-blue-700">
                Haz clic para adjuntar archivo
              </span>
              <span className="text-[11px] text-slate-400">
                Formatos permitidos: JPG, PNG, WEBP, PDF, DOCX, XLSX (hasta 10MB)
              </span>
            </label>
          ) : (
            <div className="flex items-center justify-between p-3 rounded-xl bg-blue-50 border border-blue-200/80 text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <Paperclip className="w-4 h-4 text-blue-600 shrink-0" />
                <div className="min-w-0">
                  <p className="font-bold text-slate-800 truncate">{archivo.name}</p>
                  <p className="text-[10px] text-slate-500">
                    {(archivo.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleRemoverArchivo}
                className="w-7 h-7 rounded-lg bg-white text-slate-500 hover:text-red-600 hover:bg-red-50 flex items-center justify-center transition-colors shrink-0 shadow-2xs cursor-pointer"
                title="Quitar archivo"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {archivoError && (
            <p className="mt-1 text-[11px] text-red-600 font-medium flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {archivoError}
            </p>
          )}
        </div>
      </div>

      {/* Botón de Envío */}
      <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-center gap-3">

        <Button
          type="submit"
          variant="primary"
          isLoading={isSubmitting}
          className="w-full sm:w-auto px-8 py-3 rounded-xl font-bold text-xs sm:text-sm bg-blue-700 hover:bg-blue-800 text-white shadow-lg shadow-blue-700/20 flex items-center justify-center gap-2 cursor-pointer"
        >
          <Send className="w-4 h-4" />
          <span>Enviar Ticket de Soporte</span>
        </Button>
      </div>
    </form>
  )
}
