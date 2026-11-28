
type WindowsHelloVerificationStatus =
  | 'verified'
  | 'canceled'
  | 'unavailable'
  | 'not-configured'
  | 'disabled'
  | 'retries-exhausted'
  | 'busy'
  | 'failed'

interface ElectronAPI {
  isDesktop: boolean

  auth: {
    getToken: () => Promise<string | null>
    setToken: (token: string) => Promise<boolean>
    clearToken: () => Promise<boolean>
  }

  security: {
    getStatus: () => Promise<{
      supported: boolean
      windowsHelloEnabled: boolean
    }>

    verify: () => Promise<WindowsHelloVerificationStatus>

    setWindowsHelloEnabled: (
      enabled: boolean,
    ) => Promise<{
      enabled: boolean
      verification: WindowsHelloVerificationStatus
    }>
  }
}

interface Window {
  electronAPI?: ElectronAPI
}
