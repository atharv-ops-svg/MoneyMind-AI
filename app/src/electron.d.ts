
interface ElectronAPI {
  isDesktop: boolean

  auth: {
    getToken: () => Promise<string | null>
    setToken: (token: string) => Promise<boolean>
    clearToken: () => Promise<boolean>
  }
}

interface Window {
  electronAPI?: ElectronAPI
}
