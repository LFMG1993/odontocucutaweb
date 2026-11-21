import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowLeft,
  Stethoscope,
  ShieldCheck,
  KeyRound,
  Smartphone,
} from 'lucide-react'
import { useDoctorAuthStore } from '@/store/profesionales'
import { doctorService } from '@/services/profesionales/doctorService'
import { getApiErrorMessage, getApiErrorStatus } from '@/utils/apiErrors'
import { Button, PwaInstallPrompt, SEO } from '@/components/shared'
import {
  CodeInput,
  DoctorPortalFooter,
  RecoveryCodes,
  TwoFactorQrPanel,
} from '@/components/profesionales'
import type { DoctorUser, TwoFactorChallenge, TwoFactorSetupData } from '@/types/profesionales'

interface LocationState {
  from?: {
    pathname?: string
  }
}

type LoginStep = 'credentials' | '2fa-verify' | '2fa-setup' | 'recovery-codes'

function resolverMensajeError(err: unknown, fallback: string): string {
  if (getApiErrorStatus(err) === 401) {
    return 'El proceso expiró. Vuelve a iniciar sesión.'
  }
  return getApiErrorMessage(err, fallback)
}

export const DoctorLoginPage: React.FC = () => {
  const [step, setStep] = useState<LoginStep>('credentials')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('')
  const [rememberDevice, setRememberDevice] = useState(false)
  const [usarRecuperacion, setUsarRecuperacion] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Datos temporales del flujo 2FA (solo en memoria, nunca en localStorage)
  const [challenge, setChallenge] = useState<TwoFactorChallenge | null>(null)
  const [setupData, setSetupData] = useState<TwoFactorSetupData | null>(null)
  const [pendingUser, setPendingUser] = useState<DoctorUser | null>(null)
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([])
  const [destino, setDestino] = useState<{ to: string; notice?: string } | null>(null)

  const { login, completeSession, isAuthenticated, isInitialized, checkAuth } = useDoctorAuthStore()
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as LocationState | null

  useEffect(() => {
    if (!isInitialized) {
      checkAuth()
    }
  }, [isInitialized, checkAuth])

  useEffect(() => {
    if (!isAuthenticated) return
    const fromPath = state?.from?.pathname
    const safeFrom =
      fromPath && !fromPath.startsWith('/login') && !fromPath.startsWith('/profesionales/login')
        ? fromPath
        : '/profesionales'
    const target = destino ?? { to: safeFrom }
    navigate(target.to, {
      replace: true,
      state: target.notice ? { notice: target.notice } : undefined,
    })
  }, [isAuthenticated, destino, navigate, state])

  const reiniciarFlujo = () => {
    setStep('credentials')
    setChallenge(null)
    setSetupData(null)
    setPendingUser(null)
    setRecoveryCodes([])
    setCode('')
    setRememberDevice(false)
    setUsarRecuperacion(false)
    setError(null)
  }

  const solicitarConfiguracion = async (challengeToken: string) => {
    setIsSubmitting(true)
    setError(null)
    try {
      const data = await doctorService.setupTwoFactorLogin(challengeToken)
      setSetupData(data)
      setStep('2fa-setup')
    } catch (err: unknown) {
      setError(resolverMensajeError(err, 'No se pudo iniciar la configuración del 2FA.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCredenciales = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!username.trim() || !password) {
      setError('Por favor completa todos los campos')
      return
    }

    setIsSubmitting(true)
    try {
      const result = await login({ username: username.trim(), password })

      if (!result.requires2FA) {
        // completeSession ya dejó isAuthenticated en true: el efecto redirige
        return
      }

      setChallenge(result.challenge)
      setCode('')

      if (result.challenge.step === 'setup_required') {
        setStep('2fa-setup')
        await solicitarConfiguracion(result.challenge.challenge_token)
      } else {
        setStep('2fa-verify')
      }
    } catch (err: unknown) {
      setError(
        resolverMensajeError(
          err,
          'Credenciales incorrectas o problema de comunicación con el servidor.'
        )
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleVerificar2FA = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!challenge) return

    const codigoNormalizado = code.trim()
    if (usarRecuperacion ? codigoNormalizado.length < 6 : codigoNormalizado.length !== 6) {
      setError(
        usarRecuperacion
          ? 'Ingresa un código de recuperación válido (ej: A1B2-C3D4).'
          : 'Ingresa el código de 6 dígitos.'
      )
      return
    }

    setError(null)
    setIsSubmitting(true)
    try {
      const data = await doctorService.verifyTwoFactor({
        challenge_token: challenge.challenge_token,
        code: codigoNormalizado,
        // remember_device solo aplica a códigos TOTP
        remember_device: usarRecuperacion ? false : rememberDevice,
      })

      if (data.used_recovery) {
        setDestino({ to: '/profesionales/perfil', notice: 'recovery-code-used' })
      }

      setChallenge(null)
      setCode('')
      await completeSession(data.user)
    } catch (err: unknown) {
      const status = getApiErrorStatus(err)
      if (status === 401) {
        reiniciarFlujo()
      }
      setError(resolverMensajeError(err, 'Código inválido. Verifica e intenta nuevamente.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleConfirmarSetup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!challenge || !setupData) return
    if (code.length !== 6) {
      setError('Ingresa el código de 6 dígitos que muestra tu aplicación.')
      return
    }

    setError(null)
    setIsSubmitting(true)
    try {
      const data = await doctorService.confirmTwoFactorLogin({
        challenge_token: challenge.challenge_token,
        setup_token: setupData.setup_token,
        code,
        remember_device: rememberDevice,
      })
      setPendingUser(data.user)
      setRecoveryCodes(data.recovery_codes || [])
      setCode('')
      setStep('recovery-codes')
    } catch (err: unknown) {
      const status = getApiErrorStatus(err)
      if (status === 401) {
        reiniciarFlujo()
      }
      setError(resolverMensajeError(err, 'No se pudo confirmar el código. Intenta de nuevo.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFinalizar = async () => {
    if (!pendingUser) return
    setIsSubmitting(true)
    try {
      await completeSession(pendingUser)
    } finally {
      setIsSubmitting(false)
    }
  }

  let titulo = 'Acceso a tu cuenta'
  let subtitulo = 'Ingresa con tus credenciales de Odontocúcuta'

  if (step === '2fa-verify') {
    titulo = 'Verificación en dos pasos'
    subtitulo = 'Ingresa el código de tu aplicación autenticadora'
  } else if (step === '2fa-setup') {
    titulo = 'Activa el doble factor'
    subtitulo = 'Tu cuenta requiere configurar 2FA para continuar'
  } else if (step === 'recovery-codes') {
    titulo = 'Guarda tus códigos'
    subtitulo = 'Son tu respaldo si pierdes el dispositivo'
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-100 via-slate-50 to-white flex flex-col justify-between p-4 sm:p-6 text-slate-900">
      <SEO
        title="Acceso | Odontocúcuta"
        description="Ingresa a tu cuenta de Odontocúcuta. Acceso para profesionales y pacientes."
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
              {step === '2fa-verify' ? (
                <Smartphone className="w-7 h-7" />
              ) : step === '2fa-setup' || step === 'recovery-codes' ? (
                <KeyRound className="w-7 h-7" />
              ) : (
                <Stethoscope className="w-7 h-7" />
              )}
            </div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900">{titulo}</h1>
            <p className="text-xs text-slate-500 mt-1 font-medium">{subtitulo}</p>
            {step !== 'credentials' && username && (
              <p className="text-[11px] text-blue-700 font-semibold mt-1 truncate">{username}</p>
            )}
          </div>

          {/* Mensaje de Error */}
          {error && (
            <div className="mb-5 p-3 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5 animate-fade-in-entry">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
              <span className="leading-snug">{error}</span>
            </div>
          )}

          {/* Paso 1: credenciales */}
          {step === 'credentials' && (
            <>
              <form onSubmit={handleCredenciales} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Usuario</label>
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
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Contraseña</label>
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
                      aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex justify-center m-3">
                  <Link
                    to="/recuperar-password"
                    className="text-[11px] font-semibold text-blue-700 hover:text-blue-900"
                  >
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  isLoading={isSubmitting}
                  className="w-full py-3.5 rounded-xl font-bold text-sm bg-blue-700 hover:bg-blue-800 text-white shadow-lg shadow-blue-700/20 mt-2"
                >
                  Ingresar
                </Button>
              </form>

            </>
          )}

          {/* Paso 2a: verificar código 2FA */}
          {step === '2fa-verify' && (
            <form onSubmit={handleVerificar2FA} className="space-y-4">
              <p className="text-xs text-slate-500 leading-relaxed">
                {usarRecuperacion
                  ? 'Ingresa uno de los códigos de recuperación que guardaste al activar el doble factor. Cada código sirve una sola vez.'
                  : 'Abre tu aplicación autenticadora y escribe el código de 6 dígitos.'}
              </p>

              {usarRecuperacion ? (
                <div>
                  <label
                    htmlFor="codigo-recuperacion"
                    className="block text-xs font-bold text-slate-700 mb-1.5"
                  >
                    Código de recuperación
                  </label>
                  <input
                    id="codigo-recuperacion"
                    type="text"
                    value={code}
                    disabled={isSubmitting}
                    autoFocus
                    autoComplete="off"
                    autoCapitalize="characters"
                    autoCorrect="off"
                    spellCheck={false}
                    placeholder="A1B2-C3D4"
                    onChange={(e) =>
                      setCode(
                        e.target.value
                          .toUpperCase()
                          .replace(/[^A-Z0-9-]/g, '')
                          .slice(0, 12)
                      )
                    }
                    className="w-full px-3.5 py-3 text-center text-lg tracking-[0.25em] font-mono font-bold rounded-xl border border-slate-200 bg-slate-50/60 text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all disabled:opacity-60"
                  />
                </div>
              ) : (
                <CodeInput
                  value={code}
                  onChange={setCode}
                  disabled={isSubmitting}
                  autoFocus
                  label="Código de verificación"
                />
              )}

              {!usarRecuperacion && (
                <label className="flex items-start gap-2 text-xs text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberDevice}
                    onChange={(e) => setRememberDevice(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded border-slate-300 text-blue-700 focus:ring-blue-600"
                  />
                  <span>Recordar este equipo por 30 días.</span>
                </label>
              )}

              <button
                type="button"
                onClick={() => {
                  setUsarRecuperacion((actual) => !actual)
                  setCode('')
                  setError(null)
                }}
                className="text-[11px] font-semibold text-blue-700 hover:text-blue-900"
              >
                {usarRecuperacion
                  ? 'Usar el código de mi aplicación autenticadora'
                  : 'Usar un código de recuperación'}
              </button>

              <Button
                type="submit"
                variant="primary"
                isLoading={isSubmitting}
                className="w-full py-3.5 rounded-xl font-bold text-sm bg-blue-700 hover:bg-blue-800 text-white"
              >
                Verificar e ingresar
              </Button>

              <button
                type="button"
                onClick={reiniciarFlujo}
                className="w-full text-[11px] font-semibold text-slate-500 hover:text-slate-800 py-1"
              >
                Volver a iniciar sesión
              </button>
            </form>
          )}

          {/* Paso 2b: configurar 2FA obligatorio */}
          {step === '2fa-setup' && (
            <form onSubmit={handleConfirmarSetup} className="space-y-4">
              {setupData ? (
                <TwoFactorQrPanel
                  qrDataUri={setupData.qr_data_uri}
                  secret={setupData.secret}
                  account={setupData.account}
                />
              ) : (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-2">
                  <p className="text-xs text-slate-500">No se pudo cargar el código QR.</p>
                  <Button
                    type="button"
                    variant="outline"
                    isLoading={isSubmitting}
                    onClick={() =>
                      challenge && solicitarConfiguracion(challenge.challenge_token)
                    }
                    className="text-xs py-2 px-3 rounded-lg"
                  >
                    Reintentar
                  </Button>
                </div>
              )}

              <CodeInput
                value={code}
                onChange={setCode}
                disabled={isSubmitting || !setupData}
                autoFocus={Boolean(setupData)}
                label="Código generado por la app"
              />

              <label className="flex items-start gap-2 text-xs text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberDevice}
                  onChange={(e) => setRememberDevice(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-slate-300 text-blue-700 focus:ring-blue-600"
                />
                <span>Recordar este equipo por 30 días.</span>
              </label>

              <Button
                type="submit"
                variant="primary"
                isLoading={isSubmitting}
                disabled={!setupData}
                className="w-full py-3.5 rounded-xl font-bold text-sm bg-blue-700 hover:bg-blue-800 text-white"
              >
                Confirmar y continuar
              </Button>

              <button
                type="button"
                onClick={reiniciarFlujo}
                className="w-full text-[11px] font-semibold text-slate-500 hover:text-slate-800 py-1"
              >
                Cancelar
              </button>
            </form>
          )}

          {/* Paso 3: códigos de recuperación */}
          {step === 'recovery-codes' && (
            <RecoveryCodes
              codes={recoveryCodes}
              onConfirm={handleFinalizar}
              confirmLabel="Continuar al portal"
              isLoading={isSubmitting}
            />
          )}
        </div>

        <PwaInstallPrompt variant="login" />
      </main>

      <DoctorPortalFooter />
    </div>
  )
}
