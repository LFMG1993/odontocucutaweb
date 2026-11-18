import React, { useMemo, useState } from 'react'
import {
  AlertCircle,
  ClipboardList,
  FileSpreadsheet,
  FileText,
  Loader2,
  RotateCcw,
  Search,
  X,
} from 'lucide-react'
import { createColumnHelper, useTable } from '@tanstack/react-table'
import { useLiquidaciones } from '@/hooks/profesionales/useLiquidaciones'
import { useDoctorAuthStore } from '@/store/profesionales'
import { PaginationBar, PeriodoSelector, ProcedimientoCard } from '@/components/profesionales'
import { SEO } from '@/components/shared'
import { formatCurrency, formatSede } from '@/utils/formatters'
import {
  featuresTablaPaginada,
  OPCIONES_POR_PAGINA,
  TAMANO_PAGINA_INICIAL,
} from '@/utils/tablaPaginada'
import type { LiquidacionFiltros, ProcedimientoLiquidado } from '@/types/profesionales'
import { exportLiquidacionesExcel, exportLiquidacionesPdf } from '@/utils/liquidacionesExport'

type FormatoExport = 'excel' | 'pdf'

// TanStack Table es headless: solo aporta el paginado, las tarjetas conservan su diseño.
const columnHelper = createColumnHelper<typeof featuresTablaPaginada, ProcedimientoLiquidado>()

const columns = columnHelper.columns([
  columnHelper.accessor('fecha_realizacion', { header: 'Fecha' }),
  columnHelper.accessor('paciente_nombre', { header: 'Paciente' }),
  columnHelper.accessor('paciente_documento', { header: 'Documento' }),
  columnHelper.accessor('nombre_prestacion', { header: 'Prestación' }),
  columnHelper.accessor('codigo_cups', { header: 'CUPS' }),
  columnHelper.accessor('sede', { header: 'Sede' }),
  columnHelper.accessor('pago_profesional', { header: 'Pago' }),
])

