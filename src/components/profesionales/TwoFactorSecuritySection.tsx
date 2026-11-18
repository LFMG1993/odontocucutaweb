import React, { useState } from 'react'
import {
  AlertCircle,
  CheckCircle2,
  Laptop,
  Loader2,
  ShieldCheck,
  ShieldOff,
  Smartphone,
  Trash2,
  X,
} from 'lucide-react'
import { useTwoFactor } from '@/hooks/profesionales/useTwoFactor'
import type { TwoFactorSetupData } from '@/types/profesionales'
import { Button } from '@/components/shared'
import { useConfirm } from '@/components/ui'
import { formatDateShort } from '@/utils/formatters'
import { getApiErrorMessage, getApiErrorStatus } from '@/utils/apiErrors'
import { CodeInput } from './CodeInput'
import { RecoveryCodes } from './RecoveryCodes'
import { TwoFactorQrPanel } from './TwoFactorQrPanel'

const POLICY_STYLES: Record<string, string> = {
  optional: 'bg-slate-100 text-slate-600 border-slate-200',
  forced_admins: 'bg-amber-50 text-amber-700 border-amber-200',
  forced_all: 'bg-amber-50 text-amber-700 border-amber-200',
  disabled: 'bg-red-50 text-red-700 border-red-200',
}

