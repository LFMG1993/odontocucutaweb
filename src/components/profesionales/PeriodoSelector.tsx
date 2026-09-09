import React, { useState } from 'react'
import { Calendar, ChevronDown, Check } from 'lucide-react'
import type { LiquidacionFiltros } from '@/types/profesionales'
import { formatDateShort } from '@/utils/formatters'

interface PeriodoSelectorProps {
  filtros: LiquidacionFiltros
  onChange: (nuevosFiltros: LiquidacionFiltros) => void
}

export const PeriodoSelector: React.FC<PeriodoSelectorProps> = ({ filtros, onChange }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [customDesde, setCustomDesde] = useState(filtros.desde || '')
  const [customHasta, setCustomHasta] = useState(filtros.hasta || '')

  const aplicarMesActual = () => {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const lastDay = new Date(year, now.getMonth() + 1, 0).getDate()
    onChange({
      desde: `${year}-${month}-01`,
      hasta: `${year}-${month}-${String(lastDay).padStart(2, '0')}`,
    })
    setIsOpen(false)
  }

  const aplicarMesPasado = () => {
    const now = new Date()
    const prevMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const year = prevMonthDate.getFullYear()
    const month = String(prevMonthDate.getMonth() + 1).padStart(2, '0')
    const lastDay = new Date(year, prevMonthDate.getMonth() + 1, 0).getDate()
    onChange({
      desde: `${year}-${month}-01`,
      hasta: `${year}-${month}-${String(lastDay).padStart(2, '0')}`,
    })
    setIsOpen(false)
  }

  const aplicarPersonalizado = (e: React.FormEvent) => {
    e.preventDefault()
    if (customDesde && customHasta) {
      onChange({
        desde: customDesde,
        hasta: customHasta,
      })
      setIsOpen(false)
    }
  }

  return (
    <div className="relative w-full">
      <div className="flex items-center justify-between bg-white rounded-2xl p-3 border border-slate-200/80 shadow-xs">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2.5 text-left w-full cursor-pointer focus:outline-none"
        >
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
            <Calendar className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Periodo de Consulta
            </span>
            <span className="block text-xs sm:text-sm font-bold text-slate-800 truncate">
              {formatDateShort(filtros.desde)} — {formatDateShort(filtros.hasta)}
            </span>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>
      </div>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-xs"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 animate-fade-in-entry">
            <p className="text-xs font-bold text-slate-700 mb-2">Selecciona un periodo:</p>

            <div className="grid grid-cols-2 gap-2 mb-3">
              <button
                type="button"
                onClick={aplicarMesActual}
                className="py-2 px-3 rounded-xl border border-blue-200 bg-blue-50/50 hover:bg-blue-50 text-blue-700 font-semibold text-xs transition-colors text-center"
              >
                Mes Actual
              </button>
              <button
                type="button"
                onClick={aplicarMesPasado}
                className="py-2 px-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-xs transition-colors text-center"
              >
                Mes Pasado
              </button>
            </div>

            <form onSubmit={aplicarPersonalizado} className="space-y-2.5 pt-2 border-t border-slate-100">
              <p className="text-[11px] font-semibold text-slate-500 uppercase">Rango Personalizado</p>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] text-slate-500 mb-0.5">Desde</label>
                  <input
                    type="date"
                    value={customDesde}
                    onChange={(e) => setCustomDesde(e.target.value)}
                    required
                    className="w-full text-xs py-1.5 px-2 rounded-lg border border-slate-200 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-500 mb-0.5">Hasta</label>
                  <input
                    type="date"
                    value={customHasta}
                    onChange={(e) => setCustomHasta(e.target.value)}
                    required
                    className="w-full text-xs py-1.5 px-2 rounded-lg border border-slate-200 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full mt-2 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Check className="w-3.5 h-3.5" />
                Aplicar Rango
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  )
}
