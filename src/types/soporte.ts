export type TicketPrioridad = 'baja' | 'media' | 'alta' | 'urgente'

export interface SucursalOption {
  id_sucursal: number
  nombre: string
}

export interface MotivoOption {
  id: number
  nombre: string
  categoria?: string | null
}

export interface UsuarioDlOption {
  id_usuario_dl: number
  nombre: string
  email?: string | null
  nombre_sucursal_dl?: string | null
  telefono?: string | null
  celular?: string | null
}

export interface EquipoInventario {
  id: number
  codigo_patrimonial?: string | null
  tipo_equipo: string
  marca?: string | null
  modelo?: string | null
  serial?: string | null
  sede: string
  ubicacion_especifica?: string | null
  usuario_asignado?: string | null
}

export interface SoportePublicoFormData {
  sucursales: SucursalOption[]
  motivos: MotivoOption[]
  usuarios: UsuarioDlOption[]
  equipo: EquipoInventario | null
}

export interface SoportePublicoFormDataResponse {
  success: boolean
  data: SoportePublicoFormData
  error?: string
}

export interface CrearTicketPayload {
  solicitante: string
  id_usuario_dl?: number | string | null
  telefono?: string
  telefono_codigo?: string
  telefono_numero?: string
  sede: string
  motivo: string
  prioridad?: TicketPrioridad
  descripcion: string
  mensaje_whatsapp?: string
  adjunto?: File | Blob | null
}

export interface CrearTicketResponse {
  success: boolean
  message: string
  ticket_uuid: string
  data?: {
    ticket_uuid: string
  }
}

export interface ApiErrorResponse {
  success: false
  error: string
  errors?: Record<string, string>
}
