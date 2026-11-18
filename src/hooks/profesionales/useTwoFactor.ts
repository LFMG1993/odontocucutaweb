import { useState, useEffect, useCallback } from 'react'
import { doctorService } from '@/services/profesionales/doctorService'
import type {
  TwoFactorStatus,
  TwoFactorSetupData,
  TrustedDevice,
} from '@/types/profesionales'

/**
 * Estado y acciones del 2FA voluntario desde el perfil autenticado.
 */
export function useTwoFactor() {
  const [status, setStatus] = useState<TwoFactorStatus | null>(null)
  const [devices, setDevices] = useState<TrustedDevice[]>([])
  const [devicesEnabled, setDevicesEnabled] = useState<boolean>(false)
  const [expireDays, setExpireDays] = useState<number>(30)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState<boolean>(false)

  const cargar = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const estado = await doctorService.getTwoFactorStatus()
      setStatus(estado)

      try {
        const equipos = await doctorService.getTrustedDevices()
        setDevices(equipos.devices || [])
        setDevicesEnabled(equipos.enabled)
        setExpireDays(equipos.expire_days)
      } catch {
        // El listado de equipos es opcional: un fallo no debe romper el estado
        setDevices([])
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'No se pudo obtener el estado del 2FA'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    let isMounted = true
    const load = async () => {
      try {
        const estado = await doctorService.getTwoFactorStatus()
        if (!isMounted) return
        setStatus(estado)
        try {
          const equipos = await doctorService.getTrustedDevices()
          if (!isMounted) return
          setDevices(equipos.devices || [])
          setDevicesEnabled(equipos.enabled)
          setExpireDays(equipos.expire_days)
        } catch {
          if (isMounted) setDevices([])
        }
      } catch (err: unknown) {
        if (!isMounted) return
        const msg = err instanceof Error ? err.message : 'No se pudo obtener el estado del 2FA'
        setError(msg)
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    load()
    return () => {
      isMounted = false
    }
  }, [])

  const iniciarActivacion = useCallback(async (): Promise<TwoFactorSetupData> => {
    setActionLoading(true)
    try {
      const data = await doctorService.setupTwoFactor()
      return data
    } finally {
      setActionLoading(false)
    }
  }, [])

  const confirmarActivacion = useCallback(
    async (setupToken: string, code: string): Promise<string[]> => {
      setActionLoading(true)
      try {
        const data = await doctorService.confirmTwoFactor({ setup_token: setupToken, code })
        await cargar()
        return data.recovery_codes || []
      } finally {
        setActionLoading(false)
      }
    },
    [cargar]
  )

  const desactivar = useCallback(
    async (password: string): Promise<void> => {
      setActionLoading(true)
      try {
        await doctorService.disableTwoFactor(password)
        await cargar()
      } finally {
        setActionLoading(false)
      }
    },
    [cargar]
  )

  const revocarEquipo = useCallback(async (id: number): Promise<void> => {
    setActionLoading(true)
    try {
      await doctorService.revokeTrustedDevice(id)
      setDevices((prev) => prev.filter((device) => device.id !== id))
    } finally {
      setActionLoading(false)
    }
  }, [])

  const revocarTodos = useCallback(async (): Promise<void> => {
    setActionLoading(true)
    try {
      await doctorService.revokeAllTrustedDevices()
      setDevices([])
    } finally {
      setActionLoading(false)
    }
  }, [])

  return {
    status,
    devices,
    devicesEnabled,
    expireDays,
    loading,
    error,
    actionLoading,
    refetch: cargar,
    iniciarActivacion,
    confirmarActivacion,
    desactivar,
    revocarEquipo,
    revocarTodos,
  }
}
