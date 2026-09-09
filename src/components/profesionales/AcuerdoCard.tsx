import React from 'react'
import { Percent, DollarSign, MapPin, Stethoscope, Calendar } from 'lucide-react'
import type { AcuerdoTarifario } from '@/types/profesionales'
import { formatDateShort, formatCurrency } from '@/utils/formatters'

interface AcuerdoCardProps {
  acuerdo: AcuerdoTarifario
  tipo: 'personal' | 'clinica'
}

export const AcuerdoCard: React.FC<AcuerdoCardProps> = ({ acuerdo, tipo }) => {
  const tipoCalculo = String(acuerdo.tipo_calculo || 'PORCENTAJE').toUpperCase()
  const isPercent = tipoCalculo === 'PORCENTAJE'

  const valorNum = parseFloat(String(acuerdo.valor ?? '0'))
  const displayValor = isPercent
    ? `${isNaN(valorNum) ? '0' : valorNum}%`
    : formatCurrency(acuerdo.valor)

  const aplicaSobre = acuerdo.aplica_sobre
    ? `Sobre ${String(acuerdo.aplica_sobre).replace(/_/g, ' ')}`
    : 'General'

  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-2.5">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <div
            className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
              tipo === 'personal'
                ? 'bg-blue-50 text-blue-700'
                : 'bg-indigo-50 text-indigo-700'
            }`}
          >
            {isPercent ? <Percent className="w-4 h-4" /> : <DollarSign className="w-4 h-4" />}
          </div>
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  tipo === 'personal'
                    ? 'bg-blue-50 text-blue-700 border border-blue-100'
                    : 'bg-slate-100 text-slate-700'
                }`}
              >
                {tipo === 'personal' ? 'Acuerdo Personal' : 'Regla Clínica'}
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                {aplicaSobre}
              </span>
            </div>
          </div>
        </div>

        <div className="text-right">
          <span className="text-base sm:text-lg font-black text-slate-900">
            {displayValor}
          </span>
          <span className="block text-[10px] text-slate-400 uppercase font-semibold">
            {tipoCalculo}
          </span>
        </div>
      </div>

      <div className="space-y-1 pt-1 border-t border-slate-100">
        <div className="flex items-start gap-1.5 text-xs text-slate-700 font-semibold">
          <Stethoscope className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
          <span>{acuerdo.nombre_prestacion || 'Todas las prestaciones'}</span>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>{acuerdo.nombre_sucursal || 'Todas las sedes'}</span>
        </div>

        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 pt-0.5">
          <Calendar className="w-3 h-3 text-slate-400" />
          <span>
            Vigencia: {formatDateShort(acuerdo.fecha_inicio)}
            {acuerdo.fecha_fin ? ` al ${formatDateShort(acuerdo.fecha_fin)}` : ' (Indefinida)'}
          </span>
        </div>
      </div>
    </div>
  )
}