export const DoctorLiquidacionesPage: React.FC = () => {
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

  const user = useDoctorAuthStore((state) => state.user)
  const profile = useDoctorAuthStore((state) => state.profile)

  const [exportando, setExportando] = useState<FormatoExport | null>(null)
  const [exportError, setExportError] = useState<string | null>(null)

  const table = useTable({
    features: featuresTablaPaginada,
    columns,
    data: filteredProcedimientos,
    initialState: { pagination: { pageIndex: 0, pageSize: TAMANO_PAGINA_INICIAL } },
  })

  const { pageIndex, pageSize } = table.state.pagination
  const filas = table.getRowModel().rows
  const total = filteredProcedimientos.length
  const paginas = Math.max(1, table.getPageCount())
  const inicio = filas.length === 0 ? 0 : pageIndex * pageSize + 1
  const fin = pageIndex * pageSize + filas.length

  const profesional = useMemo(() => {
    if (profile) return `${profile.nombre} ${profile.apellidos}`.trim()
    return user?.nombre_profesional?.trim() || ''
  }, [profile, user])

  const totalFiltrado = useMemo(
    () =>
      filteredProcedimientos.reduce(
        (total, procedimiento) => total + (Number(procedimiento.pago_profesional) || 0),
        0
      ),
    [filteredProcedimientos]
  )

  // Al cambiar los datos volvemos a la primera página para no quedar en un índice inválido
  const cambiarPeriodo = (nuevos: LiquidacionFiltros) => {
    table.resetPageIndex()
    setFiltros(nuevos)
  }

  const cambiarBusqueda = (valor: string) => {
    table.resetPageIndex()
    setSearchTerm(valor)
  }

  const cambiarSede = (sede: string) => {
    table.resetPageIndex()
    setSelectedSede(sede)
  }

  const actualizar = () => {
    table.resetPageIndex()
    refetch()
  }

  const handleExport = async (formato: FormatoExport) => {
    if (!data || filteredProcedimientos.length === 0) return
    setExportError(null)
    setExportando(formato)

    try {
      // Se exporta todo el resultado filtrado, no solo la página visible
      const params = {
        periodo: data.periodo,
        procedimientos: filteredProcedimientos,
        profesional,
        sedeFiltro: selectedSede,
        busqueda: searchTerm.trim(),
      }

      if (formato === 'excel') {
        await exportLiquidacionesExcel(params)
      } else {
        await exportLiquidacionesPdf(params)
      }
    } catch (err) {
      console.error('Error generando la exportación de liquidaciones:', err)
      setExportError(
        `No se pudo generar el archivo ${formato === 'excel' ? 'Excel' : 'PDF'}. Intenta nuevamente.`
      )
    } finally {
      setExportando(null)
    }
  }

  return (
    <div className="space-y-4">
      <SEO
        title="Liquidaciones — Portal Profesionales"
        description="Consulta los procedimientos realizados en el rango de fechas que elijas y su liquidación."
      />

      {/* Encabezado */}
      <div>
        <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
          Liquidaciones
        </h1>
      </div>

      {/* Selector de periodo + actualización */}
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <PeriodoSelector filtros={filtros} onChange={cambiarPeriodo} />
        </div>
        <button
          onClick={actualizar}
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
              <p className="font-bold">Error al cargar las liquidaciones</p>
              <p className="mt-0.5">{error}</p>
            </div>
          </div>
          <button
            onClick={actualizar}
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

      {data && (
        <div className="space-y-4 animate-fade-in-entry">
          {/* Resumen del filtro actual */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-xs">
              <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                Procedimientos
              </p>
              <p className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                {filteredProcedimientos.length}
              </p>
              <p className="text-[11px] text-slate-500">
                de {data.procedimientos?.length ?? 0} registros
              </p>
            </div>

            <div className="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-xs">
              <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                Estimado a pagar
              </p>
              <p className="text-xl sm:text-2xl font-black text-emerald-600 mt-1">
                {formatCurrency(totalFiltrado)}
              </p>
              <p className="text-[11px] text-slate-500">según el filtro actual</p>
            </div>
          </div>

          {/* Exportación: una sola fila, iconos con el color del tipo de archivo */}
          <div className="bg-white rounded-2xl px-3.5 py-3 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-800">Exportar liquidación</p>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => handleExport('excel')}
                  disabled={exportando !== null || total === 0}
                  title="Descargar Excel (.xlsx)"
                  className="h-9 px-2.5 rounded-xl bg-white border border-slate-200 text-emerald-700 text-[11px] font-bold flex items-center gap-1.5 hover:bg-emerald-50 hover:border-emerald-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {exportando === 'excel' ? (
                    <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                  ) : (
                    <FileSpreadsheet className="w-4 h-4 text-emerald-600" aria-hidden="true" />
                  )}
                  Excel
                </button>

                <button
                  type="button"
                  onClick={() => handleExport('pdf')}
                  disabled={exportando !== null || total === 0}
                  title="Ver PDF (puedes descargarlo desde el visor)"
                  className="h-9 px-2.5 rounded-xl bg-white border border-slate-200 text-red-600 text-[11px] font-bold flex items-center gap-1.5 hover:bg-red-50 hover:border-red-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {exportando === 'pdf' ? (
                    <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                  ) : (
                    <FileText className="w-4 h-4 text-red-500" aria-hidden="true" />
                  )}
                  PDF
                </button>
              </div>
            </div>

            {exportError && (
              <p className="mt-2 text-[11px] font-medium text-red-600">{exportError}</p>
            )}
          </div>

          {/* Buscador */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => cambiarBusqueda(e.target.value)}
              placeholder="Buscar paciente, prestación o CUPS..."
              className="w-full pl-9 pr-8 py-2 text-xs rounded-xl bg-white border border-slate-200/80 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {searchTerm && (
              <button
                onClick={() => cambiarBusqueda('')}
                aria-label="Limpiar búsqueda"
                className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filtro por Sedes */}
          {sedesDisponibles.length > 1 && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              <button
                onClick={() => cambiarSede('todas')}
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
                  onClick={() => cambiarSede(sede)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors shrink-0 ${
                    selectedSede === sede
                      ? 'bg-blue-700 text-white'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {formatSede(sede)}
                </button>
              ))}
            </div>
          )}

          {/* Listado de Procedimientos */}
          {total > 0 ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-2 min-w-0">
                  <ClipboardList className="w-4 h-4 text-blue-600 shrink-0" aria-hidden="true" />
                  <span className="truncate">Procedimientos</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 shrink-0">
                    {total}
                  </span>
                </h2>

                <label className="flex items-center gap-1 shrink-0">
                  <span className="sr-only">Procedimientos por página</span>
                  <select
                    value={pageSize}
                    onChange={(e) => table.setPageSize(Number(e.target.value))}
                    className="text-[10px] font-bold rounded-lg border border-slate-200 bg-white text-slate-600 px-1.5 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {OPCIONES_POR_PAGINA.map((opcion) => (
                      <option key={opcion} value={opcion}>
                        {opcion} / pág.
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              {paginas > 1 && (
                <PaginationBar
                  pagina={pageIndex + 1}
                  paginas={paginas}
                  inicio={inicio}
                  fin={fin}
                  total={total}
                  puedeAnterior={table.getCanPreviousPage()}
                  puedeSiguiente={table.getCanNextPage()}
                  onAnterior={() => table.previousPage()}
                  onSiguiente={() => table.nextPage()}
                />
              )}

              <div className="space-y-2.5">
                {filas.map((fila) => (
                  <ProcedimientoCard
                    key={fila.original.id_detalle_dl}
                    procedimiento={fila.original}
                  />
                ))}
              </div>

              {paginas > 1 && (
                <PaginationBar
                  pagina={pageIndex + 1}
                  paginas={paginas}
                  inicio={inicio}
                  fin={fin}
                  total={total}
                  puedeAnterior={table.getCanPreviousPage()}
                  puedeSiguiente={table.getCanNextPage()}
                  onAnterior={() => table.previousPage()}
                  onSiguiente={() => table.nextPage()}
                />
              )}
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
      )}
    </div>
  )
}
