import { apiClient } from '../apiClient'
import type {
  DoctorUser,
  DoctorProfile,
  DoctorLoginResult,
  LiquidacionResponse,
  PagosData,
  AcuerdosResponse,
  AcuerdosFiltros,
  LoginCredentials,
  ChangePasswordPayload,
  LiquidacionFiltros,
  ApiResponse,
  TwoFactorChallenge,
  TwoFactorSetupData,
  TwoFactorVerifyData,
  TwoFactorConfirmData,
  TwoFactorStatus,
  TrustedDevicesData,
  PasswordResetVerifyResponse,
  DriveFoldersData,
  DriveListResponse,
  DriveSheetPreview,
} from '@/types/profesionales'

interface LoginResponseData {
  user?: DoctorUser
  requires_2fa?: boolean
  step?: 'verify' | 'setup_required'
  challenge_token?: string
  message?: string
}

/**
 * Normaliza la respuesta del login, que puede venir con el desafío 2FA
 * dentro de `data` (o, según la versión del backend, en la raíz).
 */
function parseLoginPayload(payload: ApiResponse<LoginResponseData> | LoginResponseData): DoctorLoginResult {
  const source = (payload as ApiResponse<LoginResponseData>).data ?? (payload as LoginResponseData)
  if (source?.requires_2fa) {
    const challenge: TwoFactorChallenge = {
      step: source.step === 'setup_required' ? 'setup_required' : 'verify',
      challenge_token: source.challenge_token ?? '',
      message: source.message,
    }
    return { requires2FA: true, challenge }
  }

  if (!source?.user) {
    throw new Error('Error en respuesta de autenticación')
  }

  return { requires2FA: false, user: source.user }
}

