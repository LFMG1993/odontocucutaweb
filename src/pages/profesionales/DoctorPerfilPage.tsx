import React, { useState } from 'react'
import {
  User,
  Mail,
  Phone,
  MapPin,
  FileBadge,
  Lock,
  LogOut,
  ShieldCheck,
  Building,
  AlertTriangle,
  FolderOpen,
  FileSpreadsheet,
  ChevronRight,
} from 'lucide-react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useDoctorAuth } from '@/hooks/profesionales/useDoctorAuth'
import { ChangePasswordModal, TwoFactorSecuritySection } from '@/components/profesionales'
import { useConfirm, useToast } from '@/components/ui'
import { SEO, Button } from '@/components/shared'

interface PerfilLocationState {
  notice?: string
}

export const DoctorPerfilPage: React.FC = () => {
  const { profile, user, logout } = useDoctorAuth()
  const confirmar = useConfirm()
  const toast = useToast()
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const notice = (location.state as PerfilLocationState | null)?.notice

  const handleLogout = async () => {
    const confirmado = await confirmar({
      title: 'Cerrar sesión',
      description: '¿Seguro que deseas cerrar sesión?',
      confirmLabel: 'Cerrar sesión',
      destructive: true,
      icon: <LogOut className="w-5 h-5" />,
    })
    if (!confirmado) return

    await logout()
    toast.success('Sesión cerrada correctamente.')
    navigate('/login')
  }

  const doctorName =
    profile ? `${profile.nombre} ${profile.apellidos}` : user?.nombre_profesional || 'Doctor(a)'
  const especialidad = profile?.especialidad || 'Odontología Especializada'
  const email = profile?.email || profile?.user_email || user?.username || '-'
  const celular = profile?.celular || profile?.telefono || 'No registrado'
  const direccion = profile?.direccion || 'Sede Principal OdontoCúcuta'
  const ciudad = profile?.ciudad ? `${profile.ciudad}, ${profile.comuna || ''}` : 'Cúcuta'
  const rut = profile?.rut || 'No especificado'
  const estado = profile?.estado || 'activo'

  return (
    <div className="space-y-4">
      <SEO
        title="Mi Perfil — Portal Profesionales"
        description="Ficha profesional, datos de contacto y opciones de seguridad."
      />

      {/* Modal de cambio de contraseña */}
      {isPasswordModalOpen && (
        <ChangePasswordModal
          isOpen={isPasswordModalOpen}
          onClose={() => setIsPasswordModalOpen(false)}
        />
      )}

      {notice === 'recovery-code-used' && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-start gap-2.5 animate-fade-in-entry">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" aria-hidden="true" />
          <div>
            <p className="font-bold">Usaste un código de recuperación</p>
            <p className="mt-0.5 leading-snug">
              Ese código ya no es válido. Te recomendamos reconfigurar tu aplicación autenticadora
              desde la sección de seguridad.
            </p>
          </div>
        </div>
      )}

      {/* Tarjeta de Encabezado de Perfil */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-700 to-indigo-600 text-white flex items-center justify-center font-black text-2xl shadow-lg shadow-blue-500/20 shrink-0">
            {doctorName.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h1 className="text-base sm:text-lg font-black text-slate-900 truncate">
                {doctorName}
              </h1>
              <span
                className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                  estado === 'activo'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {estado}
              </span>
            </div>
            <p className="text-xs text-blue-700 font-semibold mt-0.5 truncate">{especialidad}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              ID Profesional Dentalink: #{profile?.id_profesional_dl || user?.id_profesional_dl}
            </p>
          </div>
        </div>
      </div>

      {/* Información de Contacto y Clínica */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-4">
        <h2 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-2">
          <User className="w-4 h-4 text-blue-600" />
          Ficha Profesional
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
          <div className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <Mail className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <div className="min-w-0">
              <p className="text-[10px] uppercase font-bold text-slate-400">Correo Electrónico</p>
              <p className="font-semibold text-slate-800 truncate mt-0.5">{email}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <Phone className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <div className="min-w-0">
              <p className="text-[10px] uppercase font-bold text-slate-400">Teléfono</p>
              <p className="font-semibold text-slate-800 mt-0.5">{celular}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <FileBadge className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <div className="min-w-0">
              <p className="text-[10px] uppercase font-bold text-slate-400">Identificación</p>
              <p className="font-semibold text-slate-800 mt-0.5">{rut}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <Building className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <div className="min-w-0">
              <p className="text-[10px] uppercase font-bold text-slate-400">Ciudad y Región</p>
              <p className="font-semibold text-slate-800 mt-0.5">{ciudad}</p>
            </div>
          </div>

          <div className="sm:col-span-2 flex items-start gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <div className="min-w-0">
              <p className="text-[10px] uppercase font-bold text-slate-400">Dirección Registrada</p>
              <p className="font-semibold text-slate-800 mt-0.5">{direccion}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Seguridad y Cuenta */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-3">
        <h2 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-blue-600" />
          Seguridad
        </h2>

        <div className="flex flex-col gap-2 pt-1">
          <Button
            variant="outline"
            onClick={() => setIsPasswordModalOpen(true)}
            className="w-full py-3 rounded-xl border-slate-200 text-slate-700 hover:bg-slate-50 flex items-center justify-between text-xs font-bold"
          >
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-blue-600" />
              <span>Cambiar Mi Contraseña</span>
            </div>
          </Button>

          <button
            onClick={handleLogout}
            className="w-full py-3 px-4 rounded-xl border border-red-200 bg-red-50/50 hover:bg-red-50 text-red-700 flex items-center justify-between text-xs font-bold transition-colors"
          >
            <div className="flex items-center gap-2">
              <LogOut className="w-4 h-4 text-red-600" />
              <span>Cerrar Sesión</span>
            </div>
          </button>
        </div>
      </div>

      {/* Doble factor de autenticación */}
      <TwoFactorSecuritySection />

      {/* Accesos rápidos */}
      <div className="bg-white rounded-3xl p-3 border border-slate-200/80 shadow-xs space-y-1">
        <Link
          to="/profesionales/acuerdos"
          className="flex items-center justify-between gap-2 p-2.5 rounded-xl hover:bg-slate-50 transition-colors"
        >
          <span className="flex items-center gap-2 text-xs font-bold text-slate-700">
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" aria-hidden="true" />
            Mis acuerdos y tarifas
          </span>
          <ChevronRight className="w-4 h-4 text-slate-300" aria-hidden="true" />
        </Link>
        <Link
          to="/profesionales/archivos"
          className="flex items-center justify-between gap-2 p-2.5 rounded-xl hover:bg-slate-50 transition-colors"
        >
          <span className="flex items-center gap-2 text-xs font-bold text-slate-700">
            <FolderOpen className="w-4 h-4 text-amber-500" aria-hidden="true" />
            Archivos de la clínica
          </span>
          <ChevronRight className="w-4 h-4 text-slate-300" aria-hidden="true" />
        </Link>
      </div>
    </div>
  )
}
