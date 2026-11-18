import React, { useState } from 'react'
import { AlertTriangle, Check, Copy, Download, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/shared'

interface RecoveryCodesProps {
  codes: string[]
  onConfirm?: () => void
  confirmLabel?: string
  isLoading?: boolean
}

/**
 * Muestra los códigos de recuperación 2FA una sola vez y obliga
 * al usuario a confirmar que los guardó antes de continuar.
 */
export const RecoveryCodes: React.FC<RecoveryCodesProps> = ({
  codes,
  onConfirm,
  confirmLabel = 'He guardado mis códigos',
  isLoading = false,
}) => {
  const [saved, setSaved] = useState(false)
  const [copied, setCopied] = useState(false)

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(codes.join('\n'))
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      // El portapapeles puede no estar disponible; el usuario aún puede descargar
    }
  }

  const descargar = () => {
    const contenido = [
      'OdontoSync — Códigos de recuperación 2FA',
      `Generados: ${new Date().toLocaleString('es-CO')}`,
      '',
      ...codes,
      '',
      'Guarda este archivo en un lugar seguro. Cada código es de un solo uso.',
    ].join('\n')
    const blob = new Blob([contenido], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'odontosync-codigos-recuperacion.txt'
    document.body.appendChild(a)
    a.click()
    URL.revokeObjectURL(url)
    document.body.removeChild(a)
  }

  return (
    <div className="space-y-4">
      <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-start gap-2">
        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
        <span>
          Guarda estos códigos en un lugar seguro. <strong>Se muestran una sola vez</strong> y cada uno
          sirve para un único inicio de sesión si pierdes el dispositivo.
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {codes.map((code) => (
          <code
            key={code}
            className="px-2 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-center text-xs font-mono font-semibold text-slate-700 select-all"
          >
            {code}
          </code>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={copiar}
          className="flex-1 text-xs py-2.5 rounded-xl border-slate-200 text-slate-700"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
              Copiados
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" aria-hidden="true" />
              Copiar códigos
            </>
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={descargar}
          className="flex-1 text-xs py-2.5 rounded-xl border-slate-200 text-slate-700"
        >
          <Download className="w-3.5 h-3.5" aria-hidden="true" />
          Descargar .txt
        </Button>
      </div>

      {onConfirm && (
        <div className="space-y-3 pt-1">
          <label className="flex items-start gap-2 text-xs text-slate-600 cursor-pointer">
            <input
              type="checkbox"
              checked={saved}
              onChange={(e) => setSaved(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded border-slate-300 text-blue-700 focus:ring-blue-600"
            />
            <span>Confirmo que guardé mis códigos de recuperación en un lugar seguro.</span>
          </label>
          <Button
            type="button"
            variant="primary"
            disabled={!saved}
            isLoading={isLoading}
            onClick={onConfirm}
            className="w-full py-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-sm font-bold"
          >
            <ShieldCheck className="w-4 h-4" aria-hidden="true" />
            {confirmLabel}
          </Button>
        </div>
      )}
    </div>
  )
}