export const doctorService = {
  /**
   * Inicia sesión del profesional clínico y establece la cookie HttpOnly.
   * Si la cuenta exige 2FA devuelve el desafío en lugar del usuario.
   */
  login: async (credentials: LoginCredentials): Promise<DoctorLoginResult> => {
    const res = await apiClient.post<ApiResponse<LoginResponseData> & LoginResponseData>(
      '/api/v1/doctor/auth/login',
      credentials,
      { skipAuthRedirect: true }
    )
    return parseLoginPayload(res.data)
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
   * Consulta los acuerdos y tarifas configurados para el profesional.
   * El backend filtra por convenio (por defecto el que más trabaja el
   * profesional), oculta las reglas con valor 0 y devuelve los convenios
   * disponibles para el selector.
   */
  getAcuerdos: async (params?: AcuerdosFiltros): Promise<AcuerdosResponse> => {
    const res = await apiClient.get<ApiResponse<AcuerdosResponse>>(
      '/api/v1/doctor/acuerdos',
      {
        params: {
          convenio: params?.convenio,
          sede: params?.sede,
          incluir_sin_valor: params?.incluir_sin_valor ? 1 : 0,
        },
      }
    )
    if (!res.data.data) {
      throw new Error(res.data.message || 'Error al obtener los acuerdos')
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

  // --- Recuperación de contraseña por código OTP ---

  requestPasswordResetCode: async (identifier: string): Promise<string> => {
    const res = await apiClient.post<ApiResponse<null>>(
      '/api/v1/doctor/auth/password/request-code',
      { identifier },
      { skipAuthRedirect: true }
    )
    return res.data.message
  },

  verifyPasswordResetCode: async (
    identifier: string,
    code: string
  ): Promise<PasswordResetVerifyResponse> => {
    const res = await apiClient.post<ApiResponse<PasswordResetVerifyResponse>>(
      '/api/v1/doctor/auth/password/verify-code',
      { identifier, code },
      { skipAuthRedirect: true }
    )
    if (!res.data.data) {
      throw new Error(res.data.message || 'No se pudo verificar el código')
    }
    return res.data.data
  },

  resetPassword: async (payload: {
    reset_token: string
    password: string
    confirm_password: string
  }): Promise<void> => {
    await apiClient.post('/api/v1/doctor/auth/password/reset', payload, {
      skipAuthRedirect: true,
    })
  },

  // --- 2FA durante el login ---

  verifyTwoFactor: async (payload: {
    challenge_token: string
    code: string
    remember_device?: boolean
  }): Promise<TwoFactorVerifyData> => {
    const res = await apiClient.post<ApiResponse<TwoFactorVerifyData>>(
      '/api/v1/doctor/auth/2fa/verify',
      payload,
      { skipAuthRedirect: true }
    )
    if (!res.data.data?.user) {
      throw new Error(res.data.message || 'No se pudo verificar el código')
    }
    return res.data.data
  },

  setupTwoFactorLogin: async (challenge_token: string): Promise<TwoFactorSetupData> => {
    const res = await apiClient.post<ApiResponse<TwoFactorSetupData>>(
      '/api/v1/doctor/auth/2fa/setup',
      { challenge_token },
      { skipAuthRedirect: true }
    )
    if (!res.data.data) {
      throw new Error(res.data.message || 'No se pudo iniciar la configuración de 2FA')
    }
    return res.data.data
  },

  confirmTwoFactorLogin: async (payload: {
    challenge_token: string
    setup_token: string
    code: string
    remember_device?: boolean
  }): Promise<TwoFactorConfirmData> => {
    const res = await apiClient.post<ApiResponse<TwoFactorConfirmData>>(
      '/api/v1/doctor/auth/2fa/confirm',
      payload,
      { skipAuthRedirect: true }
    )
    if (!res.data.data?.user) {
      throw new Error(res.data.message || 'No se pudo confirmar el 2FA')
    }
    return res.data.data
  },

  // --- 2FA voluntario (sesión autenticada) ---

  getTwoFactorStatus: async (): Promise<TwoFactorStatus> => {
    const res = await apiClient.get<ApiResponse<TwoFactorStatus>>('/api/v1/doctor/2fa/status')
    if (!res.data.data) {
      throw new Error(res.data.message || 'No se pudo obtener el estado del 2FA')
    }
    return res.data.data
  },

  setupTwoFactor: async (): Promise<TwoFactorSetupData> => {
    const res = await apiClient.post<ApiResponse<TwoFactorSetupData>>('/api/v1/doctor/2fa/setup')
    if (!res.data.data) {
      throw new Error(res.data.message || 'No se pudo iniciar la configuración de 2FA')
    }
    return res.data.data
  },

  confirmTwoFactor: async (payload: {
    setup_token: string
    code: string
  }): Promise<{ recovery_codes: string[] }> => {
    const res = await apiClient.post<ApiResponse<{ recovery_codes: string[] }>>(
      '/api/v1/doctor/2fa/confirm',
      payload
    )
    if (!res.data.data) {
      throw new Error(res.data.message || 'No se pudo confirmar el 2FA')
    }
    return res.data.data
  },

  disableTwoFactor: async (password: string): Promise<void> => {
    await apiClient.post('/api/v1/doctor/2fa/disable', { password })
  },

  getTrustedDevices: async (): Promise<TrustedDevicesData> => {
    const res = await apiClient.get<ApiResponse<TrustedDevicesData>>('/api/v1/doctor/2fa/devices')
    if (!res.data.data) {
      throw new Error(res.data.message || 'No se pudieron obtener los equipos de confianza')
    }
    return res.data.data
  },

  revokeTrustedDevice: async (id: number): Promise<void> => {
    await apiClient.post(`/api/v1/doctor/2fa/devices/${id}/revoke`)
  },

  revokeAllTrustedDevices: async (): Promise<void> => {
    await apiClient.post('/api/v1/doctor/2fa/devices/revoke-all')
  },

  // --- Archivos de Google Drive (solo lectura) ---

  getDriveFolders: async (): Promise<DriveFoldersData> => {
    const res = await apiClient.get<ApiResponse<DriveFoldersData>>('/api/v1/doctor/archivos/carpetas')
    if (!res.data.data) {
      throw new Error(res.data.message || 'No se pudieron obtener las carpetas')
    }
    return res.data.data
  },

  getDriveList: async (
    carpeta: string,
    parent?: string,
    pageToken?: string
  ): Promise<DriveListResponse> => {
    const res = await apiClient.get<ApiResponse<DriveListResponse>>('/api/v1/doctor/archivos', {
      params: { carpeta, parent, pageToken },
    })
    if (!res.data.data) {
      throw new Error(res.data.message || 'No se pudo listar el contenido de la carpeta')
    }
    return res.data.data
  },

  /**
   * Previsualiza una hoja. Devuelve un Blob (PDF) o el JSON con las filas.
   */
  previewDriveFile: async (id: string): Promise<DriveSheetPreview | Blob> => {
    const res = await apiClient.get<Blob>(`/api/v1/doctor/archivos/previsualizar/${id}`, {
      responseType: 'blob',
    })
    const contentType = res.headers.get('content-type') || ''
    if (contentType.includes('application/json')) {
      const text = await res.data.text()
      const json = JSON.parse(text) as ApiResponse<DriveSheetPreview>
      if (!json.data) {
        throw new Error(json.message || 'No se pudo previsualizar el archivo')
      }
      return json.data
    }
    return res.data
  },

  downloadDriveFile: async (id: string, inline = false): Promise<Blob> => {
    return apiClient.downloadFile(`/api/v1/doctor/archivos/descargar/${id}`, {
      inline: inline ? 1 : 0,
    })
  },
}
