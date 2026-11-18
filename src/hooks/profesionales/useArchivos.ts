import { useState, useEffect, useCallback } from 'react'
import { doctorService } from '@/services/profesionales/doctorService'
import type { DriveFolder, DriveItem } from '@/types/profesionales'

export interface DriveBreadcrumb {
  id?: string
  nombre: string
}

/**
 * Gestiona la navegación del explorador de archivos de Google Drive:
 * carpetas autorizadas, subcarpetas (parent), paginación y errores.
 */
export function useArchivos() {
  const [configurado, setConfigurado] = useState<boolean>(true)
  const [carpetas, setCarpetas] = useState<DriveFolder[]>([])
  const [carpeta, setCarpeta] = useState<string>('')
  const [breadcrumbs, setBreadcrumbs] = useState<DriveBreadcrumb[]>([{ nombre: 'Raíz' }])
  const [items, setItems] = useState<DriveItem[]>([])
  const [nextPageToken, setNextPageToken] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [loadingMore, setLoadingMore] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [refreshKey, setRefreshKey] = useState<number>(0)

  const parent = breadcrumbs[breadcrumbs.length - 1]?.id

  // Carga inicial de carpetas autorizadas
  useEffect(() => {
    let isMounted = true
    const loadFolders = async () => {
      try {
        const data = await doctorService.getDriveFolders()
        if (!isMounted) return
        setConfigurado(data.configurado)
        const lista = data.carpetas || []
        setCarpetas(lista)
        if (lista.length > 0) {
          setCarpeta((actual) => actual || lista[0].clave)
        } else {
          setLoading(false)
        }
      } catch (err: unknown) {
        if (!isMounted) return
        const msg = err instanceof Error ? err.message : 'No se pudieron cargar las carpetas'
        setError(msg)
        setLoading(false)
      }
    }
    loadFolders()
    return () => {
      isMounted = false
    }
  }, [])

  // Carga del contenido de la carpeta / subcarpeta actual
  useEffect(() => {
    if (!carpeta) return
    let isMounted = true

    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await doctorService.getDriveList(carpeta, parent)
        if (!isMounted) return
        setItems(data.items || [])
        setNextPageToken(data.nextPageToken)
      } catch (err: unknown) {
        if (!isMounted) return
        const msg = err instanceof Error ? err.message : 'No se pudo listar el contenido'
        setError(msg)
        setItems([])
        setNextPageToken(null)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    load()

    return () => {
      isMounted = false
    }
  }, [carpeta, parent, refreshKey])

  const cargarMas = useCallback(async () => {
    if (!nextPageToken || !carpeta) return
    setLoadingMore(true)
    try {
      const data = await doctorService.getDriveList(carpeta, parent, nextPageToken)
      setItems((prev) => [...prev, ...(data.items || [])])
      setNextPageToken(data.nextPageToken)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'No se pudo cargar más contenido'
      setError(msg)
    } finally {
      setLoadingMore(false)
    }
  }, [carpeta, parent, nextPageToken])

  const seleccionarCarpeta = useCallback(
    (clave: string) => {
      if (clave === carpeta && breadcrumbs.length === 1) {
        setRefreshKey((key) => key + 1)
        return
      }
      setCarpeta(clave)
      setBreadcrumbs([{ nombre: 'Raíz' }])
      setItems([])
      setNextPageToken(null)
    },
    [carpeta, breadcrumbs.length]
  )

  const abrirSubcarpeta = useCallback((item: DriveItem) => {
    if (!item.isFolder) return
    setBreadcrumbs((prev) => [...prev, { id: item.id, nombre: item.name }])
    setItems([])
    setNextPageToken(null)
  }, [])

  const irARuta = useCallback((index: number) => {
    setBreadcrumbs((prev) => {
      if (index < 0 || index >= prev.length - 1) return prev
      return prev.slice(0, index + 1)
    })
    setItems([])
    setNextPageToken(null)
  }, [])

  const refrescar = useCallback(() => {
    setRefreshKey((key) => key + 1)
  }, [])

  return {
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
  }
}
