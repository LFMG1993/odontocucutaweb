import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type FC,
  type ReactNode,
} from 'react'
import { AlertTriangle } from 'lucide-react'
import { Modal } from './Modal'

export interface ConfirmOptions {
  title: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  /** Pinta el botón de confirmar en rojo para acciones destructivas */
  destructive?: boolean
  icon?: ReactNode
}

type ConfirmFn = (opciones: ConfirmOptions) => Promise<boolean>

interface Pendiente extends ConfirmOptions {
  resolve: (valor: boolean) => void
}

const ConfirmContext = createContext<ConfirmFn>(() => Promise.resolve(false))

// eslint-disable-next-line react-refresh/only-export-components
export const useConfirm = (): ConfirmFn => useContext(ConfirmContext)

/**
 * Reemplazo de `window.confirm` con el diseño de la app. Devuelve una promesa
 * que se resuelve con `true` si el usuario confirma.
 *
 * ```ts
 * const confirmar = useConfirm()
 * if (!(await confirmar({ title: 'Cerrar sesión', destructive: true }))) return
 * ```
 */
export const ConfirmProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [pendiente, setPendiente] = useState<Pendiente | null>(null)
  const pendienteRef = useRef<Pendiente | null>(null)

  const confirmar = useCallback<ConfirmFn>(
    (opciones) =>
      new Promise<boolean>((resolve) => {
        // Si había otra confirmación abierta, se cancela para no dejar promesas colgadas
        pendienteRef.current?.resolve(false)

        const nuevo: Pendiente = { ...opciones, resolve }
        pendienteRef.current = nuevo
        setPendiente(nuevo)
      }),
    []
  )

  const responder = useCallback((valor: boolean) => {
    pendienteRef.current?.resolve(valor)
    pendienteRef.current = null
    setPendiente(null)
  }, [])

  const destructivo = pendiente?.destructive ?? false

  return (
    <ConfirmContext.Provider value={confirmar}>
      {children}

      <Modal
        open={Boolean(pendiente)}
        onClose={() => responder(false)}
        size="sm"
        title={pendiente?.title}
        description={pendiente?.description}
        ariaLabel={pendiente?.title}
        icon={pendiente?.icon ?? <AlertTriangle className="w-5 h-5" />}
        footer={
          <>
            <button
              type="button"
              autoFocus={destructivo}
              onClick={() => responder(false)}
              className="h-10 px-4 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              {pendiente?.cancelLabel ?? 'Cancelar'}
            </button>
            <button
              type="button"
              autoFocus={!destructivo}
              onClick={() => responder(true)}
              className={`h-10 px-4 rounded-xl text-xs font-bold text-white transition-colors ${
                destructivo ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-700 hover:bg-blue-800'
              }`}
            >
              {pendiente?.confirmLabel ?? 'Confirmar'}
            </button>
          </>
        }
      />
    </ConfirmContext.Provider>
  )
}
