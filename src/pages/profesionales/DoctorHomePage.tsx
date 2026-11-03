import React from 'react'
import { Link } from 'react-router-dom'
import { AlertCircle, ArrowRight, RotateCcw } from 'lucide-react'
import { useLiquidaciones } from '@/hooks/profesionales/useLiquidaciones'
import { MetricCard } from '@/components/profesionales'
import { SEO } from '@/components/shared'
import { formatDateShort } from '@/utils/formatters'

const getMonthLabel = () =>
  new Date().toLocaleDateString('es-CO', { month: 'long', year: 'numeric' })

export const DoctorHomePage: React.FC = () => {
  const { data, loading, error, refetch, filtros } = useLiquidaciones()

  return (
    <div className="space-y-4">
      <SEO
        title="Inicio — Portal Profesionales"
        description="Resumen de tu actividad profesional: procedimientos realizados y pacientes atendidos durante el mes."
      />

      {/* Encabezado */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
            Inicio
          </h1>
          <p className="text-xs text-slate-500 capitalize">{getMonthLabel()}</p>
        </div>

        <button
          onClick={() => refetch()}
          disabled={loading}
          title="Actualizar datos"
          className="w-10 h-10 rounded-xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-center text-slate-600 hover:text-blue-700 hover:border-blue-300 transition-colors disabled:opacity-50 shrink-0"
        >
          <RotateCcw className={`w-4 h-4 ${loading ? 'animate-spin text-blue-600' : ''}`} />
        </button>
      </div>

      {/* Manejo de Error */}
      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start justify-between gap-3 animate-fade-in-entry">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
            <div>
              <p className="font-bold">Error al cargar el resumen</p>
              <p className="mt-0.5">{error}</p>
            </div>
          </div>
          <button
            onClick={() => refetch()}
            className="px-2.5 py-1 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors shrink-0"
          >
            Reintentar
          </button>
        </div>
      )}

      {/* Indicador de carga inicial */}
      {loading && !data && (
        <div className="py-12 flex flex-col items-center justify-center text-slate-400 gap-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-medium text-slate-500">Cargando tu resumen del mes...</p>
        </div>
      )}

      {data && (
        <div className="space-y-4 animate-fade-in-entry">
          <MetricCard resumen={data.resumen} />

          {/* Acceso a la vista detallada */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-800">¿Necesitas el detalle?</p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Filtra por fechas y consulta todos los procedimientos realizados.
              </p>
            </div>
            <Link
              to="/profesionales/liquidaciones"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-700 text-white text-xs font-semibold hover:bg-blue-800 transition-colors shrink-0"
            >
              Ver liquidaciones
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </Link>
          </div>

          <p className="text-[11px] text-center text-slate-400">
            Periodo consultado: {formatDateShort(filtros.desde)} — {formatDateShort(filtros.hasta)}
          </p>
        </div>
      )}
    </div>
  )
}
