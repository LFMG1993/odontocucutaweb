export interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>
  prompt: () => Promise<void>
}

export type PwaPrefStatus = 'snoozed' | 'never' | 'installed'

export interface PwaInstallPreference {
  status: PwaPrefStatus
  updatedAt: number
}

export interface PwaStoreSnapshot {
  hasDeferredPrompt: boolean
  installed: boolean
  suppressed: boolean
}

const PWA_PREF_STORAGE_KEY = 'oc_pwa_install_pref_v1'
export const PWA_SNOOZE_DAYS = 8
const PWA_SNOOZE_MS = PWA_SNOOZE_DAYS * 24 * 60 * 60 * 1000

let deferredPrompt: BeforeInstallPromptEvent | null = null
let listenersInitialized = false
const subscribers = new Set<() => void>()

function readPreference(): PwaInstallPreference | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(PWA_PREF_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<PwaInstallPreference>
    if (
      (parsed.status === 'snoozed' || parsed.status === 'never' || parsed.status === 'installed') &&
      typeof parsed.updatedAt === 'number' &&
      Number.isFinite(parsed.updatedAt)
    ) {
      return { status: parsed.status, updatedAt: parsed.updatedAt }
    }
    return null
  } catch {
    return null
  }
}

function writePreference(status: PwaPrefStatus): PwaInstallPreference {
  const pref: PwaInstallPreference = { status, updatedAt: Date.now() }
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(PWA_PREF_STORAGE_KEY, JSON.stringify(pref))
    } catch {
    }
  }
  return pref
}

export function isAppInstalled(): boolean {
  if (typeof window === 'undefined') return false
  const isStandaloneMedia =
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(display-mode: standalone)').matches
  const isNavigatorStandalone =
    'standalone' in window.navigator &&
    Boolean((window.navigator as Navigator & { standalone?: boolean }).standalone)
  const isTwa = typeof document !== 'undefined' && document.referrer.startsWith('android-app://')
  return isStandaloneMedia || isNavigatorStandalone || isTwa
}

export function isIosDevice(): boolean {
  if (typeof window === 'undefined') return false
  const ua = window.navigator.userAgent
  const isAppleMobile = /iphone|ipad|ipod/i.test(ua)
  const isIpadOs =
    window.navigator.platform === 'MacIntel' && window.navigator.maxTouchPoints > 1
  return isAppleMobile || isIpadOs
}

export function isAndroidDevice(): boolean {
  if (typeof window === 'undefined') return false
  return /android/i.test(window.navigator.userAgent)
}

export function isIosNonSafariBrowser(): boolean {
  if (!isIosDevice() || typeof window === 'undefined') return false
  const ua = window.navigator.userAgent
  const isThirdPartyOrInApp =
    /CriOS|FxiOS|EdgiOS|OPiOS|DuckDuckGo|Instagram|FBAN|FBAV|WhatsApp|Line\//i.test(ua)
  const hasSafari = /Safari/i.test(ua)
  return isThirdPartyOrInApp || !hasSafari
}

export function isSuppressedByPreference(
  pref: PwaInstallPreference | null,
  now: number = Date.now()
): boolean {
  if (!pref) return false
  if (pref.status === 'never' || pref.status === 'installed') return true
  if (pref.status === 'snoozed') {
    return now - pref.updatedAt < PWA_SNOOZE_MS
  }
  return false
}

function buildSnapshot(): PwaStoreSnapshot {
  if (typeof window === 'undefined') {
    return { hasDeferredPrompt: false, installed: false, suppressed: false }
  }
  const preference = readPreference()
  return {
    hasDeferredPrompt: Boolean(deferredPrompt),
    installed: isAppInstalled(),
    suppressed: isSuppressedByPreference(preference),
  }
}

const SERVER_SNAPSHOT: PwaStoreSnapshot = {
  hasDeferredPrompt: false,
  installed: false,
  suppressed: false,
}

let currentSnapshot: PwaStoreSnapshot = buildSnapshot()

function refreshSnapshot() {
  const next = buildSnapshot()
  if (
    next.hasDeferredPrompt === currentSnapshot.hasDeferredPrompt &&
    next.installed === currentSnapshot.installed &&
    next.suppressed === currentSnapshot.suppressed
  ) {
    return
  }

  currentSnapshot = next
  subscribers.forEach((listener) => listener())
}

export function initPwaInstallListeners(): void {
  if (typeof window === 'undefined' || listenersInitialized) return
  listenersInitialized = true

  window.addEventListener('beforeinstallprompt', (event: Event) => {
    event.preventDefault()
    deferredPrompt = event as BeforeInstallPromptEvent
    refreshSnapshot()
  })

  window.addEventListener('appinstalled', () => {
    deferredPrompt = null
    writePreference('installed')
    refreshSnapshot()
  })

  if (typeof window.matchMedia === 'function') {
    const mediaQuery = window.matchMedia('(display-mode: standalone)')
    mediaQuery.addEventListener?.('change', () => {
      refreshSnapshot()
    })
  }
}

export function subscribePwaInstall(listener: () => void): () => void {
  initPwaInstallListeners()
  subscribers.add(listener)
  return () => {
    subscribers.delete(listener)
  }
}

export function getPwaInstallSnapshot(): PwaStoreSnapshot {
  return currentSnapshot
}

export function getPwaInstallServerSnapshot(): PwaStoreSnapshot {
  return SERVER_SNAPSHOT
}

export async function triggerDirectPwaInstall(): Promise<'accepted' | 'dismissed' | 'unavailable'> {
  if (!deferredPrompt) return 'unavailable'
  const promptEvent = deferredPrompt
  deferredPrompt = null

  await promptEvent.prompt()
  const { outcome } = await promptEvent.userChoice

  if (outcome === 'accepted') {
    writePreference('installed')
  } else {
    writePreference('snoozed')
  }

  refreshSnapshot()
  return outcome
}

export function snoozePwaInstallPrompt(): void {
  writePreference('snoozed')
  refreshSnapshot()
}

export function neverShowPwaInstallPrompt(): void {
  writePreference('never')
  refreshSnapshot()
}

initPwaInstallListeners()
