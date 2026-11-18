import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FC,
  type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'
import { AlertTriangle, CheckCircle2, Info, X, XCircle } from 'lucide-react'

export type ToastVariant = 'success' | 'error' | 'info' | 'warning'

export interface ToastOptions {
  message: string
  title?: string
  variant?: ToastVariant
  /** Milisegundos antes de cerrarse solo. `0` lo mantiene abierto. */
  duration?: number
}

interface ToastItem {
  id: number
  message: string
  title?: string
  variant: ToastVariant
  duration: number
}

export interface ToastApi {
  show: (opciones: ToastOptions) => number
  success: (message: string, title?: string) => number
  error: (message: string, title?: string) => number
  info: (message: string, title?: string) => number
  warning: (message: string, title?: string) => number
  dismiss: (id: number) => void
}

const ToastContext = createContext<ToastApi>({
  show: (opciones) => {
    console.warn('useToast() se usó fuera de <ToastProvider>:', opciones.message)
    return 0
  },
  success: () => 0,
  error: () => 0,
  info: () => 0,
  warning: () => 0,
  dismiss: () => {},
})

// eslint-disable-next-line react-refresh/only-export-components
export const useToast = (): ToastApi => useContext(ToastContext)

const ICONOS = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
  warning: AlertTriangle,
} as const

const ESTILOS: Record<ToastVariant, { icono: string; borde: string }> = {
  success: { icono: 'bg-emerald-50 text-emerald-600', borde: 'border-l-emerald-500' },
  error: { icono: 'bg-red-50 text-red-600', borde: 'border-l-red-500' },
  info: { icono: 'bg-blue-50 text-blue-600', borde: 'border-l-blue-500' },
  warning: { icono: 'bg-amber-50 text-amber-600', borde: 'border-l-amber-500' },
}

const DURACION_POR_DEFECTO = 4500
const DURACION_ERROR = 6000
const MAXIMO_VISIBLES = 4

interface TarjetaProps {
  toast: ToastItem
  onDismiss: (id: number) => void
}

const ToastCard: FC<TarjetaProps> = ({ toast, onDismiss }) => {
  const Icono = ICONOS[toast.variant]
  const estilos = ESTILOS[toast.variant]

  return (
    <div
      role={toast.variant === 'error' ? 'alert' : 'status'}
      className={`pointer-events-auto flex items-start gap-2.5 rounded-2xl border border-slate-200 border-l-4 ${estilos.borde} bg-white px-3.5 py-3 shadow-lg shadow-slate-900/10 animate-fade-in-entry`}
    >
      <span
        className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${estilos.icono}`}
        aria-hidden="true"
      >
        <Icono className="w-4 h-4" />
      </span>

      <div className="flex-1 min-w-0 pt-0.5">
        {toast.title && (
          <p className="text-xs font-bold text-slate-800 leading-snug">{toast.title}</p>
        )}
        <p
          className={`text-[11px] text-slate-600 leading-relaxed break-words ${
            toast.title ? 'mt-0.5' : ''
          }`}
        >
          {toast.message}
        </p>
      </div>

      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        aria-label="Cerrar notificación"
        className="w-6 h-6 -mr-1 -mt-0.5 rounded-md flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors shrink-0"
      >
        <X className="w-3.5 h-3.5" aria-hidden="true" />
      </button>
    </div>
  )
}

/**
 * Notificaciones emergentes de la app. Se muestran arriba (en móvil a todo el
 * ancho y en escritorio arriba a la derecha) y se cierran solas.
 */
export const ToastProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const timersRef = useRef(new Map<number, number>())
  const siguienteIdRef = useRef(0)

  const dismiss = useCallback((id: number) => {
    const timer = timersRef.current.get(id)
    if (timer) {
      window.clearTimeout(timer)
      timersRef.current.delete(id)
    }
    setToasts((lista) => lista.filter((toast) => toast.id !== id))
  }, [])

  const show = useCallback(
    (opciones: ToastOptions): number => {
      const id = ++siguienteIdRef.current
      const variant = opciones.variant ?? 'info'
      const duration =
        opciones.duration ?? (variant === 'error' ? DURACION_ERROR : DURACION_POR_DEFECTO)

      const item: ToastItem = {
        id,
        variant,
        duration,
        message: opciones.message,
        title: opciones.title,
      }

      setToasts((lista) => [...lista, item].slice(-MAXIMO_VISIBLES))

      if (duration > 0) {
        const timer = window.setTimeout(() => dismiss(id), duration)
        timersRef.current.set(id, timer)
      }

      return id
    },
    [dismiss]
  )

  const api = useMemo<ToastApi>(
    () => ({
      show,
      dismiss,
      success: (message, title) => show({ message, title, variant: 'success' }),
      error: (message, title) => show({ message, title, variant: 'error' }),
      info: (message, title) => show({ message, title, variant: 'info' }),
      warning: (message, title) => show({ message, title, variant: 'warning' }),
    }),
    [show, dismiss]
  )

  useEffect(() => {
    const timers = timersRef.current
    return () => {
      timers.forEach((timer) => window.clearTimeout(timer))
      timers.clear()
    }
  }, [])

  return (
    <ToastContext.Provider value={api}>
      {children}
      {createPortal(
        <div
          aria-live="polite"
          className="fixed z-[80] top-3 inset-x-3 sm:inset-x-auto sm:top-4 sm:right-4 sm:w-[380px] flex flex-col gap-2 pointer-events-none"
        >
          {toasts.map((toast) => (
            <ToastCard key={toast.id} toast={toast} onDismiss={dismiss} />
          ))}
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  )
}
