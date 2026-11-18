// Tipos e Interfaces para el Portal de Profesionales OdontoSync

export interface DoctorUser {
  id: number
  username: string
  first_name: string
  id_profesional_dl: number
  nombre_profesional: string
  must_change_password: boolean
}

export interface DoctorProfile {
  id_profesional_dl: number
  nombre: string
  apellidos: string
  celular: string
  telefono: string
  email: string
  ciudad: string
  comuna: string
  direccion: string
  rut: string
  especialidad: string
  estado: 'activo' | 'inactivo'
  username: string
  user_email: string
  must_change_password: number | boolean
}

export interface ProcedimientoLiquidado {
  id_detalle_dl: number
  fecha_realizacion: string
  id_prestacion_dl: number
  nombre_prestacion: string
  codigo_cups: string
  sede: string
  id_sucursal_dl: number
  convenio_tratamiento: string
  paciente_nombre: string
  paciente_documento: string
  paciente_convenio: string
  nombre_tratamiento: string
  monto_pagado_procedimiento: number
  tarifa_base_clinica: number
  pago_profesional: number
  explicacion: string
  porcentaje_pagado_paciente: number
  base_calculo: number
  folio_boleta: string
  fecha_boleta: string
  clasificacion_factura: string
  garantia: number
}

export interface ResumenLiquidacion {
  total_a_liquidar: number
  total_procedimientos: number
  total_pacientes_unicos: number
  total_facturado_clinica: number
  desglose_por_sede: Record<string, number>
}

export interface LiquidacionResponse {
  periodo: {
    desde: string
    hasta: string
  }
  resumen: ResumenLiquidacion
  procedimientos: ProcedimientoLiquidado[]
}

export interface HistorialPago {
  id: number
  id_profesional_dl: number
  fecha_inicio: string
  fecha_fin: string
  monto_pagado: string
  autorizado_por: string | null
  comprobante_path: string | null
  creado_en: string
  tiene_comprobante: boolean
  comprobante_url: string | null
}

export interface PagosData {
  total_pagos: number
  pagos: HistorialPago[]
}

export interface AcuerdoTarifario {
  id: number
  id_profesional_dl: number | null
  codigo_cups: string | null
  nombre_prestacion: string | null
  id_convenio_dl: number | null
  nombre_convenio: string | null
  id_sucursal_dl: number | null
  nombre_sucursal: string | null
  aplica_sobre: 'REALIZADO' | 'ABONADO' | 'BASE_LIQUIDACION'
  tipo_calculo: 'PORCENTAJE' | 'FIJO'
  valor: string
  fecha_inicio: string
  fecha_fin: string | null
}

export interface ConvenioAcuerdo {
  id_convenio: number
  nombre: string
  total_reglas: number
  total_sin_valor: number
  tiene_reglas_especiales: boolean
}

export interface AcuerdosResponse {
  total_acuerdos: number
  acuerdos_personales: AcuerdoTarifario[]
  acuerdos_clinica: AcuerdoTarifario[]
  convenios: ConvenioAcuerdo[]
  convenio_seleccionado: { id_convenio: number; nombre: string } | null
  sede_seleccionada: number | null
  incluir_sin_valor: boolean
  tiene_reglas_especiales: boolean
  modo: 'general' | 'especial'
  total_sin_valor: number
}

export interface AcuerdosFiltros {
  convenio?: number
  sede?: number
  incluir_sin_valor?: boolean
}

export interface LoginCredentials {
  username: string
  password: string
}

export interface ChangePasswordPayload {
  current_password: string
  new_password: string
  confirm_password: string
}

export interface ApiResponse<T = unknown> {
  success: boolean
  message: string
  data?: T
  error?: string
}

export interface LiquidacionFiltros {
  desde?: string
  hasta?: string
}

// --- Autenticación con doble factor (2FA) ---

export type TwoFactorStep = 'verify' | 'setup_required'

export interface TwoFactorChallenge {
  step: TwoFactorStep
  challenge_token: string
  message?: string
}

export type DoctorLoginResult =
  | { requires2FA: false; user: DoctorUser }
  | { requires2FA: true; challenge: TwoFactorChallenge }

export interface TwoFactorSetupData {
  secret: string
  account: string
  qr_data_uri: string
  setup_token: string
  expires_in: number
}

export interface TwoFactorVerifyData {
  user: DoctorUser
  used_recovery: boolean
  message?: string
}

export interface TwoFactorConfirmData {
  user: DoctorUser
  recovery_codes: string[]
  used_recovery?: boolean
}

export type TwoFactorPolicy = 'optional' | 'forced_admins' | 'forced_all' | 'disabled'

export interface TwoFactorStatus {
  enabled: boolean
  confirmed_at: string | null
  policy: TwoFactorPolicy
  policy_label: string
  trusted_devices_enabled: boolean
  trusted_devices_expire_days: number
}

export interface TrustedDevice {
  id: number
  device_name: string | null
  ip: string | null
  created_at: string
  last_used_at: string | null
  expires_at: string
}

export interface TrustedDevicesData {
  devices: TrustedDevice[]
  enabled: boolean
  expire_days: number
}

// --- Recuperación de contraseña ---

export interface PasswordResetVerifyResponse {
  reset_token: string
  expires_in: number
}

// --- Archivos de Google Drive ---

export interface DriveFolder {
  clave: string
  nombre: string
}

export interface DriveFoldersData {
  configurado: boolean
  carpetas: DriveFolder[]
}

export interface DriveItem {
  id: string
  name: string
  mimeType: string
  size: number | null
  modifiedTime: string | null
  isFolder: boolean
  extension: string
}

export interface DriveListResponse {
  carpeta: string
  nextPageToken: string | null
  items: DriveItem[]
}

export interface DriveSheetPreview {
  modo: 'html'
  rows: unknown[][]
  truncated: boolean
  item: DriveItem
}
