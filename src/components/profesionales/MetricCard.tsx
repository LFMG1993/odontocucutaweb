import React from 'react'
import { Activity, MapPin, Users } from 'lucide-react'
import type { ResumenLiquidacion } from '@/types/profesionales'

interface MetricCardProps {
  resumen: ResumenLiquidacion
}

export const MetricCard: React.FC<MetricCardProps> = ({ resumen }) => {
  const totalSedes = Object.keys(resumen.desglose_por_sede || {}).length

  return (
    <div className="space-y-3">
      {/* KPI principal: procedimientos realizados en el mes */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-blue-900 via-blue-800 to-indigo-950 p-5 text-white shadow-xl shadow-blue-950/20">
        <div className="absolute top-0 right-0 -mr-6 -mt-6 w-32 h-32 rounded-full bg-white/5 blur-2xl pointer-events-none" />
        <div className="flex items-center justify-between mb-3">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md text-[11px] font-semibold text-blue-100 border border-white/10">
            <Activity className="w-3.5 h-3.5 text-blue-300" />
            Procedimientos del mes
          </span>
          <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-2 py-0.5 rounded-full">
            Mes actual
          </span>
        </div>

        <div className="mt-1">
          <p className="text-5xl sm:text-6xl font-black tracking-tight text-white drop-shadow-xs">
            {resumen.total_procedimientos}
          </p>
          <p className="text-xs text-blue-200/80 mt-1 font-medium">
            Procedimientos realizados durante el periodo actual
          </p>
        </div>
      </div>

      {/* KPIs secundarios */}
      <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
        <div className="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-2">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xl sm:text-2xl font-black text-slate-900">
              {resumen.total_pacientes_unicos}
            </p>
            <p className="text-[11px] font-medium text-slate-500">Pacientes atendidos</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center mb-2">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xl sm:text-2xl font-black text-slate-900">{totalSedes}</p>
            <p className="text-[11px] font-medium text-slate-500">Sedes con actividad</p>
          </div>
        </div>
      </div>
    </div>
  )
}
