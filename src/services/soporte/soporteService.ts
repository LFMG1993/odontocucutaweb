import { apiClient } from '../apiClient'
import type {
  SoportePublicoFormDataResponse,
  CrearTicketPayload,
  CrearTicketResponse,
} from '@/types/soporte'

/**
 * Servicio para interacción con los endpoints públicos de Soporte TI
 */
export const soporteService = {
  /**
   * Obtiene los catálogos para el formulario de soporte (sucursales, motivos, usuarios y equipo por QR).
   */
  async getCatalogos(equipoId?: number | string | null): Promise<SoportePublicoFormDataResponse> {
    const params: Record<string, string | number> = {}
    if (equipoId) {
      params.equipo_id = equipoId
    }

    const response = await apiClient.get<SoportePublicoFormDataResponse>(
      '/api/soporte/publico',
      { params }
    )
    return response.data
  },

  /**
   * Crea un nuevo ticket de soporte técnico (soporta multipart/form-data con archivo adjunto).
   */
  async enviarTicket(payload: CrearTicketPayload): Promise<CrearTicketResponse> {
    const formData = new FormData()

    formData.append('solicitante', payload.solicitante.trim())
    formData.append('sede', payload.sede)
    formData.append('motivo', payload.motivo)
    formData.append('descripcion', payload.descripcion.trim())

    if (payload.id_usuario_dl) {
      formData.append('id_usuario_dl', String(payload.id_usuario_dl))
    }
    if (payload.telefono) {
      formData.append('telefono', payload.telefono.trim())
    }
    if (payload.telefono_codigo) {
      formData.append('telefono_codigo', payload.telefono_codigo.trim())
    }
    if (payload.telefono_numero) {
      formData.append('telefono_numero', payload.telefono_numero.trim())
    }
    if (payload.prioridad) {
      formData.append('prioridad', payload.prioridad)
    }
    if (payload.mensaje_whatsapp) {
      formData.append('mensaje_whatsapp', payload.mensaje_whatsapp.trim())
    }
    if (payload.adjunto) {
      formData.append('adjunto', payload.adjunto)
    }

    // apiClient maneja automáticamente FormData sin sobrescribir Content-Type (para que el browser agregue boundary)
    const response = await apiClient.post<CrearTicketResponse>(
      '/api/soporte/publico',
      formData
    )
    return response.data
  },
}
