import React from 'react'
import { MapPin } from 'lucide-react'
import { formatCurrency } from '@/utils/formatters'

interface DesgloseSedesCardProps {
  desglose: Record<string, number>
  total: number
}

export const DesgloseSedesCard: React.FC<DesgloseSedesCardProps> = ({ desglose, total }) => {
  const sedes = Object.entries(desglose || {})

  if (sedes.length === 0) return null

  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
      <div className="flex items-center gap-2 mb-3">
        <MapPin className="w-4 h-4 text-blue-600" />
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
          Distribución por Sede
        </h3>
      </div>

      <div className="space-y-3">
        {sedes.map(([sede, monto]) => {
          const percentage = total > 0 ? Math.round((monto / total) * 100) : 0
          return (
            <div key={sede} className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-800 truncate pr-2 max-w-[200px] sm:max-w-none">
                  {sede}
                </span>
                <span className="font-bold text-slate-900">{formatCurrency(monto)}</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden flex">
                <div
                  className="bg-blue-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                />
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 font-medium">
                  {percentage}% del total
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
