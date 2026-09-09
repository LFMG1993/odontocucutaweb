import { useState, useEffect, useCallback, useMemo } from 'react'
import { doctorService } from '@/services/profesionales/doctorService'
import type { LiquidacionResponse, LiquidacionFiltros, ProcedimientoLiquidado } from '@/types/profesionales'

// Utilidad para obtener el primer y último día del mes en formato YYYY-MM-DD
export function getDefaultPeriodo(): { desde: string; hasta: string } {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const lastDay = new Date(year, now.getMonth() + 1, 0).getDate()
  return {
    desde: `${year}-${month}-01`,
    hasta: `${year}-${month}-${String(lastDay).padStart(2, '0')}`,
  }
}

export function useLiquidaciones(initialFiltros?: LiquidacionFiltros) {
  const defaultPeriodo = useMemo(() => getDefaultPeriodo(), [])

  const [filtros, setFiltros] = useState<LiquidacionFiltros>({
    desde: initialFiltros?.desde || defaultPeriodo.desde,
    hasta: initialFiltros?.hasta || defaultPeriodo.hasta,
  })

  const [data, setData] = useState<LiquidacionResponse | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // Filtros locales en memoria (mobile-friendly)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [selectedSede, setSelectedSede] = useState<string>('todas')

  const fetchLiquidaciones = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await doctorService.getLiquidaciones(filtros)
      setData(response)
    } catch (err: unknown) {
      console.error('Error cargando liquidaciones:', err)
      const msg = err instanceof Error ? err.message : 'Error al obtener la liquidación del periodo'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }, [filtros])

  useEffect(() => {
    let isMounted = true
    const load = async () => {
      try {
        const response = await doctorService.getLiquidaciones(filtros)
        if (isMounted) {
          setData(response)
          setError(null)
        }
      } catch (err: unknown) {
        if (isMounted) {
          const msg = err instanceof Error ? err.message : 'Error al obtener la liquidación'
          setError(msg)
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }
    load()
    return () => {
      isMounted = false
    }
  }, [filtros])

  // Filtrado reactivo de procedimientos
  const filteredProcedimientos = useMemo<ProcedimientoLiquidado[]>(() => {
    const lista = data?.procedimientos
    if (!lista) return []

    return lista.filter((proc) => {
      // Filtro por sede
      if (selectedSede !== 'todas' && proc.sede !== selectedSede) {
        return false
      }

      // Filtro por término de búsqueda
      if (!searchTerm.trim()) return true
      const term = searchTerm.toLowerCase()
      return (
        proc.paciente_nombre.toLowerCase().includes(term) ||
        proc.paciente_documento.toLowerCase().includes(term) ||
        proc.nombre_prestacion.toLowerCase().includes(term) ||
        proc.codigo_cups.toLowerCase().includes(term) ||
        proc.folio_boleta.toLowerCase().includes(term)
      )
    })
  }, [data, selectedSede, searchTerm])

  // Lista de sedes únicas para el filtro
  const sedesDisponibles = useMemo<string[]>(() => {
    const lista = data?.procedimientos
    if (!lista) return []
    const set = new Set<string>()
    lista.forEach((p) => {
      if (p.sede) set.add(p.sede)
    })
    return Array.from(set)
  }, [data])

  return {
    data,
    loading,
    error,
    filtros,
    setFiltros,
    refetch: fetchLiquidaciones,
    searchTerm,
    setSearchTerm,
    selectedSede,
    setSelectedSede,
    filteredProcedimientos,
    sedesDisponibles,
  }
}
