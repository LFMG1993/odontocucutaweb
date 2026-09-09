import React from 'react'
import { Download, Calendar, CheckCircle2, FileText, UserCheck, Loader2 } from 'lucide-react'
import type { HistorialPago } from '@/types/profesionales'
import { formatCurrency, formatDateShort } from '@/utils/formatters'
import { Button } from '@/components/shared'

interface PagoCardProps {
  pago: HistorialPago
  onDescargar: (pago: HistorialPago) => void
  isDownloading: boolean
}

export const PagoCard: React.FC<PagoCardProps> = ({ pago, onDescargar, isDownloading }) => {
  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-800">
                Liquidación #{pago.id}
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Pagada
              </span>
            </div>
            <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
              <Calendar className="w-3 h-3" />
              {formatDateShort(pago.fecha_inicio)} — {formatDateShort(pago.fecha_fin)}
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 block">
            Monto Pagado
          </span>
          <span className="text-base sm:text-lg font-black text-slate-900">
            {formatCurrency(pago.monto_pagado)}
          </span>
        </div>
      </div>

      <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1.5 text-slate-500">
          <UserCheck className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-[11px]">
            Autorizado por:{' '}
            <strong className="text-slate-700 font-semibold">
              {pago.autorizado_por || 'Dirección Médica'}
            </strong>
          </span>
        </div>

        {pago.tiene_comprobante ? (
          <Button
            variant="outline"
            onClick={() => onDescargar(pago)}
            disabled={isDownloading}
            className="text-[11px] py-1.5 px-3 rounded-xl border-blue-200 text-blue-700 hover:bg-blue-50 flex items-center gap-1.5"
          >
            {isDownloading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Descargando...</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>Descargar Soporte PDF</span>
              </>
            )}
          </Button>
        ) : (
          <span className="text-[11px] text-slate-400 italic flex items-center gap-1">
            <FileText className="w-3 h-3" /> Sin archivo adjunto
          </span>
        )}
      </div>
    </div>
  )
}
