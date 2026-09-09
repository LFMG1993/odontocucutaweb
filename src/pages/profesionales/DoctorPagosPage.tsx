import React from 'react'
import { Receipt, AlertCircle, RotateCcw } from 'lucide-react'
import { usePagos } from '@/hooks/profesionales/usePagos'
import { PagoCard } from '@/components/profesionales'
import { SEO } from '@/components/shared'

export const DoctorPagosPage: React.FC = () => {
  const { pagos, totalPagos, loading, error, refetch, descargarComprobante, downloadingId } =
    usePagos()

  return (
    <div className="space-y-4">
      <SEO
        title="Historial de Pagos — Portal Profesionales"
        description="Consulta tus liquidaciones pagadas y descarga tus comprobantes de soporte."
      />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
            Historial de Pagos
          </h1>
          <p className="text-xs text-slate-500">
            Liquidaciones formalmente cerradas y pagadas por administración
          </p>
        </div>

        <button
          onClick={() => refetch()}
          disabled={loading}
          title="Actualizar pagos"
          className="w-10 h-10 rounded-xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-center text-slate-600 hover:text-blue-700 hover:border-blue-300 transition-colors disabled:opacity-50"
        >
          <RotateCcw className={`w-4 h-4 ${loading ? 'animate-spin text-blue-600' : ''}`} />
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start justify-between gap-3 animate-fade-in-entry">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
            <div>
              <p className="font-bold">Error al cargar pagos</p>
              <p className="mt-0.5">{error}</p>
            </div>
          </div>
          <button
            onClick={() => refetch()}
            className="px-2.5 py-1 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors shrink-0"
          >
            Reintentar
          </button>
        </div>
      )}

      {loading && pagos.length === 0 ? (
        <div className="py-12 flex flex-col items-center justify-center text-slate-400 gap-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-medium text-slate-500">Cargando historial de transferencias...</p>
        </div>
      ) : pagos.length > 0 ? (
        <div className="space-y-3 animate-fade-in-entry">
          <p className="text-xs font-semibold text-slate-500">
            Total de pagos registrados: <span className="text-slate-900 font-bold">{totalPagos}</span>
          </p>
          {pagos.map((pago) => (
            <PagoCard
              key={pago.id}
              pago={pago}
              onDescargar={descargarComprobante}
              isDownloading={downloadingId === pago.id}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 px-4 bg-white rounded-3xl border border-dashed border-slate-200">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
            <Receipt className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">Sin pagos registrados</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
            Aún no se registran liquidaciones cerradas en el sistema para tu perfil clínico.
          </p>
        </div>
      )}
    </div>
  )
}
