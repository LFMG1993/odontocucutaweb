import { useState, useEffect, useCallback } from 'react'
import { doctorService } from '@/services/profesionales/doctorService'
import type { AcuerdosData } from '@/types/profesionales'

export function useAcuerdos() {
  const [data, setData] = useState<AcuerdosData | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [tab, setTab] = useState<'personales' | 'clinica'>('personales')

  const fetchAcuerdos = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await doctorService.getAcuerdos()
      setData(response)
    } catch (err: unknown) {
      console.error('Error cargando acuerdos tarifarios:', err)
      const msg = err instanceof Error ? err.message : 'Error al obtener acuerdos'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    let isMounted = true
    const load = async () => {
      try {
        const response = await doctorService.getAcuerdos()
        if (isMounted) {
          setData(response)
          setError(null)
        }
      } catch (err: unknown) {
        if (isMounted) {
          const msg = err instanceof Error ? err.message : 'Error al obtener acuerdos'
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
  }, [])

  return {
    data,
    loading,
    error,
    refetch: fetchAcuerdos,
    tab,
    setTab,
  }
}
