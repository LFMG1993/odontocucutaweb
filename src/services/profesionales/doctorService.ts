import { apiClient } from '../apiClient'
import type {
  DoctorUser,
  DoctorProfile,
  LiquidacionResponse,
  AcuerdosData,
  PagosData,
  LoginCredentials,
  ChangePasswordPayload,
  LiquidacionFiltros,
  ApiResponse,
} from '@/types/profesionales'

export const doctorService = {
  /**
   * Inicia sesión del profesional clínico y establece la cookie HttpOnly
   */
  login: async (credentials: LoginCredentials): Promise<DoctorUser> => {
    const res = await apiClient.post<ApiResponse<{ user: DoctorUser }>>(
      '/api/v1/doctor/auth/login',
      credentials
    )
    if (!res.data.data?.user) {
      throw new Error(res.data.message || 'Error en respuesta de autenticación')
    }
    return res.data.data.user
  },

  /**
   * Cierra la sesión activa invalidando la cookie HttpOnly
   */
  logout: async (): Promise<void> => {
    await apiClient.post('/api/v1/doctor/auth/logout')
  },

  /**
   * Obtiene la ficha clínica del profesional logueado (verificación de sesión)
   */
  getProfile: async (): Promise<DoctorProfile> => {
    const res = await apiClient.get<ApiResponse<{ profesional: DoctorProfile }>>(
      '/api/v1/doctor/me'
    )
    if (!res.data.data?.profesional) {
      throw new Error(res.data.message || 'No se pudo obtener el perfil del profesional')
    }
    return res.data.data.profesional
  },

  /**
   * Consulta las liquidaciones devengadas en un rango de fechas
   */
  getLiquidaciones: async (filtros?: LiquidacionFiltros): Promise<LiquidacionResponse> => {
    const res = await apiClient.get<ApiResponse<LiquidacionResponse>>(
      '/api/v1/doctor/liquidaciones',
      {
        params: {
          desde: filtros?.desde,
          hasta: filtros?.hasta,
        },
      }
    )
    if (!res.data.data) {
      throw new Error(res.data.message || 'Error al obtener liquidaciones')
    }
    return res.data.data
  },

  /**
   * Consulta los acuerdos tarifarios vigentes (personales y de clínica)
   */
  getAcuerdos: async (): Promise<AcuerdosData> => {
    const res = await apiClient.get<ApiResponse<AcuerdosData>>(
      '/api/v1/doctor/acuerdos'
    )
    if (!res.data.data) {
      throw new Error(res.data.message || 'Error al obtener acuerdos')
    }
    return res.data.data
  },

  /**
   * Consulta el historial de pagos formalmente cerrados
   */
  getPagos: async (): Promise<PagosData> => {
    const res = await apiClient.get<ApiResponse<PagosData>>(
      '/api/v1/doctor/pagos'
    )
    if (!res.data.data) {
      throw new Error(res.data.message || 'Error al obtener historial de pagos')
    }
    return res.data.data
  },

  /**
   * Descarga el soporte / comprobante en formato Blob
   */
  downloadComprobante: async (pagoId: number, filename?: string): Promise<void> => {
    const blob = await apiClient.downloadFile(`/api/v1/doctor/pagos/${pagoId}/comprobante`)
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename || `comprobante_pago_${pagoId}.pdf`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  },

  /**
   * Obtiene la URL directa del comprobante para visualización en ventana aparte
   */
  getComprobanteViewUrl: (pagoId: number): string => {
    const base = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080').replace(/\/+$/, '')
    return `${base}/api/v1/doctor/pagos/${pagoId}/comprobante`
  },

  /**
   * Cambia la contraseña del profesional clínico
   */
  changePassword: async (payload: ChangePasswordPayload): Promise<void> => {
    await apiClient.post('/api/v1/doctor/auth/change-password', payload)
  },
}
