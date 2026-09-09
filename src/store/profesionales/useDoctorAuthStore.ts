import { create } from 'zustand'
import { doctorService } from '@/services/profesionales/doctorService'
import type {
  DoctorUser,
  DoctorProfile,
  LoginCredentials,
  ChangePasswordPayload,
} from '@/types/profesionales'

export interface DoctorAuthState {
  user: DoctorUser | null
  profile: DoctorProfile | null
  isAuthenticated: boolean
  isLoading: boolean
  isInitialized: boolean
  mustChangePassword: boolean

  // Acciones
  checkAuth: () => Promise<void>
  login: (credentials: LoginCredentials) => Promise<DoctorUser>
  logout: () => Promise<void>
  refreshProfile: () => Promise<void>
  changePassword: (payload: ChangePasswordPayload) => Promise<void>
}

export const useDoctorAuthStore = create<DoctorAuthState>((set, get) => ({
  user: null,
  profile: null,
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false,
  mustChangePassword: false,

  /**
   * Valida silenciosamente si el profesional cuenta con sesión activa vía cookie HttpOnly
   */
  checkAuth: async () => {
    // Si ya está inicializado y no está en loading, evitamos recargas innecesarias
    set({ isLoading: true })
    try {
      const prof = await doctorService.getProfile()
      const mustChange = Boolean(prof.must_change_password)
      const user: DoctorUser = {
        id: prof.id_profesional_dl,
        username: prof.username || prof.user_email || prof.email,
        first_name: prof.nombre,
        id_profesional_dl: prof.id_profesional_dl,
        nombre_profesional: `${prof.nombre} ${prof.apellidos}`.trim(),
        must_change_password: mustChange,
      }

      set({
        user,
        profile: prof,
        isAuthenticated: true,
        mustChangePassword: mustChange,
        isInitialized: true,
        isLoading: false,
      })
    } catch {
      set({
        user: null,
        profile: null,
        isAuthenticated: false,
        mustChangePassword: false,
        isInitialized: true,
        isLoading: false,
      })
    }
  },

  /**
   * Inicia sesión, inyecta la cookie de sesión en el navegador y carga el perfil
   */
  login: async (credentials: LoginCredentials) => {
    set({ isLoading: true })
    try {
      const loggedUser = await doctorService.login(credentials)
      let prof: DoctorProfile | null = null
      try {
        prof = await doctorService.getProfile()
      } catch {
        // En caso de que el perfil demore pero el login sea exitoso
      }

      const mustChange = Boolean(
        loggedUser.must_change_password || (prof && Number(prof.must_change_password) === 1)
      )

      set({
        user: loggedUser,
        profile: prof,
        isAuthenticated: true,
        mustChangePassword: mustChange,
        isInitialized: true,
        isLoading: false,
      })

      return loggedUser
    } catch (error) {
      set({ isLoading: false })
      throw error
    }
  },

  /**
   * Invalida la cookie de sesión y resetea el estado
   */
  logout: async () => {
    set({ isLoading: true })
    try {
      await doctorService.logout()
    } catch (e) {
      console.warn('Error al cerrar sesión en el servidor:', e)
    } finally {
      set({
        user: null,
        profile: null,
        isAuthenticated: false,
        mustChangePassword: false,
        isInitialized: true,
        isLoading: false,
      })
    }
  },

  /**
   * Refresca los datos del perfil clínico
   */
  refreshProfile: async () => {
    try {
      const prof = await doctorService.getProfile()
      const mustChange = Boolean(prof.must_change_password)
      set((state) => ({
        profile: prof,
        mustChangePassword: mustChange,
        user: state.user
          ? {
              ...state.user,
              must_change_password: mustChange,
            }
          : null,
      }))
    } catch (e) {
      console.error('Error al actualizar perfil:', e)
    }
  },

  /**
   * Cambia la contraseña del profesional y refresca el estado
   */
  changePassword: async (payload: ChangePasswordPayload) => {
    await doctorService.changePassword(payload)
    await get().refreshProfile()
  },
}))
