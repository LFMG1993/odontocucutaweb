import { useEffect, useId, useRef, type FC, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

export type ModalSize = 'sm' | 'md' | 'lg'

const TAMANOS: Record<ModalSize, string> = {
  sm: 'sm:max-w-sm',
  md: 'sm:max-w-md',
  lg: 'sm:max-w-lg',
}

const FOCUSABLES =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

export interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  description?: string
  /** Icono que acompaña al título (normalmente dentro de un cuadrado de color) */
  icon?: ReactNode
  size?: ModalSize
  children?: ReactNode
  /** Botones o acciones al pie del diálogo */
  footer?: ReactNode
  /** Oculta la X de la esquina (útil cuando hay que forzar una decisión) */
  hideCloseButton?: boolean
  /** Permite cerrar al pulsar el fondo (por defecto sí) */
  closeOnBackdrop?: boolean
  /** Etiqueta accesible cuando no hay título visible */
  ariaLabel?: string
}

/**
 * Diálogo base de la app: portal, bloqueo de scroll, cierre con Escape y foco
 * atrapado. Sirve igual para confirmaciones, formularios, previsualizaciones y
 * menús que necesiten mostrarse como capa sobre la pantalla.
 */
export const Modal: FC<ModalProps> = ({
  open,
  onClose,
  title,
  description,
  icon,
  size = 'md',
  children,
  footer,
  hideCloseButton = false,
  closeOnBackdrop = true,
  ariaLabel,
}) => {
  const titleId = useId()
  const descriptionId = useId()
  const panelRef = useRef<HTMLDivElement>(null)
  const onCloseRef = useRef(onClose)

  useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])

  useEffect(() => {
    if (!open) return

    const overflowAnterior = document.body.style.overflow
    const focoAnterior =
      document.activeElement instanceof HTMLElement ? document.activeElement : null
    document.body.style.overflow = 'hidden'

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation()
        onCloseRef.current()
        return
      }
      if (event.key !== 'Tab') return

      const focusables = panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLES)
      if (!focusables || focusables.length === 0) return

      const primero = focusables[0]
      const ultimo = focusables[focusables.length - 1]

      if (event.shiftKey && document.activeElement === primero) {
        event.preventDefault()
        ultimo.focus()
      } else if (!event.shiftKey && document.activeElement === ultimo) {
        event.preventDefault()
        primero.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    panelRef.current?.focus()

    return () => {
      document.body.style.overflow = overflowAnterior
      document.removeEventListener('keydown', onKeyDown)
      focoAnterior?.focus()
    }
  }, [open])

  if (!open) return null

  const mostrarCabecera = Boolean(icon || title || description || !hideCloseButton)

  return createPortal(
    <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={closeOnBackdrop ? onClose : undefined}
        aria-hidden="true"
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-describedby={description ? descriptionId : undefined}
        aria-label={title ? undefined : ariaLabel}
        tabIndex={-1}
        className={`relative w-full ${TAMANOS[size]} bg-white rounded-t-3xl sm:rounded-2xl border border-slate-100 shadow-2xl outline-none max-h-[92vh] overflow-y-auto animate-fade-in-entry`}
      >
        <div className="p-5 space-y-4">
          {mostrarCabecera && (
            <div className="flex items-start gap-3">
              {icon && (
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  {icon}
                </div>
              )}

              <div className="flex-1 min-w-0">
                {title && (
                  <h2 id={titleId} className="text-base font-bold text-slate-900 leading-snug">
                    {title}
                  </h2>
                )}
                {description && (
                  <p id={descriptionId} className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {description}
                  </p>
                )}
              </div>

              {!hideCloseButton && (
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Cerrar"
                  className="w-8 h-8 -mr-1 -mt-1 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors shrink-0"
                >
                  <X className="w-4 h-4" aria-hidden="true" />
                </button>
              )}
            </div>
          )}

          {children}

          {footer && <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">{footer}</div>}
        </div>
      </div>
    </div>,
    document.body
  )
}
