import { useCallback, useSyncExternalStore } from 'react'
import {
  getPwaInstallServerSnapshot,
  getPwaInstallSnapshot,
  isAndroidDevice,
  isIosDevice,
  isIosNonSafariBrowser,
  neverShowPwaInstallPrompt,
  snoozePwaInstallPrompt,
  subscribePwaInstall,
  triggerDirectPwaInstall,
} from '@/utils/pwaInstall'

export interface UsePwaInstallResult {
  /** Indica si se debe mostrar la sugerencia automática de instalación */
  shouldShowPrompt: boolean
  /** Indica si el navegador permite lanzar el diálogo nativo de instalación (Android / Chromium) */
  canInstallDirectly: boolean
  /** Indica si el dispositivo es iPhone o iPad (requiere guía manual en Safari) */
  isIOS: boolean
  /** Indica si el dispositivo es Android */
  isAndroid: boolean
  /** Indica si en iOS se está usando un navegador distinto de Safari o un visor embebido */
  isIosNonSafari: boolean
  /** Indica si la PWA ya se está ejecutando instalada */
  isInstalled: boolean
  /** Dispara el diálogo nativo de instalación en Android / Chromium */
  install: () => Promise<'accepted' | 'dismissed' | 'unavailable'>
  /** Pospone la sugerencia por 8 días */
  snooze: () => void
  /** Desactiva permanentemente la sugerencia en este navegador */
  dismissForever: () => void
}

export function usePwaInstall(): UsePwaInstallResult {
  const snapshot = useSyncExternalStore(
    subscribePwaInstall,
    getPwaInstallSnapshot,
    getPwaInstallServerSnapshot
  )

  const isIOS = isIosDevice()
  const isAndroid = isAndroidDevice()
  const isIosNonSafari = isIosNonSafariBrowser()

  const canInstallDirectly = snapshot.hasDeferredPrompt
  const shouldShowPrompt =
    !snapshot.installed && !snapshot.suppressed && (canInstallDirectly || isIOS)

  const install = useCallback(() => triggerDirectPwaInstall(), [])
  const snooze = useCallback(() => snoozePwaInstallPrompt(), [])
  const dismissForever = useCallback(() => neverShowPwaInstallPrompt(), [])

  return {
    shouldShowPrompt,
    canInstallDirectly,
    isIOS,
    isAndroid,
    isIosNonSafari,
    isInstalled: snapshot.installed,
    install,
    snooze,
    dismissForever,
  }
}
