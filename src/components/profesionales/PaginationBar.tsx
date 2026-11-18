import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationBarProps {
  /** Página actual, empezando en 1 */
  pagina: number
  /** Total de páginas (mínimo 1) */
  paginas: number
  /** Primer registro visible de la página */
  inicio: number
  /** Último registro visible de la página */
  fin: number
  total: number
  puedeAnterior: boolean
  puedeSiguiente: boolean
  onAnterior: () => void
  onSiguiente: () => void
}

export const PaginationBar: React.FC<PaginationBarProps> = ({
  pagina,
  paginas,
  inicio,
  fin,
  total,
  puedeAnterior,
  puedeSiguiente,
  onAnterior,
  onSiguiente,
}) => (
  <div className="flex items-center justify-between gap-2 bg-white rounded-2xl border border-slate-200/80 px-3 py-2.5">
    <button
      type="button"
      onClick={onAnterior}
      disabled={!puedeAnterior}
      aria-label="Página anterior"
      className="h-9 w-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-600 hover:text-blue-700 hover:border-blue-300 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
    >
      <ChevronLeft className="w-4 h-4" aria-hidden="true" />
    </button>

    <div className="text-center min-w-0">
      <p className="text-[11px] font-bold text-slate-700">
        Página {pagina} de {paginas}
      </p>
      <p className="text-[10px] text-slate-400">
        Mostrando {inicio}–{fin} de {total}
      </p>
    </div>

    <button
      type="button"
      onClick={onSiguiente}
      disabled={!puedeSiguiente}
      aria-label="Página siguiente"
      className="h-9 w-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-600 hover:text-blue-700 hover:border-blue-300 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
    >
      <ChevronRight className="w-4 h-4" aria-hidden="true" />
    </button>
  </div>
)
