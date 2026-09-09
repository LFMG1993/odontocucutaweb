import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { Lock, Mail, Eye, EyeOff, AlertCircle, ArrowLeft, Stethoscope, ShieldCheck, ChevronUp } from 'lucide-react'
import { useDoctorAuthStore } from '@/store/profesionales'
import { Button, SEO } from '@/components/shared'

interface LocationState {
  from?: {
    pathname?: string
  }
}

export const DoctorLoginPage: React.FC = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { login, isAuthenticated, isInitialized, checkAuth } = useDoctorAuthStore()
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as LocationState | null

  useEffect(() => {
    if (!isInitialized) {
      checkAuth()
    }
  }, [isInitialized, checkAuth])

  useEffect(() => {
    if (isAuthenticated) {
      const from = state?.from?.pathname || '/profesionales'
      navigate(from, { replace: true })
    }
  }, [isAuthenticated, navigate, state])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!username.trim() || !password) {
      setError('Por favor completa todos los campos')
      return
    }

    setIsSubmitting(true)
    try {
      await login({ username: username.trim(), password })
      const from = state?.from?.pathname || '/profesionales'
      navigate(from, { replace: true })
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : 'Credenciales incorrectas o problema de comunicación con el servidor.'
      setError(msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-100 via-slate-50 to-white flex flex-col justify-between p-4 sm:p-6 text-slate-900">
      <SEO
        title="Portal de Profesionales — Acceso Clínico"
        description="Portal privado para profesionales y especialistas de OdontoCúcuta y OdontoSync."
      />

      {/* Header móvil con link de retorno */}
      <header className="max-w-4xl w-full mx-auto flex items-center justify-between pt-2">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors py-1.5 px-3 rounded-full hover:bg-slate-200/60"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Sitio Web</span>
        </Link>

        <div className="flex items-center gap-1 text-[11px] font-medium text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
          <span>Acceso Seguro</span>
        </div>
      </header>

      {/* Contenedor central del formulario */}
      <main className="max-w-md w-full mx-auto my-auto py-8">
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/60 border border-slate-100">
          {/* Logo y Encabezado */}
          <div className="text-center mb-6">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-linear-to-tr from-blue-800 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/30 mb-3.5">
              <Stethoscope className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900">
              Portal Profesional
            </h1>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              Consulta tus liquidaciones, procedimientos y acuerdos de pago
            </p>
          </div>

          {/* Mensaje de Error */}
          {error && (
            <div className="mb-5 p-3 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5 animate-fade-in-entry">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
              <span className="leading-snug">{error}</span>
            </div>
          )}

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Usuario / Correo Clínico
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="ejemplo@odontocucuta.com"
                  required
                  className="w-full pl-10 pr-3.5 py-3 text-sm rounded-xl border border-slate-200 bg-slate-50/60 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full pl-10 pr-10 py-3 text-sm rounded-xl border border-slate-200 bg-slate-50/60 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              isLoading={isSubmitting}
              className="w-full py-3.5 rounded-xl font-bold text-sm bg-blue-700 hover:bg-blue-800 text-white shadow-lg shadow-blue-700/20 mt-2"
            >
              Ingresar al Portal
            </Button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <p className="text-[11px] text-slate-400">
              ¿Olvidaste tu acceso o tienes problemas para ingresar?
              <br />
              <span className="text-slate-600 font-semibold">
                Contacta a la Coordinación Odontológica de tu sede
              </span>
            </p>
          </div>
        </div>
      </main>

      {/* Footer del login con sección institucional y marca Molink */}
      <footer className="max-w-4xl w-full mx-auto mt-8 pt-6 border-t border-slate-200/80 flex flex-col md:flex-row items-center justify-between gap-4 pb-4">
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 text-xs text-slate-500 text-center sm:text-left">
          <p>
            © {new Date().getFullYear()} Odontocúcuta S.A. Todos los derechos reservados.
          </p>
          <span className="hidden sm:inline text-slate-300">•</span>
          <p className="text-[11px] sm:text-xs">
            Creado y Desarrollado por{" "}
            <a
              href="https://molink.com.co"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-700 hover:text-blue-900 font-semibold transition-colors underline decoration-blue-200 underline-offset-2 hover:decoration-blue-600"
            >
              Molink Tecnologia
            </a>
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500">
          <Link to="/contacto" className="hover:text-blue-700 transition-colors">
            Términos y Condiciones
          </Link>
          <Link to="/contacto" className="hover:text-blue-700 transition-colors">
            Política de Privacidad
          </Link>
        </div>

        <button
          type="button"
          className="w-9 h-9 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors shrink-0"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Volver arriba"
        >
          <ChevronUp className="w-4 h-4" aria-hidden="true" />
        </button>
      </footer>
    </div>
  )
}
