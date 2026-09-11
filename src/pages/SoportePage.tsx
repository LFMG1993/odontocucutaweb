import React, { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  RotateCcw,
  AlertCircle,
} from 'lucide-react'
import { useSoporte } from '@/hooks/soporte'
import { SoporteForm, EquipoBanner, TicketExito } from '@/components/soporte'
import { SEO } from '@/components/shared'
import type { CrearTicketPayload } from '@/types/soporte'

export const SoportePage: React.FC = () => {
  const [searchParams] = useSearchParams()
  const equipoId = searchParams.get('equipo_id')

  const {
    catalogos,
    loadingCatalogos,
    catalogosError,
    reloadCatalogos,
    isSubmitting,
    submitError,
    validationErrors,
    ticketCreado,
    submitTicket,
    resetFormStatus,
  } = useSoporte(equipoId)

  const [lastSubmitted, setLastSubmitted] = useState<{
    solicitante: string
    sede: string
    motivo: string
  } | null>(null)

  const handleFormSubmit = async (payload: CrearTicketPayload) => {
    setLastSubmitted({
      solicitante: payload.solicitante,
      sede: payload.sede,
      motivo: payload.motivo,
    })
    await submitTicket(payload)
  }

  const handleNuevoTicket = () => {
    resetFormStatus()
    setLastSubmitted(null)
  }

  return (
    <div className="min-h-screen bg-slate-50/50 py-10 lg:py-16">
      <SEO
        title="Mesa de Ayuda y Soporte TI — OdontoCúcuta"
        description="Portal público para reporte de incidencias técnicas, equipos clínicos y conectividad en OdontoCúcuta."
      />

      <div className="container-main">
        <div className="max-w-4xl mx-auto space-y-6 py-8">

          {/* Banner de Equipo si fue escaneado por QR */}
          {catalogos?.equipo && <EquipoBanner equipo={catalogos.equipo} />}

          {/* Estado de Carga Inicial */}
          {loadingCatalogos && (
            <div className="bg-white rounded-3xl p-12 border border-slate-200/80 shadow-sm text-center">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-sm font-bold text-slate-800">Conectando con la Mesa de Ayuda...</p>
              <p className="text-xs text-slate-400 mt-1">Cargando sedes y catálogos técnicos vigentes</p>
            </div>
          )}

          {/* Estado de Error al Cargar Catálogos */}
          {catalogosError && (
            <div className="p-5 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fade-in-entry shadow-sm">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-black text-sm text-red-900">No fue posible cargar el formulario</h4>
                  <p className="mt-0.5 text-red-700">{catalogosError}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={reloadCatalogos}
                className="px-4 py-2 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer shadow-xs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reintentar</span>
              </button>
            </div>
          )}

          {/* Mensaje de Error al Enviar Ticket */}
          {submitError && (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-3 animate-fade-in-entry shadow-xs">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-red-900">Atención al enviar el ticket</h4>
                <p className="mt-0.5 text-red-700">{submitError}</p>
              </div>
            </div>
          )}

          {/* Vista Condicional: Éxito vs Formulario */}
          {ticketCreado && lastSubmitted ? (
            <TicketExito
              ticketUuid={ticketCreado.ticket_uuid}
              solicitante={lastSubmitted.solicitante}
              sede={lastSubmitted.sede}
              motivo={lastSubmitted.motivo}
              onNuevoTicket={handleNuevoTicket}
            />
          ) : (
            catalogos && (
              <SoporteForm
                catalogos={catalogos}
                onSubmit={handleFormSubmit}
                isSubmitting={isSubmitting}
                validationErrors={validationErrors}
              />
            )
          )}

        </div>
      </div>
    </div>
  )
}
