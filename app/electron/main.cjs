
const {
  app,
  BrowserWindow,
  ipcMain,
  safeStorage,
} = require('electron')

const path = require('node:path')
const fs = require('node:fs/promises')
const { execFile } = require('node:child_process')

let mainWindow = null
let unlockedForCurrentWindow = false

const VERIFICATION_STATUSES = new Set([
  'verified',
  'canceled',
  'unavailable',
  'not-configured',
  'disabled',
  'retries-exhausted',
  'busy',
  'failed',
])

function getTokenPath() {
  return path.join(app.getPath('userData'), 'auth-token.enc')
}

function getSecuritySettingsPath() {
  return path.join(app.getPath('userData'), 'security-settings.json')
}

function getAppIconPath() {
  return app.isPackaged
    ? path.join(process.resourcesPath, 'app', 'public', 'favicon.ico')
    : path.join(__dirname, '..', 'public', 'favicon.ico')
}

function ensureSecureStorage() {
  if (!safeStorage.isEncryptionAvailable()) {
    throw new Error('Secure storage is unavailable.')
  }
}

function isTrustedSender(event) {
  return Boolean(
    mainWindow &&
    !mainWindow.isDestroyed() &&
    event.sender === mainWindow.webContents
  )
}

async function readSecuritySettings() {
  try {
    const contents = await fs.readFile(
      getSecuritySettingsPath(),
      'utf8',
    )

    const settings = JSON.parse(contents)

    return {
      windowsHelloEnabled: settings.windowsHelloEnabled === true,
    }
  } catch (error) {
    if (error.code === 'ENOENT') {
      return { windowsHelloEnabled: false }
    }

    throw error
  }
}

async function writeSecuritySettings(settings) {
  const filePath = getSecuritySettingsPath()

  await fs.mkdir(path.dirname(filePath), {
    recursive: true,
  })

  await fs.writeFile(
    filePath,
    JSON.stringify(settings, null, 2),
    'utf8',
  )
}

function getWindowsHelloExecutable() {
  if (app.isPackaged) {
    return path.join(
      process.resourcesPath,
      'native',
      'windows-hello.exe',
    )
  }

  return path.join(
    __dirname,
    '..',
    'native',
    'windows-hello',
    'target',
    'release',
    'windows-hello.exe',
  )
}

function getWindowHandleArgument() {
  if (!mainWindow || mainWindow.isDestroyed()) {
    throw new Error('The application window is unavailable.')
  }

  const handle = mainWindow.getNativeWindowHandle()

  if (handle.length >= 8) {
    return handle.readBigUInt64LE(0).toString(16)
  }

  if (handle.length >= 4) {
    return handle.readUInt32LE(0).toString(16)
  }

  throw new Error('Could not read the application window handle.')
}

function verifyWithWindowsHello() {
  if (process.platform !== 'win32') {
    return Promise.resolve('unavailable')
  }

  let executable
  let windowHandle

  try {
    executable = getWindowsHelloExecutable()
    windowHandle = getWindowHandleArgument()
  } catch {
    return Promise.resolve('failed')
  }

  return new Promise(resolve => {
    execFile(
      executable,
      [windowHandle],
      {
        windowsHide: true,
        timeout: 120000,
        maxBuffer: 1024 * 1024,
      },
      (error, stdout) => {
        if (error) {
          resolve('failed')
          return
        }

        const status = String(stdout).trim()

        resolve(
          VERIFICATION_STATUSES.has(status)
            ? status
            : 'failed',
        )
      },
    )
  })
}

function registerAuthHandlers() {
  ipcMain.handle('auth:get-token', async event => {
    if (!isTrustedSender(event)) {
      throw new Error('Unauthorized request.')
    }

    ensureSecureStorage()

    let encryptedToken

    try {
      encryptedToken = await fs.readFile(getTokenPath())
    } catch (error) {
      if (error.code === 'ENOENT') {
        return null
      }

      throw error
    }

    const settings = await readSecuritySettings()

    if (
      settings.windowsHelloEnabled &&
      !unlockedForCurrentWindow
    ) {
      const verification = await verifyWithWindowsHello()

      if (verification !== 'verified') {
        return null
      }

      unlockedForCurrentWindow = true
    }

    return safeStorage.decryptString(encryptedToken)
  })

  ipcMain.handle('auth:set-token', async (event, token) => {
    if (!isTrustedSender(event)) {
      throw new Error('Unauthorized request.')
    }

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

    unlockedForCurrentWindow = true

    return true
  })

  ipcMain.handle('auth:clear-token', async event => {
    if (!isTrustedSender(event)) {
      throw new Error('Unauthorized request.')
    }

    try {
      await fs.unlink(getTokenPath())
    } catch (error) {
      if (error.code !== 'ENOENT') {
        throw error
      }
    }

    return true
  })

  ipcMain.handle('security:get-status', async event => {
    if (!isTrustedSender(event)) {
      throw new Error('Unauthorized request.')
    }

    const settings = await readSecuritySettings()

    return {
      supported: process.platform === 'win32',
      windowsHelloEnabled: settings.windowsHelloEnabled,
    }
  })

  ipcMain.handle('security:verify', async event => {
    if (!isTrustedSender(event)) {
      throw new Error('Unauthorized request.')
    }

    const result = await verifyWithWindowsHello()

    if (result === 'verified') {
      unlockedForCurrentWindow = true
    }

    return result
  })

  ipcMain.handle(
    'security:set-windows-hello',
    async (event, enabled) => {
      if (!isTrustedSender(event)) {
        throw new Error('Unauthorized request.')
      }

      if (typeof enabled !== 'boolean') {
        throw new Error('Invalid security setting.')
      }

      if (enabled && process.platform !== 'win32') {
        throw new Error('Windows Hello is only available on Windows.')
      }

      if (!enabled) {
        await writeSecuritySettings({
          windowsHelloEnabled: false,
        })

        unlockedForCurrentWindow = false

        return {
          enabled: false,
          verification: 'disabled',
        }
      }

      const verification = await verifyWithWindowsHello()

      if (verification !== 'verified') {
        return {
          enabled: (await readSecuritySettings()).windowsHelloEnabled,
          verification,
        }
      }

      await writeSecuritySettings({
        windowsHelloEnabled: true,
      })

      unlockedForCurrentWindow = true

      return {
        enabled: true,
        verification: 'verified',
      }
    },
  )
}

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1000,
    minHeight: 650,
    show: false,
    title: 'MoneyMind AI',
    icon: getAppIconPath(),
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

  mainWindow.on('closed', () => {
    mainWindow = null
    unlockedForCurrentWindow = false
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
  if (process.platform === 'win32') {
    app.setAppUserModelId('com.moneymind.ai')
  }

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
