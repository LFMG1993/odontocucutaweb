import React, { useEffect, useMemo } from 'react'
import { AlertTriangle, Download, FileSpreadsheet, Loader2, X } from 'lucide-react'
import type { DriveItem, DriveSheetPreview } from '@/types/profesionales'
import { Button } from '@/components/shared'

interface FilePreviewModalProps {
  item: DriveItem
  preview: DriveSheetPreview | Blob
  onClose: () => void
  onDownload: () => void
  isDownloading?: boolean
}

function esPreviewHoja(preview: DriveSheetPreview | Blob): preview is DriveSheetPreview {
  return (preview as DriveSheetPreview).modo === 'html'
}

export const FilePreviewModal: React.FC<FilePreviewModalProps> = ({
  item,
  preview,
  onClose,
  onDownload,
  isDownloading = false,
}) => {
  const esHoja = esPreviewHoja(preview)
  const objectUrl = useMemo(() => {
    if (esHoja) return null
    return URL.createObjectURL(preview as Blob)
  }, [esHoja, preview])

  useEffect(() => {
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [objectUrl])

  const [encabezado, ...filas] = esHoja ? (preview as DriveSheetPreview).rows : []
  const sheet = esHoja ? (preview as DriveSheetPreview) : null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/70 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-5xl h-[88vh] shadow-2xl border border-slate-100 flex flex-col overflow-hidden animate-fade-in-entry">
        <header className="flex items-center justify-between gap-3 px-4 py-3 border-b border-slate-200 shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <FileSpreadsheet className="w-5 h-5" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-slate-800 truncate">{item.name}</p>
              <p className="text-[11px] text-slate-400">
                {esHoja ? 'Vista previa de hoja de cálculo' : 'Vista previa PDF'}
                {sheet?.truncated ? ' · vista truncada' : ''}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              type="button"
              variant="outline"
              onClick={onDownload}
              isLoading={isDownloading}
              className="text-xs px-3 py-2 rounded-lg border-slate-200 text-slate-700"
            >
              <Download className="w-3.5 h-3.5" aria-hidden="true" />
              <span className="hidden sm:inline">Descargar</span>
            </Button>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center"
              aria-label="Cerrar vista previa"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-auto bg-slate-50">
          {esHoja ? (
            <div className="min-w-full p-3">
              {sheet?.truncated && (
                <div className="mb-2 p-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-[11px] flex items-center gap-2">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  El archivo es muy grande: solo se muestran las primeras filas. Descárgalo para verlo completo.
                </div>
              )}
              <table className="w-full border-collapse bg-white text-[11px]">
                <thead className="sticky top-0 z-10">
                  <tr>
                    <th className="px-2 py-1.5 bg-slate-100 border border-slate-200 text-slate-400 font-bold w-10 text-right">
                      #
                    </th>
                    {(encabezado || []).map((celda, index) => (
                      <th
                        key={index}
                        className="px-2 py-1.5 bg-slate-100 border border-slate-200 text-left font-bold text-slate-700 whitespace-nowrap"
                      >
                        {String(celda ?? '')}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filas.map((fila, rowIndex) => (
                    <tr key={rowIndex} className="odd:bg-white even:bg-slate-50/70">
                      <td className="px-2 py-1.5 border border-slate-200 text-right text-slate-400">
                        {rowIndex + 1}
                      </td>
                      {(fila || []).map((celda, cellIndex) => (
                        <td
                          key={cellIndex}
                          className="px-2 py-1.5 border border-slate-200 text-slate-700 whitespace-nowrap"
                        >
                          {String(celda ?? '')}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-3">
              {objectUrl ? (
                <iframe
                  src={objectUrl}
                  title={`Vista previa de ${item.name}`}
                  className="w-full h-full min-h-[400px] rounded-xl border border-slate-200 bg-white"
                />
              ) : (
                <div className="flex items-center gap-2 text-slate-500 text-xs">
                  <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                  Preparando vista previa...
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
