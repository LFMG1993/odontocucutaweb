import React, { useState } from 'react'
import { Check, Copy, KeyRound, QrCode } from 'lucide-react'

interface TwoFactorQrPanelProps {
  qrDataUri: string
  secret: string
  account?: string
}

/**
 * Muestra el QR de configuración del 2FA y permite revelar el secreto
 * para ingresarlo manualmente en la app autenticadora.
 */
export const TwoFactorQrPanel: React.FC<TwoFactorQrPanelProps> = ({ qrDataUri, secret, account }) => {
  const [manual, setManual] = useState(false)
  const [copied, setCopied] = useState(false)

  const copiarSecreto = async () => {
    try {
      await navigator.clipboard.writeText(secret)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      // Sin acceso al portapapeles: el secreto queda visible para copiarlo a mano
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
        {qrDataUri ? (
          <img
            src={qrDataUri}
            alt="Código QR para configurar el segundo factor de autenticación"
            className="w-44 h-44 rounded-xl bg-white p-2 border border-slate-200"
          />
        ) : (
          <div className="w-44 h-44 rounded-xl bg-white border border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 gap-2">
            <QrCode className="w-8 h-8" aria-hidden="true" />
            <span className="text-[11px]">QR no disponible</span>
          </div>
        )}

        <div className="text-center">
          <p className="text-xs font-semibold text-slate-700">
            Escanea el código con Google Authenticator, Authy o 1Password
          </p>
          {account && <p className="text-[11px] text-slate-500 mt-0.5">{account}</p>}
        </div>

        <button
          type="button"
          onClick={() => setManual((value) => !value)}
          className="text-[11px] font-semibold text-blue-700 hover:text-blue-900 inline-flex items-center gap-1"
        >
          <KeyRound className="w-3 h-3" aria-hidden="true" />
          {manual ? 'Ocultar clave manual' : 'Ingresar la clave manualmente'}
        </button>

        {manual && (
          <div className="w-full p-3 rounded-xl bg-white border border-slate-200 space-y-2">
            <p className="text-[10px] uppercase font-bold text-slate-400">Clave secreta</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 text-xs font-mono font-semibold text-slate-700 break-all select-all">
                {secret}
              </code>
              <button
                type="button"
                onClick={copiarSecreto}
                className="w-8 h-8 shrink-0 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
                aria-label="Copiar clave secreta"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
                ) : (
                  <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
