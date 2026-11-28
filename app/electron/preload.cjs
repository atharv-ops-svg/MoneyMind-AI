
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  isDesktop: true,

  auth: {
    getToken: () => ipcRenderer.invoke('auth:get-token'),
    setToken: token =>
      ipcRenderer.invoke('auth:set-token', token),
    clearToken: () =>
      ipcRenderer.invoke('auth:clear-token'),
  },

  security: {
    getStatus: () =>
      ipcRenderer.invoke('security:get-status'),

    verify: () =>
      ipcRenderer.invoke('security:verify'),

    setWindowsHelloEnabled: enabled =>
      ipcRenderer.invoke('security:set-windows-hello', enabled),
  },
})
