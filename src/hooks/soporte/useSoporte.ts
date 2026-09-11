import { useState, useEffect, useCallback } from 'react'
import { soporteService } from '@/services/soporte'
import type {
  SoportePublicoFormData,
  CrearTicketPayload,
  CrearTicketResponse,
} from '@/types/soporte'
import { ApiError } from '@/services/apiClient'

export function useSoporte(equipoIdParam?: string | number | null) {
  const [catalogos, setCatalogos] = useState<SoportePublicoFormData | null>(null)
  const [loadingCatalogos, setLoadingCatalogos] = useState<boolean>(true)
  const [catalogosError, setCatalogosError] = useState<string | null>(null)

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [ticketCreado, setTicketCreado] = useState<CrearTicketResponse | null>(null)

  const loadCatalogos = useCallback(async (id?: string | number | null) => {
    setLoadingCatalogos(true)
    setCatalogosError(null)
    try {
      const resp = await soporteService.getCatalogos(id)
      if (resp.success && resp.data) {
        setCatalogos(resp.data)
      } else {
        throw new Error(resp.error || 'No se pudieron cargar los catálogos de soporte.')
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al conectar con el servicio de soporte.'
      setCatalogosError(msg)
    } finally {
      setLoadingCatalogos(false)
    }
  }, [])

  useEffect(() => {
    let isMounted = true
    soporteService
      .getCatalogos(equipoIdParam)
      .then((resp) => {
        if (!isMounted) return
        if (resp.success && resp.data) {
          setCatalogos(resp.data)
        } else {
          setCatalogosError(resp.error || 'No se pudieron cargar los catálogos de soporte.')
        }
      })
      .catch((err: unknown) => {
        if (!isMounted) return
        const msg = err instanceof Error ? err.message : 'Error al conectar con el servicio de soporte.'
        setCatalogosError(msg)
      })
      .finally(() => {
        if (isMounted) setLoadingCatalogos(false)
      })

    return () => {
      isMounted = false
    }
  }, [equipoIdParam])

  const submitTicket = async (payload: CrearTicketPayload): Promise<CrearTicketResponse | null> => {
    setIsSubmitting(true)
    setSubmitError(null)
    setValidationErrors({})

    try {
      const response = await soporteService.enviarTicket(payload)
      if (response.success) {
        setTicketCreado(response)
        return response
      } else {
        throw new Error(response.message || 'Error al procesar el ticket.')
      }
    } catch (err: unknown) {
      if (err instanceof ApiError && err.data) {
        const errorData = err.data as { error?: string; errors?: Record<string, string> }
        if (errorData.errors && typeof errorData.errors === 'object') {
          setValidationErrors(errorData.errors)
        }
        setSubmitError(errorData.error || err.message)
      } else if (err instanceof Error) {
        setSubmitError(err.message)
      } else {
        setSubmitError('Ocurrió un error inesperado al enviar la solicitud.')
      }
      return null
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetFormStatus = () => {
    setTicketCreado(null)
    setSubmitError(null)
    setValidationErrors({})
  }

  return {
    catalogos,
    loadingCatalogos,
    catalogosError,
    reloadCatalogos: () => loadCatalogos(equipoIdParam),
    isSubmitting,
    submitError,
    validationErrors,
    ticketCreado,
    submitTicket,
    resetFormStatus,
  }
}
