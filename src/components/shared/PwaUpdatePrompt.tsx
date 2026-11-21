import { useCallback, useEffect, useRef, useState, type FC } from 'react'
import { RefreshCw, Sparkles } from 'lucide-react'
import { Modal } from '@/components/ui'
import { Button } from './Button'

const CHECK_INTERVAL_MS = 15 * 60 * 1000
const CHECK_THROTTLE_MS = 60 * 1000

export const PwaUpdatePrompt: FC = () => {
  const registrationRef = useRef<ServiceWorkerRegistration | null>(null)
  const lastCheckRef = useRef<number>(0)
  const updatingByUserRef = useRef<boolean>(false)
  const reloadedRef = useRef<boolean>(false)

  const [needRefresh, setNeedRefresh] = useState(false)
  const [chunkError, setChunkError] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  const checkForUpdate = useCallback(async () => {
    const registration = registrationRef.current
    if (!registration || registration.installing) return
    if (typeof navigator !== 'undefined' && !navigator.onLine) return

    const now = Date.now()
    if (now - lastCheckRef.current < CHECK_THROTTLE_MS) return
    lastCheckRef.current = now

    try {
      const resp = await fetch('/sw.js', {
        cache: 'no-store',
        headers: {
          cache: 'no-store',
          'cache-control': 'no-cache',
        },
      })
      if (resp.status !== 200) return
      await registration.update()
    } catch {
      // Silencia fallos puntuales de red al comprobar actualizaciones
    }
  }, [])

  useEffect(() => {
    const handlePreloadError = (event: Event) => {
      event.preventDefault()
      setChunkError(true)
      setDismissed(false)
    }

    window.addEventListener('vite:preloadError', handlePreloadError)

    if (!import.meta.env.PROD || !('serviceWorker' in navigator)) {
      return () => {
        window.removeEventListener('vite:preloadError', handlePreloadError)
      }
    }

    let cancelled = false
    let activeRegistration: ServiceWorkerRegistration | null = null

    const markUpdateAvailable = () => {
      if (cancelled) return
      setNeedRefresh(true)
      setDismissed(false)
    }

    const handleUpdateFound = () => {
      const installing = activeRegistration?.installing
      if (!installing) return

      installing.addEventListener('statechange', () => {
        if (installing.state === 'installed' && navigator.serviceWorker.controller) {
          markUpdateAvailable()
        }
      })
    }

    const handleControllerChange = () => {
      if (reloadedRef.current) return
      if (updatingByUserRef.current) {
        reloadedRef.current = true
        window.location.reload()
      } else {
        // Si otro proceso/pestaña activó un nuevo SW, sugerimos recargar esta vista
        markUpdateAvailable()
      }
    }

    navigator.serviceWorker.addEventListener('controllerchange', handleControllerChange)

    navigator.serviceWorker
      .register('/sw.js', { scope: '/', updateViaCache: 'none' })
      .then((registration) => {
        if (cancelled) return
        activeRegistration = registration
        registrationRef.current = registration

        if (registration.waiting && navigator.serviceWorker.controller) {
          markUpdateAvailable()
        }

        registration.addEventListener('updatefound', handleUpdateFound)
      })
      .catch((err) => {
        console.error('Error al registrar el Service Worker:', err)
      })

    const intervalId = window.setInterval(() => {
      void checkForUpdate()
    }, CHECK_INTERVAL_MS)

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        void checkForUpdate()
      }
    }

    const handleOnline = () => {
      void checkForUpdate()
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('online', handleOnline)

    return () => {
      cancelled = true
      window.clearInterval(intervalId)
      window.removeEventListener('vite:preloadError', handlePreloadError)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('online', handleOnline)
      navigator.serviceWorker.removeEventListener('controllerchange', handleControllerChange)
      activeRegistration?.removeEventListener('updatefound', handleUpdateFound)
    }
  }, [checkForUpdate])

  const open = (needRefresh || chunkError) && !dismissed

  const handleLater = () => {
    if (isUpdating) return
    setDismissed(true)
    if (!needRefresh && chunkError) {
      setChunkError(false)
    }
  }

  const handleUpdate = () => {
    setIsUpdating(true)
    updatingByUserRef.current = true

    const reloadNow = () => {
      if (reloadedRef.current) return
      reloadedRef.current = true
      window.location.reload()
    }

    window.setTimeout(reloadNow, 1500)

    const waitingWorker = registrationRef.current?.waiting
    if (waitingWorker) {
      waitingWorker.postMessage({ type: 'SKIP_WAITING' })
      return
    }

    reloadNow()
  }

  return (
    <Modal
      open={open}
      onClose={handleLater}
      closeOnBackdrop={false}
      hideCloseButton={isUpdating}
      title="Nueva actualización disponible"
      description="Hay una versión más reciente de Odontocúcuta lista para cargar."
      icon={<RefreshCw className="w-5 h-5" aria-hidden="true" />}
      size="sm"
      footer={
        <>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleLater}
            disabled={isUpdating}
            className="rounded-xl text-xs text-slate-600"
          >
            Más tarde
          </Button>
          <Button
            type="button"
            variant="primary"
            size="sm"
            isLoading={isUpdating}
            onClick={handleUpdate}
            className="rounded-xl text-xs bg-[#1D358E] hover:bg-[#15276b] text-white font-bold"
          >
            {isUpdating ? 'Actualizando...' : 'Actualizar ahora'}
          </Button>
        </>
      }
    >
      <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 leading-relaxed flex items-start gap-2.5">
        <Sparkles className="w-4 h-4 text-[#1D358E] shrink-0 mt-0.5" aria-hidden="true" />
        <p>
          Actualiza ahora para cargar la versión más reciente y evitar que el navegador mantenga
          pantallas o sesiones en caché anterior.
        </p>
      </div>
    </Modal>
  )
}
