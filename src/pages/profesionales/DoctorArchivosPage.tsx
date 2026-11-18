import React, { useState } from 'react'
import {
  AlertCircle,
  ChevronRight,
  Download,
  Eye,
  File,
  FileImage,
  FileSpreadsheet,
  FileText,
  Folder,
  FolderOpen,
  Home,
  Loader2,
  RotateCcw,
  Search,
} from 'lucide-react'
import { useArchivos } from '@/hooks/profesionales/useArchivos'
import { doctorService } from '@/services/profesionales/doctorService'
import { getApiErrorMessage, getApiErrorStatus } from '@/utils/apiErrors'
import type { DriveItem, DriveSheetPreview } from '@/types/profesionales'
import { SEO } from '@/components/shared'
import { FilePreviewModal } from '@/components/profesionales'
import { formatDateShort, formatFileSize } from '@/utils/formatters'

function iconoArchivo(item: DriveItem): React.ReactNode {
  if (item.isFolder) {
    return <Folder className="w-5 h-5 text-amber-500" aria-hidden="true" />
  }
  const ext = item.extension?.toLowerCase()
  if (ext === 'pdf') return <FileText className="w-5 h-5 text-red-500" aria-hidden="true" />
  if (['xlsx', 'xls', 'csv', 'gsheet'].includes(ext)) {
    return <FileSpreadsheet className="w-5 h-5 text-emerald-600" aria-hidden="true" />
  }
  if (['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(ext)) {
    return <FileImage className="w-5 h-5 text-blue-500" aria-hidden="true" />
  }
  return <File className="w-5 h-5 text-slate-400" aria-hidden="true" />
}

function puedePrevisualizar(item: DriveItem): boolean {
  const ext = item.extension?.toLowerCase()
  return (
    item.mimeType === 'application/vnd.google-apps.spreadsheet' ||
    ['pdf', 'xlsx', 'xls', 'csv', 'gsheet'].includes(ext)
  )
}

export const DoctorArchivosPage: React.FC = () => {
  const {
    configurado,
    carpetas,
    carpeta,
    breadcrumbs,
    items,
    nextPageToken,
    loading,
    loadingMore,
    error,
    seleccionarCarpeta,
    abrirSubcarpeta,
    irARuta,
    cargarMas,
    refrescar,
  } = useArchivos()

  const [filtro, setFiltro] = useState('')
  const [previewItem, setPreviewItem] = useState<DriveItem | null>(null)
  const [previewData, setPreviewData] = useState<DriveSheetPreview | Blob | null>(null)
  const [previewLoadingId, setPreviewLoadingId] = useState<string | null>(null)
  const [downloadingId, setDownloadingId] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  const itemsFiltrados = filtro.trim()
    ? items.filter((item) => item.name.toLowerCase().includes(filtro.trim().toLowerCase()))
    : items

  const abrirPreview = async (item: DriveItem) => {
    setActionError(null)
    setPreviewLoadingId(item.id)
    try {
      const data = await doctorService.previewDriveFile(item.id)
      setPreviewItem(item)
      setPreviewData(data)
    } catch (err: unknown) {
      const status = getApiErrorStatus(err)
      if (status === 404) {
        setActionError('Este tipo de archivo no tiene vista previa. Descárgalo para verlo.')
      } else {
        setActionError(getApiErrorMessage(err, 'No se pudo previsualizar el archivo.'))
      }
    } finally {
      setPreviewLoadingId(null)
    }
  }

  const descargar = async (item: DriveItem) => {
    setActionError(null)
    setDownloadingId(item.id)
    try {
      const blob = await doctorService.downloadDriveFile(item.id)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = item.name || `archivo_${item.id}`
      document.body.appendChild(a)
      a.click()
      URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err: unknown) {
      setActionError(getApiErrorMessage(err, 'No se pudo descargar el archivo.'))
    } finally {
      setDownloadingId(null)
    }
  }

  const cerrarPreview = () => {
    setPreviewItem(null)
    setPreviewData(null)
  }

  return (
    <div className="space-y-4">
      <SEO
        title="Archivos de la Clínica — Portal Profesionales"
        description="Consulta agendas, protocolos y documentos compartidos de la clínica (solo lectura)."
      />

      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
            Archivos de la clínica
          </h1>
          <p className="text-xs text-slate-500">Documentos compartidos · solo lectura</p>
        </div>
        <button
          onClick={refrescar}
          disabled={loading}
          title="Actualizar contenido"
          className="w-10 h-10 rounded-xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-center text-slate-600 hover:text-blue-700 hover:border-blue-300 transition-colors disabled:opacity-50 shrink-0"
        >
          <RotateCcw className={`w-4 h-4 ${loading ? 'animate-spin text-blue-600' : ''}`} />
        </button>
      </div>

      {!configurado && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
          <span>
            La integración con Google Drive no está configurada en el servidor. Contacta a la
            administración de la clínica.
          </span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start justify-between gap-3">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" aria-hidden="true" />
            <div>
              <p className="font-bold">Error al cargar archivos</p>
              <p className="mt-0.5">{error}</p>
            </div>
          </div>
          <button
            onClick={refrescar}
            className="px-2.5 py-1 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors shrink-0"
          >
            Reintentar
          </button>
        </div>
      )}

      {actionError && (
        <div className="p-3 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
          <span>{actionError}</span>
        </div>
      )}

      {/* Selector de carpetas autorizadas */}
      {carpetas.length > 0 && (
        <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-1 px-1">
          {carpetas.map((folder) => {
            const activa = folder.clave === carpeta
            return (
              <button
                key={folder.clave}
                type="button"
                onClick={() => seleccionarCarpeta(folder.clave)}
                className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap border transition-colors ${
                  activa
                    ? 'bg-blue-700 text-white border-blue-700 shadow-sm'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-700'
                }`}
              >
                {activa ? (
                  <FolderOpen className="w-3.5 h-3.5" aria-hidden="true" />
                ) : (
                  <Folder className="w-3.5 h-3.5" aria-hidden="true" />
                )}
                {folder.nombre}
              </button>
            )
          })}
        </div>
      )}

      {/* Migas de pan de subcarpetas */}
      {carpeta && breadcrumbs.length > 0 && (
        <nav className="flex items-center gap-1 flex-wrap text-[11px] text-slate-500" aria-label="Ruta de carpetas">
          {breadcrumbs.map((crumb, index) => {
            const esUltimo = index === breadcrumbs.length - 1
            return (
              <React.Fragment key={`${crumb.id || 'root'}-${index}`}>
                {index > 0 && <ChevronRight className="w-3 h-3 text-slate-300" aria-hidden="true" />}
                {esUltimo ? (
                  <span className="font-semibold text-slate-800 inline-flex items-center gap-1">
                    {index === 0 && <Home className="w-3 h-3" aria-hidden="true" />}
                    {crumb.nombre}
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => irARuta(index)}
                    className="inline-flex items-center gap-1 hover:text-blue-700 font-medium"
                  >
                    {index === 0 && <Home className="w-3 h-3" aria-hidden="true" />}
                    {crumb.nombre}
                  </button>
                )}
              </React.Fragment>
            )
          })}
        </nav>
      )}

      {/* Buscador local */}
      {items.length > 0 && (
        <div className="relative">
          <Search
            className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"
            aria-hidden="true"
          />
          <input
            type="search"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            placeholder="Filtrar por nombre en esta carpeta..."
            className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
          />
        </div>
      )}

      {loading && (
        <div className="py-12 flex flex-col items-center justify-center text-slate-400 gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" aria-hidden="true" />
          <p className="text-xs font-medium text-slate-500">Cargando archivos...</p>
        </div>
      )}

      {!loading && itemsFiltrados.length > 0 && (
        <ul className="bg-white rounded-2xl border border-slate-200/80 shadow-xs divide-y divide-slate-100 overflow-hidden animate-fade-in-entry">
          {itemsFiltrados.map((item) => (
            <li key={item.id} className="flex items-center gap-2 p-3">
              <button
                type="button"
                onClick={() => {
                  if (item.isFolder) {
                    abrirSubcarpeta(item)
                  } else if (puedePrevisualizar(item)) {
                    abrirPreview(item)
                  } else {
                    descargar(item)
                  }
                }}
                className="flex items-center gap-2.5 min-w-0 flex-1 text-left group"
              >
                <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                  {iconoArchivo(item)}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-800 truncate group-hover:text-blue-700 transition-colors">
                    {item.name}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {item.isFolder
                      ? 'Carpeta'
                      : `${formatFileSize(item.size)} · ${formatDateShort(item.modifiedTime)}`}
                  </p>
                </div>
              </button>

              {!item.isFolder && (
                <div className="flex items-center gap-1 shrink-0">
                  {puedePrevisualizar(item) && (
                    <button
                      type="button"
                      onClick={() => abrirPreview(item)}
                      disabled={previewLoadingId === item.id}
                      title="Previsualizar"
                      className="w-8 h-8 rounded-lg text-slate-400 hover:text-blue-700 hover:bg-blue-50 flex items-center justify-center transition-colors disabled:opacity-50"
                    >
                      {previewLoadingId === item.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
                      ) : (
                        <Eye className="w-3.5 h-3.5" aria-hidden="true" />
                      )}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => descargar(item)}
                    disabled={downloadingId === item.id}
                    title="Descargar"
                    className="w-8 h-8 rounded-lg text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 flex items-center justify-center transition-colors disabled:opacity-50"
                  >
                    {downloadingId === item.id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
                    ) : (
                      <Download className="w-3.5 h-3.5" aria-hidden="true" />
                    )}
                  </button>
                </div>
              )}

              {item.isFolder && (
                <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" aria-hidden="true" />
              )}
            </li>
          ))}
        </ul>
      )}

      {!loading && itemsFiltrados.length === 0 && configurado && carpeta && (
        <div className="text-center py-12 px-4 bg-white rounded-3xl border border-dashed border-slate-200">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
            <FolderOpen className="w-6 h-6" aria-hidden="true" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">
            {filtro ? 'Sin coincidencias' : 'Carpeta vacía'}
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
            {filtro
              ? 'Prueba con otro término o limpia el filtro.'
              : 'No hay archivos disponibles en esta ubicación.'}
          </p>
        </div>
      )}

      {nextPageToken && !loading && (
        <button
          type="button"
          onClick={cargarMas}
          disabled={loadingMore}
          className="w-full py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:border-blue-300 hover:text-blue-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {loadingMore && <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />}
          Cargar más archivos
        </button>
      )}

      {previewItem && previewData && (
        <FilePreviewModal
          item={previewItem}
          preview={previewData}
          onClose={cerrarPreview}
          onDownload={() => descargar(previewItem)}
          isDownloading={downloadingId === previewItem.id}
        />
      )}
    </div>
  )
}
