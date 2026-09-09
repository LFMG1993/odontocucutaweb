import React, { useState, useMemo } from 'react'
import {
  FileBadge2,
  AlertCircle,
  RotateCcw,
  User,
  Building,
  Search,
  X,
  ChevronDown,
} from 'lucide-react'
import { useAcuerdos } from '@/hooks/profesionales/useAcuerdos'
import { AcuerdoCard } from '@/components/profesionales'
import { SEO } from '@/components/shared'
import type { AcuerdoTarifario } from '@/types/profesionales'

function safeArray(val: unknown): AcuerdoTarifario[] {
  if (!val) return []
  if (Array.isArray(val)) return val
  if (typeof val === 'object') return Object.values(val) as AcuerdoTarifario[]
  return []
}

export const DoctorAcuerdosPage: React.FC = () => {
  const { data, loading, error, refetch, tab, setTab } = useAcuerdos()
  const [searchTerm, setSearchTerm] = useState('')
  const [visibleLimit, setVisibleLimit] = useState(30)

  const personales = useMemo(() => safeArray(data?.acuerdos_personales), [data])
  const clinica = useMemo(() => safeArray(data?.acuerdos_clinica), [data])

  const currentList = tab === 'personales' ? personales : clinica

  const filteredList = useMemo(() => {
    if (!searchTerm.trim()) return currentList
    const term = searchTerm.toLowerCase().trim()
    return currentList.filter((item) => {
      const prestacion = (item.nombre_prestacion || '').toLowerCase()
      const sucursal = (item.nombre_sucursal || '').toLowerCase()
      const tipo = (item.tipo_calculo || '').toLowerCase()
      return prestacion.includes(term) || sucursal.includes(term) || tipo.includes(term)
    })
  }, [currentList, searchTerm])

  const visibleList = useMemo(() => {
    return filteredList.slice(0, visibleLimit)
  }, [filteredList, visibleLimit])

  const handleTabChange = (newTab: 'personales' | 'clinica') => {
    setTab(newTab)
    setSearchTerm('')
    setVisibleLimit(30)
  }

  return (
    <div className="space-y-4">
      <SEO
        title="Acuerdos y Tarifarios — Portal Profesionales"
        description="Consulta tus acuerdos y porcentajes de liquidación vigentes."
      />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
            Acuerdos y Tarifarios
          </h1>
          <p className="text-xs text-slate-500">
            Reglas de liquidación porcentuales o fijas aplicadas a tus procedimientos
          </p>
        </div>

        <button
          onClick={() => refetch()}
          disabled={loading}
          title="Actualizar acuerdos"
          className="w-10 h-10 rounded-xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-center text-slate-600 hover:text-blue-700 hover:border-blue-300 transition-colors disabled:opacity-50 shrink-0"
        >
          <RotateCcw className={`w-4 h-4 ${loading ? 'animate-spin text-blue-600' : ''}`} />
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start justify-between gap-3 animate-fade-in-entry">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
            <div>
              <p className="font-bold">Error al cargar acuerdos</p>
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

      {/* Tabs Móviles */}
      <div className="grid grid-cols-2 p-1 bg-slate-200/70 rounded-2xl">
        <button
          onClick={() => handleTabChange('personales')}
          className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            tab === 'personales'
              ? 'bg-white text-blue-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>Personales ({personales.length})</span>
        </button>
        <button
          onClick={() => handleTabChange('clinica')}
          className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            tab === 'clinica'
              ? 'bg-white text-blue-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Building className="w-3.5 h-3.5" />
          <span>Reglas Clínica ({clinica.length})</span>
        </button>
      </div>

      {/* Buscador de acuerdos */}
      {currentList.length > 0 && (
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setVisibleLimit(30)
            }}
            placeholder={
              tab === 'personales'
                ? 'Buscar en acuerdos personales...'
                : 'Buscar prestación o regla de la clínica...'
            }
            className="w-full pl-9 pr-8 py-2 text-xs rounded-xl bg-white border border-slate-200/80 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
      )}

      {/* Contenido de los Acuerdos */}
      {loading && !data ? (
        <div className="py-12 flex flex-col items-center justify-center text-slate-400 gap-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-medium text-slate-500">Cargando catálogo tarifario...</p>
        </div>
      ) : visibleList.length > 0 ? (
        <div className="space-y-3 animate-fade-in-entry">
          {searchTerm && (
            <p className="text-[11px] text-slate-500 font-medium">
              Mostrando {visibleList.length} de {filteredList.length} coincidencias
            </p>
          )}
          {visibleList.map((acuerdo, idx) => (
            <AcuerdoCard
              key={`${tab}-${acuerdo.id ?? 'item'}-${idx}`}
              acuerdo={acuerdo}
              tipo={tab === 'personales' ? 'personal' : 'clinica'}
            />
          ))}

          {/* Botón para cargar más cuando hay muchos registros */}
          {visibleLimit < filteredList.length && (
            <div className="pt-2 text-center">
              <button
                onClick={() => setVisibleLimit((prev) => prev + 30)}
                className="w-full py-2.5 px-4 bg-white border border-slate-200 rounded-xl text-xs font-bold text-blue-700 hover:bg-blue-50 transition-colors flex items-center justify-center gap-1.5 shadow-xs"
              >
                <span>Mostrar más ({filteredList.length - visibleLimit} restantes)</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-10 px-4 bg-white rounded-2xl border border-dashed border-slate-200">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-2">
            <FileBadge2 className="w-6 h-6" />
          </div>
          <p className="text-xs font-bold text-slate-700">
            {searchTerm
              ? 'No se encontraron reglas con ese término de búsqueda'
              : tab === 'personales'
              ? 'Sin acuerdos personales específicos'
              : 'No hay reglas de clínica registradas'}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            {searchTerm
              ? 'Intenta con otro nombre de prestación o palabra clave'
              : tab === 'personales'
              ? 'Se aplican los acuerdos generales institucionales de la clínica'
              : 'Consulta con la coordinación odontológica de tu sede'}
          </p>
        </div>
      )}
    </div>
  )
}
