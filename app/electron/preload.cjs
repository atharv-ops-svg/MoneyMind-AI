
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  isDesktop: true,

  auth: {
    getToken: () => ipcRenderer.invoke('auth:get-token'),
    setToken: (token) =>
      ipcRenderer.invoke('auth:set-token', token),
    clearToken: () =>
      ipcRenderer.invoke('auth:clear-token'),
  },
})
