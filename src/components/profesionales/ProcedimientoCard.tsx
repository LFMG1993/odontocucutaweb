import React, { useState } from 'react'
import { ChevronDown, User, Calendar, MapPin, ClipboardList } from 'lucide-react'
import type { ProcedimientoLiquidado } from '@/types/profesionales'
import { formatCurrency, formatDateShort, formatSede } from '@/utils/formatters'

interface ProcedimientoCardProps {
  procedimiento: ProcedimientoLiquidado
}

export const ProcedimientoCard: React.FC<ProcedimientoCardProps> = ({ procedimiento }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden transition-all duration-200 hover:border-blue-300">
      {/* Cabecera compacta móvil */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-3.5 cursor-pointer flex items-start justify-between gap-3 select-none"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap mb-1">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
              CUPS {procedimiento.codigo_cups}
            </span>
          </div>

          <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug truncate">
            {procedimiento.nombre_prestacion}
          </h4>

          <div className="flex items-center gap-1.5 mt-1 text-[11px] text-slate-500">
            <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="font-semibold text-slate-700 truncate">
              {procedimiento.paciente_nombre}
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-500 shrink-0">Doc: {procedimiento.paciente_documento}</span>
          </div>
        </div>

        {/* Monto devengado por el profesional */}
        <div className="text-right shrink-0">
          <p className="text-sm sm:text-base font-extrabold text-emerald-600">
            +{formatCurrency(procedimiento.pago_profesional)}
          </p>
          <div className="flex items-center justify-end gap-1 mt-0.5 text-slate-400">
            <span className="text-[10px] font-medium">Detalle</span>
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform duration-200 ${
                isExpanded ? 'rotate-180' : ''
              }`}
            />
          </div>
        </div>
      </div>

      {/* Detalle expandible */}
      {isExpanded && (
        <div className="px-3.5 pb-3.5 pt-1 border-t border-slate-100 bg-slate-50/50 text-xs space-y-2 animate-fade-in-entry">
          <div className="grid grid-cols-2 gap-2 pt-2">
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1">
                <Calendar className="w-3 h-3" /> Fecha Realización
              </p>
              <p className="font-medium text-slate-700 mt-0.5">
                {formatDateShort(procedimiento.fecha_realizacion)}
              </p>
            </div>

            <div>
              <p className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1">
                <MapPin className="w-3 h-3" /> Sede
              </p>
              <p className="font-medium text-slate-700 mt-0.5 truncate">
                {formatSede(procedimiento.sede)}
              </p>
            </div>
          </div>

          <div className="pt-1 border-t border-slate-200/50">
            <p className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1">
              <ClipboardList className="w-3 h-3" /> Tratamiento
            </p>
            <p className="font-semibold text-slate-700 mt-0.5 truncate">
              {procedimiento.nombre_tratamiento || 'No especificado'}
            </p>
          </div>

          <div className="p-2.5 rounded-xl bg-white border border-slate-200/80 mt-2 space-y-1">
            <div className="flex justify-between text-slate-600">
              <span>Base liquidación:</span>
              <span className="font-medium">{formatCurrency(procedimiento.base_calculo)}</span>
            </div>
            <div className="flex justify-between text-slate-900 font-bold pt-1 border-t border-slate-100">
              <span>Estimado a pagar:</span>
              <span className="text-emerald-600 font-extrabold">
                {formatCurrency(procedimiento.pago_profesional)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
