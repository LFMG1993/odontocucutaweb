import React from 'react'
import {
  AlertCircle,
  Building2,
  CalendarClock,
  ChevronDown,
  FileSpreadsheet,
  Percent,
  RotateCcw,
  Search,
  UserCheck,
} from 'lucide-react'
import { createColumnHelper, useTable } from '@tanstack/react-table'
import { useAcuerdos } from '@/hooks/profesionales/useAcuerdos'
import type { AcuerdoTarifario } from '@/types/profesionales'
import { PaginationBar } from '@/components/profesionales'
import { SEO } from '@/components/shared'
import { formatCurrency, formatDateShort } from '@/utils/formatters'
import {
  featuresTablaPaginada,
  OPCIONES_POR_PAGINA,
  TAMANO_PAGINA_INICIAL,
} from '@/utils/tablaPaginada'

const APLICA_SOBRE_LABEL: Record<string, string> = {
  REALIZADO: 'Sobre lo realizado',
  ABONADO: 'Sobre lo abonado',
  BASE_LIQUIDACION: 'Sobre la base de liquidación',
}

const columnHelper = createColumnHelper<typeof featuresTablaPaginada, AcuerdoTarifario>()

const columns = columnHelper.columns([
  columnHelper.accessor((row) => row.codigo_cups ?? '', { id: 'codigo_cups', header: 'Código' }),
  columnHelper.accessor((row) => row.nombre_prestacion ?? '', {
    id: 'nombre_prestacion',
    header: 'Prestación',
  }),
  columnHelper.accessor((row) => row.nombre_convenio ?? '', {
    id: 'nombre_convenio',
    header: 'Convenio',
  }),
  columnHelper.accessor((row) => row.nombre_sucursal ?? '', {
    id: 'nombre_sucursal',
    header: 'Sede',
  }),
  columnHelper.accessor('tipo_calculo', { header: 'Tipo' }),
  columnHelper.accessor('valor', { header: 'Valor' }),
])

function valorFormateado(acuerdo: AcuerdoTarifario): string {
  if (acuerdo.tipo_calculo === 'FIJO') {
    return formatCurrency(acuerdo.valor)
  }
  const numero = Number(acuerdo.valor)
  return Number.isFinite(numero) ? `${numero.toLocaleString('es-CO')}%` : `${acuerdo.valor}%`
}

const AcuerdoCard: React.FC<{ acuerdo: AcuerdoTarifario; esPersonal: boolean }> = ({
  acuerdo,
  esPersonal,
}) => (
  <article className="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-xs space-y-2">
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap mb-1">
          {acuerdo.codigo_cups && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
              CUPS {acuerdo.codigo_cups}
            </span>
          )}
          {acuerdo.nombre_convenio && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
              {acuerdo.nombre_convenio}
            </span>
          )}
        </div>

        <p className="text-xs font-bold text-slate-800 leading-snug">
          {acuerdo.nombre_prestacion || 'Todas las prestaciones'}
        </p>
        <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
          <Building2 className="w-3 h-3 text-slate-400" aria-hidden="true" />
          {acuerdo.nombre_sucursal || 'Todas las sedes'}
        </p>
      </div>
      <div className="text-right shrink-0">
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100 text-[10px] font-bold">
          {acuerdo.tipo_calculo === 'PORCENTAJE' ? (
            <Percent className="w-2.5 h-2.5" aria-hidden="true" />
          ) : (
            <FileSpreadsheet className="w-2.5 h-2.5" aria-hidden="true" />
          )}
          {acuerdo.tipo_calculo}
        </span>
        <p className="text-sm font-black text-slate-900 mt-1">{valorFormateado(acuerdo)}</p>
      </div>
    </div>

    <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-slate-500">
      <span className="font-semibold text-slate-600">
        {APLICA_SOBRE_LABEL[acuerdo.aplica_sobre] || acuerdo.aplica_sobre}
      </span>
      <span className="inline-flex items-center gap-1">
        <CalendarClock className="w-3 h-3 text-slate-400" aria-hidden="true" />
        Desde {formatDateShort(acuerdo.fecha_inicio)}
        {acuerdo.fecha_fin ? ` hasta ${formatDateShort(acuerdo.fecha_fin)}` : ' · vigente'}
      </span>
      <span
        className={`inline-flex items-center gap-1 font-semibold ${
          esPersonal ? 'text-emerald-600' : 'text-slate-500'
        }`}
      >
        <UserCheck className="w-3 h-3" aria-hidden="true" />
        {esPersonal ? 'Acuerdo personal' : 'Tarifa del convenio'}
      </span>
    </div>
  </article>
)

