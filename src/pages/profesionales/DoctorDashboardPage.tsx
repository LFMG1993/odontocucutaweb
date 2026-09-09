import React from 'react'
import {
  RotateCcw,
  Search,
  AlertCircle,
  FileSpreadsheet,
  X,
} from 'lucide-react'
import { useLiquidaciones } from '@/hooks/profesionales/useLiquidaciones'
import {
  PeriodoSelector,
  MetricCard,
  DesgloseSedesCard,
  ProcedimientoCard,
} from '@/components/profesionales'
import { SEO } from '@/components/shared'

export const DoctorDashboardPage: React.FC = () => {
  const {
    data,
    loading,
    error,
    filtros,
    setFiltros,
    refetch,
    searchTerm,
    setSearchTerm,
    selectedSede,
    setSelectedSede,
    filteredProcedimientos,
    sedesDisponibles,
  } = useLiquidaciones()

  return (
    <div className="space-y-4">
      <SEO
        title="Liquidaciones y Ganancias — Portal Profesionales"
        description="Consulta tus liquidaciones, procedimientos realizados y comisiones devengadas."
      />

      {/* Barra superior de control de periodo y actualización */}
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <PeriodoSelector filtros={filtros} onChange={setFiltros} />
        </div>
        <button
          onClick={() => refetch()}
          disabled={loading}
          title="Actualizar datos"
          className="h-14 w-12 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-center text-slate-600 hover:text-blue-700 hover:border-blue-300 transition-colors disabled:opacity-50"
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
              <p className="font-bold">Error al cargar liquidaciones</p>
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
          <p className="text-xs font-medium text-slate-500">Calculando tus liquidaciones...</p>
        </div>
      )}

      {/* Contenido con datos disponibles */}
      {data && (
        <div className="space-y-4 animate-fade-in-entry">
          {/* Métricas Hero y Secundarias */}
          <MetricCard resumen={data.resumen} />

          {/* Desglose por Sede */}
          <DesgloseSedesCard
            desglose={data.resumen.desglose_por_sede}
            total={data.resumen.total_a_liquidar}
          />

          {/* Sección de Procedimientos Realizados */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-slate-900 tracking-tight">
                  Detalle de Procedimientos
                </h3>
                <p className="text-[11px] text-slate-500">
                  Mostrando {filteredProcedimientos.length} de {data.procedimientos.length} registros
                </p>
              </div>
            </div>

            {/* Buscador móvil */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar paciente, prestación, boleta..."
                className="w-full pl-9 pr-8 py-2 text-xs rounded-xl bg-white border border-slate-200/80 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Filtro por Sedes (Chips táctiles) */}
            {sedesDisponibles.length > 1 && (
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                <button
                  onClick={() => setSelectedSede('todas')}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors shrink-0 ${
                    selectedSede === 'todas'
                      ? 'bg-blue-700 text-white'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  Todas las sedes
                </button>
                {sedesDisponibles.map((sede) => (
                  <button
                    key={sede}
                    onClick={() => setSelectedSede(sede)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors shrink-0 ${
                      selectedSede === sede
                        ? 'bg-blue-700 text-white'
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {sede}
                  </button>
                ))}
              </div>
            )}

            {/* Listado de Procedimientos */}
            {filteredProcedimientos.length > 0 ? (
              <div className="space-y-2.5">
                {filteredProcedimientos.map((proc) => (
                  <ProcedimientoCard key={proc.id_detalle_dl} procedimiento={proc} />
                ))}
              </div>
            ) : (
              <div className="text-center py-10 px-4 bg-white rounded-2xl border border-dashed border-slate-200">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center mb-2">
                  <FileSpreadsheet className="w-6 h-6" />
                </div>
                <p className="text-xs font-bold text-slate-700">
                  No se encontraron procedimientos
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {searchTerm || selectedSede !== 'todas'
                    ? 'Intenta ajustar los filtros de búsqueda o sede'
                    : 'No hay registros realizados en el periodo seleccionado'}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
