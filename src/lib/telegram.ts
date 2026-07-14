// Обёртка над window.Telegram.WebApp — грузится через <script> в index.html
// (официальный способ от Telegram, без npm-пакета, чтобы не тянуть deprecated SDK).

interface TelegramWebApp {
  initData: string
  ready: () => void
  expand: () => void
  colorScheme: 'light' | 'dark'
  setHeaderColor?: (color: string) => void
  setBackgroundColor?: (color: string) => void
  HapticFeedback?: {
    impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void
    notificationOccurred: (type: 'error' | 'success' | 'warning') => void
  }
}

declare global {
  interface Window {
    Telegram?: { WebApp?: TelegramWebApp }
  }
}

export function getTelegramWebApp(): TelegramWebApp | null {
  return window.Telegram?.WebApp ?? null
}

export function getInitDataRaw(): string {
  return getTelegramWebApp()?.initData ?? ''
}

export function initTelegramWebApp(): void {
  const app = getTelegramWebApp()
  if (!app) return
  app.ready()
  app.expand()
  app.setBackgroundColor?.('#0d0d0d')
  app.setHeaderColor?.('#0d0d0d')
}

export function haptic(style: 'light' | 'medium' | 'heavy' = 'light'): void {
  getTelegramWebApp()?.HapticFeedback?.impactOccurred(style)
}