export const DoctorAcuerdosPage: React.FC = () => {
  const {
    data,
    loading,
    error,
    refetch,
    searchTerm,
    setSearchTerm,
    convenioActivo,
    setConvenio,
    modo,
    acuerdos,
    convenios,
  } = useAcuerdos()

  const table = useTable({
    features: featuresTablaPaginada,
    columns,
    data: acuerdos,
    initialState: { pagination: { pageIndex: 0, pageSize: TAMANO_PAGINA_INICIAL } },
  })

  const { pageIndex, pageSize } = table.state.pagination
  const filas = table.getRowModel().rows
  const total = acuerdos.length
  const paginas = Math.max(1, table.getPageCount())
  const inicio = filas.length === 0 ? 0 : pageIndex * pageSize + 1
  const fin = pageIndex * pageSize + filas.length

  const cambiarConvenio = (id: number) => {
    table.resetPageIndex()
    setConvenio(id)
  }

  const cambiarBusqueda = (valor: string) => {
    table.resetPageIndex()
    setSearchTerm(valor)
  }

  const actualizar = () => {
    table.resetPageIndex()
    refetch()
  }

  const esModoEspecial = modo === 'especial'
  const sinConvenios = data !== null && convenios.length === 0
  const hayResultados = total > 0

  const tituloLista = esModoEspecial ? 'Tus acuerdos especiales' : 'Tarifas de tu convenio'

  return (
    <div className="space-y-4">
      <SEO
        title="Acuerdos y Tarifas — Portal Profesionales"
        description="Consulta los acuerdos porcentuales y tarifas fijas configuradas para tu perfil clínico."
      />

      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
            Acuerdos y Tarifas
          </h1>
        </div>
        <button
          onClick={actualizar}
          disabled={loading}
          title="Actualizar acuerdos"
          className="w-10 h-10 rounded-xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-center text-slate-600 hover:text-blue-700 hover:border-blue-300 transition-colors disabled:opacity-50 shrink-0"
        >
          <RotateCcw className={`w-4 h-4 ${loading ? 'animate-spin text-blue-600' : ''}`} />
        </button>
      </div>

      {/* Selector de convenio */}
      <div className="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-xs space-y-2.5">
        {!data ? (
          <p className="text-xs text-slate-400">Cargando convenios…</p>
        ) : sinConvenios ? (
          <p className="text-xs text-slate-500">No tienes convenios asociados.</p>
        ) : (
          <label className="block">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
              Convenio
            </span>
            <div className="relative mt-1">
              <select
                value={convenioActivo ?? ''}
                onChange={(e) => cambiarConvenio(Number(e.target.value))}
                disabled={loading || convenios.length === 0}
                className="w-full appearance-none pl-3 pr-9 py-2.5 text-xs font-semibold rounded-xl bg-white border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
              >
                {convenios.map((convenio) => (
                  <option key={convenio.id_convenio} value={convenio.id_convenio}>
                    {convenio.nombre} ({convenio.total_reglas}{' '}
                    {convenio.total_reglas === 1 ? 'regla' : 'reglas'})
                  </option>
                ))}
              </select>
              <ChevronDown
                className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
            </div>
          </label>
        )}

      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start justify-between gap-3 animate-fade-in-entry">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" aria-hidden="true" />
            <div>
              <p className="font-bold">Error al cargar los acuerdos</p>
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

      {!sinConvenios && (
        <div className="relative">
          <Search
            className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"
            aria-hidden="true"
          />
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => cambiarBusqueda(e.target.value)}
            placeholder="Buscar código, prestación, convenio o sede..."
            className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
          />
        </div>
      )}

      {loading && !data && (
        <div className="py-12 flex flex-col items-center justify-center text-slate-400 gap-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-medium text-slate-500">Cargando tus acuerdos...</p>
        </div>
      )}

      {data && !sinConvenios && !hayResultados && (
        <div className="text-center py-12 px-4 bg-white rounded-3xl border border-dashed border-slate-200">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
            <FileSpreadsheet className="w-6 h-6" aria-hidden="true" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">
            {searchTerm
              ? 'Sin resultados para tu búsqueda'
              : 'No hay tarifas configuradas para este convenio'}
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
            {searchTerm
              ? 'Prueba con otro término o limpia el filtro.'
              : 'Cambia de convenio para consultar otras tarifas.'}
          </p>
        </div>
      )}

      {data && hayResultados && (
        <div className="space-y-3 animate-fade-in-entry">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-2 min-w-0">
              {esModoEspecial ? (
                <UserCheck className="w-4 h-4 text-emerald-600 shrink-0" aria-hidden="true" />
              ) : (
                <Building2 className="w-4 h-4 text-blue-600 shrink-0" aria-hidden="true" />
              )}
              <span className="truncate">{tituloLista}</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 shrink-0">
                {total}
              </span>
            </h2>

            <label className="flex items-center gap-1 shrink-0">
              <span className="sr-only">Tarifas por página</span>
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

          <div className="space-y-2">
            {filas.map((fila) => (
              <AcuerdoCard
                key={fila.id}
                acuerdo={fila.original}
                esPersonal={esModoEspecial}
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
      )}
    </div>
  )
}
