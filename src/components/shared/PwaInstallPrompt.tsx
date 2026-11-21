import { useState, type FC } from 'react'
import {
  CheckCircle2,
  Download,
  Info,
  PlusSquare,
  Share,
  Smartphone,
  X,
} from 'lucide-react'
import { usePwaInstall } from '@/hooks/usePwaInstall'
import { PWA_SNOOZE_DAYS } from '@/utils/pwaInstall'
import { Modal, useToast } from '@/components/ui'
import { Button } from './Button'

export interface PwaInstallPromptProps {
  /** 'login' se integra debajo del formulario; 'portal' flota sobre la barra móvil sin taparla */
  variant?: 'login' | 'portal'
}

export const PwaInstallPrompt: FC<PwaInstallPromptProps> = ({ variant = 'portal' }) => {
  const {
    shouldShowPrompt,
    canInstallDirectly,
    isIOS,
    isIosNonSafari,
    install,
    snooze,
    dismissForever,
  } = usePwaInstall()

  const toast = useToast()
  const [isInstalling, setIsInstalling] = useState(false)
  const [showIosGuide, setShowIosGuide] = useState(false)

  if (!shouldShowPrompt && !showIosGuide) {
    return null
  }

  const handleDirectInstall = async () => {
    setIsInstalling(true)
    try {
      const outcome = await install()
      if (outcome === 'accepted') {
        toast.success('Odontocúcuta se está instalando en tu dispositivo.')
      }
    } catch (err) {
      console.error('Error al solicitar la instalación de la PWA:', err)
      toast.error('No se pudo iniciar la instalación en este navegador.')
    } finally {
      setIsInstalling(false)
    }
  }

  const handleSnooze = () => {
    setShowIosGuide(false)
    snooze()
  }

  const handleNeverShow = () => {
    setShowIosGuide(false)
    dismissForever()
  }

  const wrapperClassName =
    variant === 'login'
      ? 'w-full mt-4'
      : 'fixed bottom-20 inset-x-3 sm:inset-x-auto sm:right-5 sm:bottom-5 sm:w-[376px] z-40'

  return (
    <>
      {shouldShowPrompt && (
        <aside
          aria-label="Instalar aplicación Odontocúcuta"
          className={wrapperClassName}
        >
          <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/90 shadow-lg shadow-slate-900/10 overflow-hidden animate-fade-in-entry">
            <div
              className="h-1 w-full bg-linear-to-r from-[#1D358E] via-blue-600 to-[#E61D2B]"
              aria-hidden="true"
            />

            <div className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-200/80 p-1 shrink-0 flex items-center justify-center shadow-xs">
                  <img
                    src="/pwa-192x192.png"
                    alt="Odontocúcuta"
                    className="w-full h-full object-contain rounded-lg"
                    loading="lazy"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-bold text-slate-900 leading-tight truncate">
                      Instala Odontocúcuta
                    </p>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-blue-50 text-[#1D358E] border border-blue-100 shrink-0">
                      App
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5 leading-snug">
                    {canInstallDirectly
                      ? 'Accede más rápido desde tu pantalla de inicio, sin abrir el navegador.'
                      : 'Agrégalo a tu pantalla de inicio en iPhone o iPad en segundos.'}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleSnooze}
                  aria-label={`Cerrar y recordar en ${PWA_SNOOZE_DAYS} días`}
                  title={`Recordar en ${PWA_SNOOZE_DAYS} días`}
                  className="w-7 h-7 -mr-1 -mt-1 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors shrink-0 cursor-pointer"
                >
                  <X className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>

              <div className="mt-3.5 flex flex-wrap items-center gap-2">
                {canInstallDirectly ? (
                  <button
                    type="button"
                    onClick={handleDirectInstall}
                    disabled={isInstalling}
                    className="flex-1 min-w-[140px] inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-[#1D358E] hover:bg-[#15276b] focus:outline-none focus:ring-2 focus:ring-[#1D358E] focus:ring-offset-1 transition-colors shadow-sm shadow-blue-900/20 disabled:opacity-60 cursor-pointer"
                  >
                    <Download className="w-4 h-4" aria-hidden="true" />
                    <span>{isInstalling ? 'Instalando...' : 'Instalar app'}</span>
                  </button>
                ) : isIOS ? (
                  <button
                    type="button"
                    onClick={() => setShowIosGuide(true)}
                    className="flex-1 min-w-[140px] inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-[#1D358E] hover:bg-[#15276b] focus:outline-none focus:ring-2 focus:ring-[#1D358E] focus:ring-offset-1 transition-colors shadow-sm shadow-blue-900/20 cursor-pointer"
                  >
                    <Share className="w-4 h-4" aria-hidden="true" />
                    <span>Cómo instalar</span>
                  </button>
                ) : null}

                <button
                  type="button"
                  onClick={handleSnooze}
                  className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200/80 focus:outline-none focus:ring-2 focus:ring-slate-400 transition-colors cursor-pointer"
                >
                  Ahora no
                </button>
              </div>

              <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                <span className="text-[11px] text-slate-400">
                  Te recordaremos cada {PWA_SNOOZE_DAYS} días
                </span>
                <button
                  type="button"
                  onClick={handleNeverShow}
                  className="text-[11px] font-semibold text-slate-500 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500/40 rounded px-1 py-0.5 transition-colors cursor-pointer"
                >
                  No volver a mostrar
                </button>
              </div>
            </div>
          </div>
        </aside>
      )}

      <Modal
        open={showIosGuide}
        onClose={() => setShowIosGuide(false)}
        title="Instalar en iPhone o iPad"
        description="Por políticas de Apple, en iOS debes agregar la app manualmente desde Safari."
        icon={<Smartphone className="w-5 h-5" aria-hidden="true" />}
        size="sm"
        footer={
          <>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleNeverShow}
              className="rounded-xl text-xs text-slate-500 hover:text-red-600"
            >
              No volver a mostrar
            </Button>
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={handleSnooze}
              className="rounded-xl text-xs bg-[#1D358E] hover:bg-[#15276b]"
            >
              Entendido
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          {isIosNonSafari && (
            <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-[#1D358E] text-xs flex items-start gap-2.5">
              <Info className="w-4 h-4 shrink-0 mt-0.5 text-blue-700" aria-hidden="true" />
              <p className="leading-snug">
                Si abriste este enlace desde WhatsApp, Instagram u otro navegador y no ves la
                opción, ábrelo primero en <strong className="font-bold">Safari</strong>.
              </p>
            </div>
          )}

          <ol className="bg-slate-50 rounded-2xl border border-slate-200/80 p-3.5 space-y-3">
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-[#1D358E] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                1
              </span>
              <div className="text-xs text-slate-700 leading-relaxed">
                <p className="font-bold text-slate-900 flex items-center gap-1.5">
                  <span>Pulsa el botón Compartir</span>
                  <Share className="w-3.5 h-3.5 text-[#1D358E] shrink-0" aria-hidden="true" />
                </p>
                <p className="text-slate-600 mt-0.5">
                  Encuéntralo en la barra inferior o superior de Safari (cuadrado con flecha hacia
                  arriba).
                </p>
              </div>
            </li>

            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-[#1D358E] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                2
              </span>
              <div className="text-xs text-slate-700 leading-relaxed">
                <p className="font-bold text-slate-900 flex items-center gap-1.5">
                  <span>Elige «Agregar a inicio»</span>
                  <PlusSquare className="w-3.5 h-3.5 text-[#1D358E] shrink-0" aria-hidden="true" />
                </p>
                <p className="text-slate-600 mt-0.5">
                  Desliza el menú hacia abajo y selecciona{' '}
                  <strong className="font-semibold text-slate-900">Agregar a inicio</strong>.
                </p>
              </div>
            </li>

            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-[#1D358E] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                3
              </span>
              <div className="text-xs text-slate-700 leading-relaxed">
                <p className="font-bold text-slate-900 flex items-center gap-1.5">
                  <span>Confirma en «Agregar»</span>
                  <CheckCircle2
                    className="w-3.5 h-3.5 text-emerald-600 shrink-0"
                    aria-hidden="true"
                  />
                </p>
                <p className="text-slate-600 mt-0.5">
                  Toca <strong className="font-semibold text-slate-900">Agregar</strong> arriba a la
                  derecha. Verás el ícono de Odontocúcuta junto a tus apps.
                </p>
              </div>
            </li>
          </ol>
        </div>
      </Modal>
    </>
  )
}
