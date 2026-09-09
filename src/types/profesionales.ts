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

export interface AcuerdoTarifario {
  id: number
  id_profesional_dl: number | null
  id_prestacion_dl: number | null
  nombre_prestacion: string | null
  nombre_sucursal: string | null
  aplica_sobre: 'REALIZADO' | 'ABONADO' | 'BASE_LIQUIDACION' | string
  tipo_calculo: 'PORCENTAJE' | 'FIJO' | string
  valor: string
  fecha_inicio: string
  fecha_fin: string | null
}

export interface AcuerdosData {
  total_acuerdos: number
  acuerdos_personales: AcuerdoTarifario[]
  acuerdos_clinica: AcuerdoTarifario[]
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
