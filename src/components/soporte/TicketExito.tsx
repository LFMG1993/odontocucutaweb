import React from 'react'
import {
  CheckCircle2,
  Copy,
  Check,
  PlusCircle,
  MessageCircle,
} from 'lucide-react'
import { Button } from '@/components/shared'

interface TicketExitoProps {
  ticketUuid: string
  solicitante: string
  sede: string
  motivo: string
  onNuevoTicket: () => void
}

export const TicketExito: React.FC<TicketExitoProps> = ({
  ticketUuid,
  solicitante,
  sede,
  motivo,
  onNuevoTicket,
}) => {
  const [copiado, setCopiado] = React.useState(false)

  const shortCode = ticketUuid.slice(0, 8).toUpperCase()

  const handleCopiar = () => {
    navigator.clipboard.writeText(ticketUuid)
    setCopiado(true)
    setTimeout(() => setCopiado(false), 2000)
  }

  const whatsappText = encodeURIComponent(
    `Hola equipo de Soporte TI OdontoCúcuta. Reporté la incidencia #${shortCode} (${motivo}) en la ${sede} a nombre de ${solicitante}. UUID: ${ticketUuid}`
  )

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-xl shadow-slate-200/50 text-center max-w-xl mx-auto animate-fade-in-entry">
      <div className="w-20 h-20 mx-auto rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5 border-4 border-emerald-100/60 shadow-inner">
        <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
      </div>

      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200/80 mb-2">
        Incidencia Registrada Exitosamente
      </span>

      <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
        ¡Ticket de Soporte Creado!
      </h2>
      <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-md mx-auto leading-relaxed">
        El equipo de soporte tecnológico ha recibido tu solicitud y se encuentra procesándola según la prioridad indicada.
      </p>

      {/* Tarjeta con Código de Ticket */}
      <div className="my-6 p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/80 text-left space-y-3">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Radicado Técnico
            </span>
            <span className="text-lg font-mono font-black text-blue-700">
              #{shortCode}
            </span>
          </div>
          <button
            onClick={handleCopiar}
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white border border-slate-200 hover:border-blue-300 text-slate-700 hover:text-blue-700 transition-colors shadow-xs cursor-pointer"
          >
            {copiado ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiado ? '¡Copiado!' : 'Copiar UUID'}</span>
          </button>
        </div>

        <div className="text-xs space-y-1 text-slate-600">
          <p>
            <strong className="text-slate-900 font-semibold">Solicitante:</strong> {solicitante}
          </p>
          <p>
            <strong className="text-slate-900 font-semibold">Sede:</strong> {sede}
          </p>
          <p>
            <strong className="text-slate-900 font-semibold">Motivo:</strong> {motivo}
          </p>
          <p className="font-mono text-[11px] text-slate-400 truncate pt-1">
            UUID: {ticketUuid}
          </p>
        </div>
      </div>

      {/* Acciones Rápidas */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <a
          href={`https://wa.me/573181441442?text=${whatsappText}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/20"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Avisar por WhatsApp</span>
        </a>

        <Button
          onClick={onNuevoTicket}
          variant="outline"
          className="w-full sm:w-auto py-3 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Reportar Otra Falla</span>
        </Button>
      </div>
    </div>
  )
}