export const TwoFactorSecuritySection: React.FC = () => {
  const {
    status,
    devices,
    devicesEnabled,
    expireDays,
    loading,
    error,
    actionLoading,
    refetch,
    iniciarActivacion,
    confirmarActivacion,
    desactivar,
    revocarEquipo,
    revocarTodos,
  } = useTwoFactor()

  const [setupData, setSetupData] = useState<TwoFactorSetupData | null>(null)
  const [code, setCode] = useState('')
  const [recoveryCodes, setRecoveryCodes] = useState<string[] | null>(null)
  const [showDisable, setShowDisable] = useState(false)
  const [password, setPassword] = useState('')
  const [actionError, setActionError] = useState<string | null>(null)
  const [actionMessage, setActionMessage] = useState<string | null>(null)

  const confirmar = useConfirm()

  const limpiarMensajes = () => {
    setActionError(null)
    setActionMessage(null)
  }

  const cerrarSetup = () => {
    setSetupData(null)
    setCode('')
    limpiarMensajes()
  }

  const handleActivar = async () => {
    limpiarMensajes()
    try {
      const data = await iniciarActivacion()
      setSetupData(data)
      setCode('')
    } catch (err: unknown) {
      if (getApiErrorStatus(err) === 409) {
        setActionMessage('El 2FA ya está activo en tu cuenta.')
        await refetch()
      } else {
        setActionError(getApiErrorMessage(err, 'No se pudo iniciar la activación'))
      }
    }
  }

  const handleConfirmar = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!setupData) return
    if (code.length !== 6) {
      setActionError('Ingresa el código de 6 dígitos de tu aplicación autenticadora.')
      return
    }
    limpiarMensajes()
    try {
      const codes = await confirmarActivacion(setupData.setup_token, code)
      setSetupData(null)
      setCode('')
      setRecoveryCodes(codes)
      setActionMessage('2FA activado correctamente.')
    } catch (err: unknown) {
      setActionError(getApiErrorMessage(err, 'Código inválido. Intenta de nuevo.'))
    }
  }

  const handleDesactivar = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!password) {
      setActionError('Ingresa tu contraseña actual.')
      return
    }
    limpiarMensajes()
    try {
      await desactivar(password)
      setShowDisable(false)
      setPassword('')
      setActionMessage('2FA desactivado correctamente.')
    } catch (err: unknown) {
      setActionError(getApiErrorMessage(err, 'No se pudo desactivar el 2FA'))
    }
  }

  const handleRevocar = async (id: number, nombre: string | null) => {
    const confirmado = await confirmar({
      title: 'Revocar equipo',
      description: `¿Revocar el acceso del equipo "${nombre || 'desconocido'}"?`,
      confirmLabel: 'Revocar',
      destructive: true,
    })
    if (!confirmado) return

    limpiarMensajes()
    try {
      await revocarEquipo(id)
      setActionMessage('Equipo revocado. Deberá validar 2FA en su próximo ingreso.')
    } catch (err: unknown) {
      setActionError(getApiErrorMessage(err, 'No se pudo revocar el equipo'))
    }
  }

  const handleRevocarTodos = async () => {
    const confirmado = await confirmar({
      title: 'Revocar todos los equipos',
      description: '¿Revocar todos los equipos de confianza? Todos deberán validar 2FA de nuevo.',
      confirmLabel: 'Revocar todos',
      destructive: true,
    })
    if (!confirmado) return

    limpiarMensajes()
    try {
      await revocarTodos()
      setActionMessage('Todos los equipos de confianza fueron revocados.')
    } catch (err: unknown) {
      setActionError(getApiErrorMessage(err, 'No se pudieron revocar los equipos'))
    }
  }

  const habilitado = Boolean(status?.enabled)

  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-3">
      <div className="flex items-start justify-between gap-2">
        <h2 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-blue-600" aria-hidden="true" />
          Doble factor (2FA)
        </h2>

        {status && (
          <span
            className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${
              habilitado
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-slate-100 text-slate-600 border-slate-200'
            }`}
          >
            {habilitado ? 'Activo' : 'Inactivo'}
          </span>
        )}
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-xs text-slate-500 py-2">
          <Loader2 className="w-4 h-4 animate-spin text-blue-600" aria-hidden="true" />
          Consultando el estado de seguridad...
        </div>
      )}

      {error && !loading && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start justify-between gap-2">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={() => refetch()}
            className="px-2 py-0.5 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 shrink-0"
          >
            Reintentar
          </button>
        </div>
      )}

      {actionError && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
          <span>{actionError}</span>
        </div>
      )}

      {actionMessage && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
          <span>{actionMessage}</span>
        </div>
      )}

      {status && !loading && (
        <>
          <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
            <span>Política: </span>
            <span
              className={`px-1.5 py-0.5 rounded-full border font-semibold ${
                POLICY_STYLES[status.policy] || POLICY_STYLES.optional
              }`}
            >
              {status.policy_label || status.policy}
            </span>
            {habilitado && status.confirmed_at && (
              <span>· Activado el {formatDateShort(status.confirmed_at)}</span>
            )}
          </div>

          <p className="text-[11px] leading-relaxed text-slate-500">
            {habilitado
              ? 'Tu cuenta está protegida con un segundo factor. Cada inicio de sesión pedirá un código temporal o uno de tus códigos de recuperación.'
              : 'Añade una capa extra de seguridad. Además de tu contraseña, se pedirá un código de 6 dígitos generado por tu aplicación autenticadora.'}
          </p>

          {!setupData && (
            <div className="pt-1">
              {habilitado ? (
                <Button
                  type="button"
                  variant="outline"
                  disabled={actionLoading}
                  onClick={() => {
                    limpiarMensajes()
                    setPassword('')
                    setShowDisable(true)
                  }}
                  className="w-full py-3 rounded-xl border-red-200 bg-red-50/50 text-red-700 hover:bg-red-50 flex items-center justify-between text-xs font-bold"
                >
                  <span className="flex items-center gap-2">
                    <ShieldOff className="w-4 h-4" aria-hidden="true" />
                    Desactivar 2FA
                  </span>
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="primary"
                  isLoading={actionLoading}
                  disabled={status.policy === 'disabled'}
                  onClick={handleActivar}
                  className="w-full py-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold"
                >
                  <ShieldCheck className="w-4 h-4" aria-hidden="true" />
                  Activar 2FA
                </Button>
              )}
            </div>
          )}

          {/* Equipos de confianza */}
          {habilitado && devicesEnabled && (
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                  Equipos de confianza
                </h3>
                {devices.length > 0 && (
                  <button
                    type="button"
                    onClick={handleRevocarTodos}
                    disabled={actionLoading}
                    className="text-[11px] font-semibold text-red-600 hover:text-red-800 disabled:opacity-50"
                  >
                    Revocar todos
                  </button>
                )}
              </div>

              {devices.length === 0 ? (
                <p className="text-[11px] text-slate-400 py-1">
                  No hay equipos recordados. Al marcar “recordar este equipo” aparecerán aquí por{' '}
                  {expireDays} días.
                </p>
              ) : (
                <ul className="space-y-1.5">
                  {devices.map((device) => (
                    <li
                      key={device.id}
                      className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 text-slate-500 flex items-center justify-center shrink-0">
                          {device.device_name?.toLowerCase().includes('móvil') ||
                          device.device_name?.toLowerCase().includes('android') ||
                          device.device_name?.toLowerCase().includes('iphone') ? (
                            <Smartphone className="w-3.5 h-3.5" aria-hidden="true" />
                          ) : (
                            <Laptop className="w-3.5 h-3.5" aria-hidden="true" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-[11px] font-semibold text-slate-700 truncate">
                            {device.device_name || 'Equipo desconocido'}
                          </p>
                          <p className="text-[10px] text-slate-400 truncate">
                            {device.ip || 'IP no registrada'} · expira{' '}
                            {formatDateShort(device.expires_at)}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRevocar(device.id, device.device_name)}
                        disabled={actionLoading}
                        className="w-7 h-7 shrink-0 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 flex items-center justify-center transition-colors disabled:opacity-50"
                        aria-label={`Revocar ${device.device_name || 'equipo'}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </>
      )}

      {/* Modal: activar 2FA */}
      {setupData && !habilitado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <form
            onSubmit={handleConfirmar}
            className="bg-white rounded-2xl w-full max-w-md p-5 sm:p-6 shadow-2xl border border-slate-100 max-h-[92vh] overflow-y-auto animate-fade-in-entry"
          >
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-base">Activar doble factor</h3>
                  <p className="text-[11px] text-slate-500">
                    Escanea el QR y confirma con un código
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={cerrarSetup}
                disabled={actionLoading}
                className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center disabled:opacity-50"
                aria-label="Cerrar"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            {actionError && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
                <span>{actionError}</span>
              </div>
            )}

            <TwoFactorQrPanel
              qrDataUri={setupData.qr_data_uri}
              secret={setupData.secret}
              account={setupData.account}
            />

            <div className="pt-3">
              <CodeInput value={code} onChange={setCode} disabled={actionLoading} autoFocus />
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                disabled={actionLoading}
                onClick={cerrarSetup}
                className="flex-1 text-xs py-2.5 rounded-xl border-slate-200 text-slate-700"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="primary"
                isLoading={actionLoading}
                className="flex-1 text-xs py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white"
              >
                Confirmar y activar
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Modal: códigos de recuperación */}
      {recoveryCodes && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto animate-fade-in-entry">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <h3 className="font-bold text-slate-800 text-lg">Códigos de recuperación</h3>
                <p className="text-xs text-slate-500">
                  Úsalos si pierdes acceso a tu aplicación autenticadora.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setRecoveryCodes(null)}
                className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center"
                aria-label="Cerrar"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            <RecoveryCodes
              codes={recoveryCodes}
              onConfirm={() => setRecoveryCodes(null)}
              confirmLabel="Entendido, cerrar"
            />
          </div>
        </div>
      )}

      {/* Modal: desactivar 2FA */}
      {showDisable && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <form
            onSubmit={handleDesactivar}
            className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl border border-slate-100 animate-fade-in-entry"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                <ShieldOff className="w-5 h-5" aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-base">Desactivar 2FA</h3>
                <p className="text-[11px] text-slate-500">
                  Confirma tu contraseña para continuar
                </p>
              </div>
            </div>

            <div className="mb-3">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Contraseña actual
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50"
                placeholder="••••••••"
              />
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowDisable(false)
                  setPassword('')
                  limpiarMensajes()
                }}
                disabled={actionLoading}
                className="flex-1 text-xs py-2.5 rounded-xl"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="destructive"
                isLoading={actionLoading}
                className="flex-1 text-xs py-2.5 rounded-xl"
              >
                Desactivar
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
