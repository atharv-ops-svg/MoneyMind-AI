
const {
  app,
  BrowserWindow,
  ipcMain,
  safeStorage,
} = require('electron')

const path = require('node:path')
const fs = require('node:fs/promises')

function getTokenPath() {
  return path.join(app.getPath('userData'), 'auth-token.enc')
}

function ensureSecureStorage() {
  if (!safeStorage.isEncryptionAvailable()) {
    throw new Error('Secure storage is unavailable.')
  }
}

function registerAuthHandlers() {
  ipcMain.handle('auth:get-token', async () => {
    ensureSecureStorage()

    try {
      const encryptedToken = await fs.readFile(getTokenPath())
      return safeStorage.decryptString(encryptedToken)
    } catch (error) {
      if (error.code === 'ENOENT') {
        return null
      }

      throw error
    }
  })

  ipcMain.handle('auth:set-token', async (_event, token) => {
    ensureSecureStorage()

    if (
      typeof token !== 'string' ||
      !token.trim() ||
      token.length > 10000
    ) {
      throw new Error('Invalid authentication token.')
    }

    const encryptedToken = safeStorage.encryptString(token)
    const tokenPath = getTokenPath()

    await fs.mkdir(path.dirname(tokenPath), {
      recursive: true,
    })

    await fs.writeFile(tokenPath, encryptedToken, {
      mode: 0o600,
    })

    return true
  })

  ipcMain.handle('auth:clear-token', async () => {
    try {
      await fs.unlink(getTokenPath())
    } catch (error) {
      if (error.code !== 'ENOENT') {
        throw error
      }
    }

    return true
  })
}

function createMainWindow() {
  const mainWindow = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1000,
    minHeight: 650,
    show: false,
    title: 'MoneyMind AI',
    backgroundColor: '#0f1020',
    autoHideMenuBar: true,

    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      preload: path.join(__dirname, 'preload.cjs'),
    },
  })

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })

  if (app.isPackaged) {
    mainWindow.loadFile(
      path.join(__dirname, '../dist/index.html'),
    )
  } else {
    mainWindow.loadURL('http://localhost:5173')
  }
}

app.whenReady().then(() => {
  registerAuthHandlers()
  createMainWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
