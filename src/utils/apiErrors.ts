import { ApiError } from '@/services/apiClient'

/**
 * Traduce los errores del cliente HTTP en mensajes accionables para el usuario.
 */
export function getApiErrorMessage(err: unknown, fallback: string): string {
  if (err instanceof ApiError) {
    if (err.status === 429) {
      return 'Demasiados intentos. Espera unos minutos e inténtalo de nuevo.'
    }
    if (err.status === 0) {
      return 'No se pudo conectar con el servidor. Verifica tu conexión e inténtalo de nuevo.'
    }
    if (err.message) return err.message
  }
  if (err instanceof Error && err.message) return err.message
  return fallback
}

export function getApiErrorStatus(err: unknown): number {
  return err instanceof ApiError ? err.status : 0
}
