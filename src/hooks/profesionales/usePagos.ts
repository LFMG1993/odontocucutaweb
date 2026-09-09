import { useState, useEffect, useCallback } from 'react'
import { doctorService } from '@/services/profesionales/doctorService'
import type { HistorialPago } from '@/types/profesionales'

export function usePagos() {
  const [pagos, setPagos] = useState<HistorialPago[]>([])
  const [totalPagos, setTotalPagos] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [downloadingId, setDownloadingId] = useState<number | null>(null)

  const fetchPagos = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await doctorService.getPagos()
      setPagos(data.pagos || [])
      setTotalPagos(data.total_pagos || 0)
    } catch (err: unknown) {
      console.error('Error cargando historial de pagos:', err)
      const msg = err instanceof Error ? err.message : 'Error al obtener historial de pagos'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    let isMounted = true
    const load = async () => {
      try {
        const data = await doctorService.getPagos()
        if (isMounted) {
          setPagos(data.pagos || [])
          setTotalPagos(data.total_pagos || 0)
          setError(null)
        }
      } catch (err: unknown) {
        if (isMounted) {
          const msg = err instanceof Error ? err.message : 'Error al obtener historial de pagos'
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

  const descargarComprobante = async (pago: HistorialPago) => {
    if (!pago.tiene_comprobante) return
    setDownloadingId(pago.id)
    try {
      await doctorService.downloadComprobante(
        pago.id,
        pago.comprobante_path || `comprobante_${pago.fecha_inicio}_${pago.fecha_fin}.pdf`
      )
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error desconocido'
      alert(`Error al descargar comprobante: ${msg}`)
    } finally {
      setDownloadingId(null)
    }
  }

  return {
    pagos,
    totalPagos,
    loading,
    error,
    refetch: fetchPagos,
    descargarComprobante,
    downloadingId,
  }
}
