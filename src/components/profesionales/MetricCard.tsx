import React from 'react'
import { Wallet, Activity, Users } from 'lucide-react'
import type { ResumenLiquidacion } from '@/types/profesionales'
import { formatCurrency } from '@/utils/formatters'

interface MetricCardProps {
  resumen: ResumenLiquidacion
}

export const MetricCard: React.FC<MetricCardProps> = ({ resumen }) => {
  return (
    <div className="space-y-3">
      {/* Tarjeta Principal Mobile Hero: Total a Liquidar */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-blue-900 via-blue-800 to-indigo-950 p-5 text-white shadow-xl shadow-blue-950/20">
        <div className="absolute top-0 right-0 -mr-6 -mt-6 w-32 h-32 rounded-full bg-white/5 blur-2xl pointer-events-none" />
        <div className="flex items-center justify-between mb-3">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md text-[11px] font-semibold text-blue-100 border border-white/10">
            <Wallet className="w-3.5 h-3.5 text-blue-300" />
            Total a Liquidar (Comisión)
          </span>
          <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-2 py-0.5 rounded-full">
            Devengado
          </span>
        </div>

        <div className="mt-1">
          <p className="text-3xl sm:text-4xl font-black tracking-tight text-white drop-shadow-xs">
            {formatCurrency(resumen.total_a_liquidar)}
          </p>
          <p className="text-xs text-blue-200/80 mt-1 font-medium">
            Monto correspondiente a tus procedimientos realizados
          </p>
        </div>
      </div>

      {/* Grid de Métricas Secundarias Móviles (2 columnas) */}
      <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
        {/* Procedimientos */}
        <div className="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center mb-2">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xl sm:text-2xl font-black text-slate-900">
              {resumen.total_procedimientos}
            </p>
            <p className="text-[11px] font-medium text-slate-500">
              Procedimientos Realizados
            </p>
          </div>
        </div>

        {/* Pacientes Únicos */}
        <div className="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-2">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xl sm:text-2xl font-black text-slate-900">
              {resumen.total_pacientes_unicos}
            </p>
            <p className="text-[11px] font-medium text-slate-500">
              Pacientes Atendidos
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
