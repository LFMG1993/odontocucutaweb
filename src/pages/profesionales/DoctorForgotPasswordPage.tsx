import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Lock,
  Mail,
  MailCheck,
  ShieldCheck,
} from 'lucide-react'
import { doctorService } from '@/services/profesionales/doctorService'
import { Button, SEO } from '@/components/shared'
import {
  CodeInput,
  DoctorPortalFooter,
  PasswordRequirements,
} from '@/components/profesionales'
import { isStrongPassword } from '@/utils/password'
import { getApiErrorMessage } from '@/utils/apiErrors'

type Paso = 'solicitar' | 'verificar' | 'restablecer' | 'listo'

const REENVIO_SEGUNDOS = 60

function resolverMensajeError(err: unknown, fallback: string): string {
  return getApiErrorMessage(err, fallback)
}

function formatearSegundos(total: number): string {
  const minutos = Math.floor(total / 60)
  const segundos = total % 60
  return `${minutos}:${String(segundos).padStart(2, '0')}`
}

export const DoctorForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate()

  const [paso, setPaso] = useState<Paso>('solicitar')
  const [identifier, setIdentifier] = useState('')
  const [code, setCode] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const [mensajeNeutro, setMensajeNeutro] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // Tokens temporales: solo en memoria, nunca en localStorage
  const [resetToken, setResetToken] = useState<string | null>(null)

  const [reenvioCooldown, setReenvioCooldown] = useState(0)
  const [tokenSegundos, setTokenSegundos] = useState(0)

  useEffect(() => {
    if (reenvioCooldown <= 0) return
    const timer = window.setTimeout(() => setReenvioCooldown((s) => s - 1), 1000)
    return () => window.clearTimeout(timer)
  }, [reenvioCooldown])

  useEffect(() => {
    if (tokenSegundos <= 0) return
    const timer = window.setTimeout(() => setTokenSegundos((s) => s - 1), 1000)
    return () => window.clearTimeout(timer)
  }, [tokenSegundos])

  const tokenExpirado = Boolean(resetToken) && tokenSegundos === 0

  const enviarCodigo = async () => {
    setError(null)
    if (!identifier.trim()) {
      setError('Ingresa tu correo o usuario.')
      return
    }

    setLoading(true)
    try {
      const mensaje = await doctorService.requestPasswordResetCode(identifier.trim())
      setMensajeNeutro(
        mensaje ||
          'Si los datos coinciden con una cuenta de profesional, recibirás un código en tu correo.'
      )
      setCode('')
      setReenvioCooldown(REENVIO_SEGUNDOS)
      setPaso('verificar')
    } catch (err: unknown) {
      setError(resolverMensajeError(err, 'No se pudo solicitar el código. Intenta más tarde.'))
    } finally {
      setLoading(false)
    }
  }

  const solicitarCodigo = async (e: React.FormEvent) => {
    e.preventDefault()
    await enviarCodigo()
  }

  const verificarCodigo = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (code.length !== 6) {
      setError('Ingresa el código de 6 dígitos que recibiste por correo.')
      return
    }

    setLoading(true)
    try {
      const data = await doctorService.verifyPasswordResetCode(identifier.trim(), code)
      setResetToken(data.reset_token)
      setTokenSegundos(data.expires_in || 900)
      setPassword('')
      setConfirmPassword('')
      setPaso('restablecer')
    } catch (err: unknown) {
      setError(
        resolverMensajeError(err, 'Código inválido o expirado. Verifícalo e intenta nuevamente.')
      )
    } finally {
      setLoading(false)
    }
  }

  const restablecer = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!resetToken || tokenSegundos === 0) {
      setResetToken(null)
      setPaso('solicitar')
      setError('Tu sesión de recuperación expiró. Solicita un nuevo código.')
      return
    }
    if (!isStrongPassword(password)) {
      setError('La contraseña no cumple con todos los requisitos de seguridad.')
      return
    }
    if (password !== confirmPassword) {
      setError('La nueva contraseña y su confirmación no coinciden.')
      return
    }

    setLoading(true)
    try {
      await doctorService.resetPassword({
        reset_token: resetToken,
        password,
        confirm_password: confirmPassword,
      })

      setResetToken(null)
      setTokenSegundos(0)
      setPassword('')
      setConfirmPassword('')
      setPaso('listo')
    } catch (err: unknown) {
      setError(resolverMensajeError(err, 'No se pudo actualizar la contraseña.'))
    } finally {
      setLoading(false)
    }
  }

  const reiniciar = () => {
    setPaso('solicitar')
    setCode('')
    setResetToken(null)
    setTokenSegundos(0)
    setError(null)
    setMensajeNeutro(null)
  }

  const titulos: Record<Paso, { titulo: string; subtitulo: string; icono: React.ReactNode }> = {
    solicitar: {
      titulo: 'Recuperar contraseña',
      subtitulo: 'Te enviaremos un código de verificación a tu correo',
      icono: <KeyRound className="w-7 h-7" />,
    },
    verificar: {
      titulo: 'Revisa tu correo',
      subtitulo: 'Ingresa el código de 6 dígitos que enviamos',
      icono: <MailCheck className="w-7 h-7" />,
    },
    restablecer: {
      titulo: 'Nueva contraseña',
      subtitulo: 'Define una contraseña segura para tu cuenta',
      icono: <Lock className="w-7 h-7" />,
    },
    listo: {
      titulo: 'Contraseña actualizada',
      subtitulo: 'Ya puedes iniciar sesión con tu nueva clave',
      icono: <CheckCircle2 className="w-7 h-7" />,
    },
  }

  const actual = titulos[paso]

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-100 via-slate-50 to-white flex flex-col p-4 sm:p-6 text-slate-900">
      <SEO
        title="Recuperar contraseña | Odontocúcuta"
        description="Restablece la contraseña de tu cuenta del Portal de Profesionales de Odontocúcuta."
      />

      <header className="max-w-md w-full mx-auto flex items-center justify-between pt-2">
        <Link
          to="/profesionales/login"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors py-1.5 px-3 rounded-full hover:bg-slate-200/60"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Volver al login</span>
        </Link>
        <div className="flex items-center gap-1 text-[11px] font-medium text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
          <span>Acceso Seguro</span>
        </div>
      </header>

      <main className="max-w-md w-full mx-auto my-auto py-8">
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/60 border border-slate-100">
          <div className="text-center mb-6">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-linear-to-tr from-blue-800 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/30 mb-3.5">
              {actual.icono}
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
              {actual.titulo}
            </h1>
            <p className="text-xs text-slate-500 mt-1 font-medium">{actual.subtitulo}</p>
            {paso === 'verificar' && identifier && (
              <p className="text-[11px] text-blue-700 font-semibold mt-1 truncate">{identifier}</p>
            )}
          </div>

          {error && (
            <div className="mb-5 p-3 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5 animate-fade-in-entry">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" aria-hidden="true" />
              <span className="leading-snug">{error}</span>
            </div>
          )}

          {mensajeNeutro && paso === 'verificar' && (
            <div className="mb-5 p-3 rounded-2xl bg-blue-50 border border-blue-200 text-blue-800 text-xs flex items-start gap-2.5">
              <Mail className="w-4 h-4 shrink-0 mt-0.5 text-blue-600" aria-hidden="true" />
              <span className="leading-snug">{mensajeNeutro}</span>
            </div>
          )}

          {paso === 'solicitar' && (
            <form onSubmit={solicitarCodigo} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Correo o usuario
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    autoComplete="username"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="ejemplo@odontocucuta.com"
                    required
                    className="w-full pl-10 pr-3.5 py-3 text-sm rounded-xl border border-slate-200 bg-slate-50/60 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                  />
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                isLoading={loading}
                className="w-full py-3.5 rounded-xl font-bold text-sm bg-blue-700 hover:bg-blue-800 text-white"
              >
                Enviar código
              </Button>

            </form>
          )}

          {paso === 'verificar' && (
            <form onSubmit={verificarCodigo} className="space-y-4">
              <CodeInput
                value={code}
                onChange={setCode}
                disabled={loading}
                autoFocus
                label="Código recibido por correo"
              />

              <Button
                type="submit"
                variant="primary"
                isLoading={loading}
                className="w-full py-3.5 rounded-xl font-bold text-sm bg-blue-700 hover:bg-blue-800 text-white"
              >
                Verificar código
              </Button>

              <div className="flex items-center justify-between text-[11px]">
                <button
                  type="button"
                  onClick={reiniciar}
                  className="font-semibold text-slate-500 hover:text-slate-800"
                >
                  Usar otro correo
                </button>
                <button
                  type="button"
                  disabled={reenvioCooldown > 0 || loading}
                  onClick={() => enviarCodigo()}
                  className="font-semibold text-blue-700 hover:text-blue-900 disabled:text-slate-400 disabled:cursor-not-allowed"
                >
                  {reenvioCooldown > 0
                    ? `Reenviar en ${formatearSegundos(reenvioCooldown)}`
                    : 'Reenviar código'}
                </button>
              </div>
            </form>
          )}

          {paso === 'restablecer' && (
            <form onSubmit={restablecer} className="space-y-4">
              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span>Código verificado</span>
                <span
                  className={`font-semibold ${tokenExpirado ? 'text-red-600' : 'text-blue-700'}`}
                >
                  {tokenExpirado
                    ? 'Código expirado'
                    : `Expira en ${formatearSegundos(tokenSegundos)}`}
                </span>
              </div>

              {tokenExpirado && (
                <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
                    <span>El tiempo para restablecer tu contraseña expiró.</span>
                  </div>
                  <button
                    type="button"
                    onClick={reiniciar}
                    className="px-2 py-0.5 rounded-lg bg-amber-600 text-white font-semibold hover:bg-amber-700 shrink-0"
                  >
                    Nuevo código
                  </button>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Nueva contraseña
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-3.5 py-3 pr-10 text-sm rounded-xl border border-slate-200 bg-slate-50/60 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                    placeholder="Mínimo 8 caracteres"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                    aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <PasswordRequirements password={password} />

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Confirmar contraseña
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full px-3.5 py-3 text-sm rounded-xl border border-slate-200 bg-slate-50/60 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                  placeholder="Repite la nueva contraseña"
                />
                {confirmPassword && password !== confirmPassword && (
                  <p className="text-[11px] text-red-600 mt-1">Las contraseñas no coinciden.</p>
                )}
              </div>

              <Button
                type="submit"
                variant="primary"
                isLoading={loading}
                disabled={tokenExpirado || !isStrongPassword(password) || password !== confirmPassword}
                className="w-full py-3.5 rounded-xl font-bold text-sm bg-blue-700 hover:bg-blue-800 text-white"
              >
                Guardar contraseña
              </Button>
            </form>
          )}

          {paso === 'listo' && (
            <div className="space-y-4">
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
                <span>
                  Tu contraseña fue actualizada correctamente. Ya puedes iniciar sesión con tu nueva
                  clave.
                </span>
              </div>
              <Button
                type="button"
                variant="primary"
                onClick={() => navigate('/profesionales/login', { replace: true })}
                className="w-full py-3.5 rounded-xl font-bold text-sm bg-blue-700 hover:bg-blue-800 text-white"
              >
                Ir al inicio de sesión
              </Button>
            </div>
          )}
        </div>
      </main>

      <DoctorPortalFooter />
    </div>
  )
}
