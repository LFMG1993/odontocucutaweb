import React, { useState } from "react"
import { sedesConfig, siteConfig } from "@/data/siteConfig"
import { waLink } from "@/utils/contact"

interface ValoracionModalProps {
  open: boolean
  onClose: () => void
}

const serviciosValoracion = siteConfig.services

export function ValoracionModal({ open, onClose }: ValoracionModalProps) {
  const [nombre, setNombre] = useState("")
  const [celular, setCelular] = useState("")
  const [sedeId, setSedeId] = useState(sedesConfig[0].id)
  const [servicio, setServicio] = useState(serviciosValoracion[0])

  if (!open) return null

  const sede = sedesConfig.find((s) => s.id === sedeId) ?? sedesConfig[0]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const mensaje = [
      `Hola! Soy ${nombre}.`,
      `Quiero agendar una cita de valoración${servicio ? ` de ${servicio}` : ""}.`,
      `Mi celular de contacto es ${celular}.`,
      `Sede: ${sede.nombre}.`,
      "¿Podrían confirmarme si hay citas disponibles?",
    ].join(" ")

    window.open(waLink(sede.celular, mensaje), "_blank", "noopener,noreferrer")
    onClose()
    setNombre("")
    setCelular("")
    setSedeId(sedesConfig[0].id)
    setServicio(serviciosValoracion[0])
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-lg p-8 relative shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition text-2xl leading-none"
        >
          ✕
        </button>

        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-black text-slate-900">Agenda tu Valoración</h3>
            <p className="text-sm text-slate-500">
              Completa tus datos y te enviaremos el mensaje a la sede de tu preferencia para confirmar disponibilidad.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Tu Nombre</label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary outline-none text-sm"
                placeholder="Ej: Laura Castro"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Número de Celular</label>
              <input
                type="tel"
                value={celular}
                onChange={(e) => setCelular(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary outline-none text-sm"
                placeholder="Ej: 315 123 4567"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Sede *</label>
                <select
                  value={sedeId}
                  onChange={(e) => setSedeId(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm"
                >
                  {sedesConfig.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.nombre}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Servicio</label>
                <select
                  value={servicio}
                  onChange={(e) => setServicio(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm"
                >
                  {serviciosValoracion.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-primary hover:bg-primary-hover text-white font-extrabold py-3.5 rounded-xl transition text-base shadow-lg"
            >
              Confirmar por WhatsApp
            </button>
            <p className="text-xs text-center text-slate-400">
              Al confirmar se abrirá WhatsApp con un mensaje listo para enviar a la sede seleccionada.
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
