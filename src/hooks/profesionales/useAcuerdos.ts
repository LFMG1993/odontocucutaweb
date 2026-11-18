import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { doctorService } from '@/services/profesionales/doctorService'
import type { AcuerdoTarifario, AcuerdosResponse } from '@/types/profesionales'

function coincide(acuerdo: AcuerdoTarifario, termino: string): boolean {
  const t = termino.toLowerCase()
  return (
    (acuerdo.codigo_cups || '').toLowerCase().includes(t) ||
    (acuerdo.nombre_prestacion || '').toLowerCase().includes(t) ||
    (acuerdo.nombre_convenio || '').toLowerCase().includes(t) ||
    (acuerdo.nombre_sucursal || '').toLowerCase().includes(t) ||
    acuerdo.aplica_sobre.toLowerCase().includes(t) ||
    acuerdo.tipo_calculo.toLowerCase().includes(t) ||
    acuerdo.valor.toLowerCase().includes(t)
  )
}

export function useAcuerdos() {
  const [data, setData] = useState<AcuerdosResponse | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState<string>('')

  // Filtros del servidor
  const [convenio, setConvenioState] = useState<number | null>(null)
  const [recarga, setRecarga] = useState<number>(0)

  // Evita que una respuesta vieja sobreescriba a una más reciente
  const peticionRef = useRef(0)

  useEffect(() => {
    const peticion = ++peticionRef.current

    const cargar = async () => {
      try {
        const response = await doctorService.getAcuerdos({
          convenio: convenio ?? undefined,
          // Las reglas sin tarifa (valor 0) siempre se omiten
          incluir_sin_valor: false,
        })
        if (peticion === peticionRef.current) {
          setData(response)
          setError(null)
        }
      } catch (err: unknown) {
        if (peticion === peticionRef.current) {
          const msg = err instanceof Error ? err.message : 'Error al obtener los acuerdos'
          setError(msg)
        }
      } finally {
        if (peticion === peticionRef.current) setLoading(false)
      }
    }

    void cargar()
  }, [convenio, recarga])

  const refetch = useCallback(() => {
    setLoading(true)
    setError(null)
    setRecarga((valor) => valor + 1)
  }, [])

  const setConvenio = useCallback((id: number) => {
    setLoading(true)
    setError(null)
    setConvenioState(id)
  }, [])

  // Convenio efectivo: el elegido por el usuario o el que sugiere el backend
  const convenioActivo = useMemo<number | null>(() => {
    if (convenio !== null) return convenio
    return data?.convenio_seleccionado?.id_convenio ?? null
  }, [convenio, data])

  const modo = data?.modo ?? 'general'

  const acuerdos = useMemo<AcuerdoTarifario[]>(() => {
    if (!data) return []
    const lista = modo === 'especial' ? data.acuerdos_personales : data.acuerdos_clinica
    const termino = searchTerm.trim()
    if (!termino) return lista
    return lista.filter((acuerdo) => coincide(acuerdo, termino))
  }, [data, modo, searchTerm])

  return {
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
    convenios: data?.convenios ?? [],
  }
}
