import React, { useEffect } from 'react'
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom'
import {
  Wallet,
  Receipt,
  FileBadge2,
  User,
  LogOut,
  Stethoscope,
} from 'lucide-react'
import { useDoctorAuth } from '@/hooks/profesionales/useDoctorAuth'

export const DoctorLayout: React.FC = () => {
  const { user, profile, logout } = useDoctorAuth()
  const navigate = useNavigate()
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  const handleLogout = async () => {
    if (window.confirm('¿Deseas cerrar sesión del Portal de Profesionales?')) {
      await logout()
      navigate('/profesionales/login')
    }
  }

  const navItems = [
    {
      to: '/profesionales',
      label: 'Liquidaciones',
      icon: Wallet,
      end: true,
    },
    {
      to: '/profesionales/pagos',
      label: 'Pagos',
      icon: Receipt,
      end: false,
    },
    {
      to: '/profesionales/acuerdos',
      label: 'Acuerdos',
      icon: FileBadge2,
      end: false,
    },
    {
      to: '/profesionales/perfil',
      label: 'Mi Perfil',
      icon: User,
      end: false,
    },
  ]

  const doctorName =
    user?.first_name ||
    user?.nombre_profesional ||
    (profile ? `${profile.nombre} ${profile.apellidos}` : 'Doctor(a)')

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col antialiased text-slate-900 pb-20 md:pb-6">
      {/* Top Mobile/Tablet Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-slate-200/80 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-slate-900 text-sm tracking-tight">
                  OdontoSync
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                  Doctor
                </span>
              </div>
              <p className="text-xs text-slate-500 truncate max-w-[200px] sm:max-w-xs font-medium">
                {doctorName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 mr-2">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        isActive
                          ? 'bg-blue-50 text-blue-700 font-semibold'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </NavLink>
                )
              })}
            </nav>

            <button
              onClick={handleLogout}
              title="Cerrar sesión"
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-4 sm:py-6">
        <Outlet />
      </main>

      {/* Bottom Navigation Bar (Mobile First) */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 px-2 py-1.5 md:hidden shadow-lg shadow-slate-900/5">
        <div className="max-w-md mx-auto grid grid-cols-4 gap-1">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center py-1.5 px-2 rounded-xl text-[11px] font-medium transition-all ${
                    isActive
                      ? 'text-blue-700 font-semibold scale-105'
                      : 'text-slate-500 hover:text-slate-900'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div
                      className={`w-6 h-6 flex items-center justify-center rounded-lg transition-colors ${
                        isActive ? 'bg-blue-50 text-blue-700' : 'text-slate-500'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="mt-0.5 tracking-tight">{item.label}</span>
                  </>
                )}
              </NavLink>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
