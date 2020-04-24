import { app, BrowserWindow, Event, globalShortcut, ipcMain, IpcMainEvent, Tray, session, shell, Accelerator } from 'electron'
import { URL } from 'url'
import * as path from 'path'
import * as fixPath from 'fix-path'
import * as electronSettings from 'electron-settings'

import { SystemSettings, UserSettings } from '../shared/settings'
import GopassExecutor from './GopassExecutor'
import { buildContextMenu, createMainWindow, createSearchWindow } from './AppWindows'
import { getSystemSettings, getUserSettings, installExtensions } from './AppUtilities'

fixPath()

let mainWindow: BrowserWindow | null
let searchWindow: BrowserWindow | null
let tray: Tray

const setGlobalSearchWindowShortcut = (shortcut: Accelerator, previousShortcut?: Accelerator) => {
    // unregister previously used shortcut if Electron recognises it as valid
    if (previousShortcut) {
        try {
            globalShortcut.unregister(previousShortcut)
        } catch (e) {}
    }

    // unregister shortcut from other usages within the application
    // in case an error is thrown, Electron does not recognise it as valid and the method returns
    try {
        globalShortcut.unregister(shortcut)
    } catch (e) {
        return
    }

    // register shortcut once sure it is a valid and usage-free Accelerator for Electron
    globalShortcut.register(shortcut, () => {
        if (searchWindow) {
            if (searchWindow.isFocused()) {
                searchWindow.hide()
            } else {
                searchWindow.show()
            }
        } else {
            searchWindow = createSearchWindow(true)
        }
    })
}

const setTray = (showTray: boolean) => {
    if (showTray) {
        if (!tray || tray.isDestroyed()) {
            if (process.platform === 'darwin') {
                tray = new Tray(path.join(__dirname, 'assets', 'icon-mac@2x.png'))
            } else if (process.platform === 'linux') {
                tray = new Tray(path.join(__dirname, 'assets', 'icon@2x.png'))
            } else {
                tray = new Tray(path.join(__dirname, 'assets', 'icon.png'))
            }

            tray.setToolTip('Gopass UI')
            tray.setContextMenu(buildContextMenu(mainWindow, searchWindow))
        }
    } else {
        if (tray && !tray.isDestroyed()) {
            tray.destroy()
        }
    }
}

const listenToIpcEvents = () => {
    ipcMain.on('gopass', GopassExecutor.handleEvent)

    ipcMain.on('getUserSettings', (event: IpcMainEvent) => {
        event.returnValue = getUserSettings()
    })

    ipcMain.on('hideSearchWindow', () => {
        if (searchWindow) {
            searchWindow.hide()
        }
    })

    ipcMain.on('getSystemSettings', (event: IpcMainEvent) => {
        event.returnValue = getSystemSettings()
    })

    ipcMain.on('updateUserSettings', (_: Event, update: Partial<UserSettings>) => {
        const current = getUserSettings()
        const all = { ...current, ...update }

        // modify aspects of application where updated settings need take effect
        if (update.searchShortcut && update.searchShortcut !== current.searchShortcut) {
            setGlobalSearchWindowShortcut(update.searchShortcut, current.searchShortcut)
        }
        if (update.showTray && update.showTray !== current.showTray) {
            setTray(update.showTray)
        }
        if (update.startOnLogin && update.startOnLogin !== current.startOnLogin) {
            configureStartOnLogin(update.startOnLogin)
        }

        electronSettings.set('user_settings', all as any)
    })

    ipcMain.on('updateSystemSettings', (_: Event, update: Partial<SystemSettings>) => {
        electronSettings.set('system_settings', { ...getSystemSettings(), ...update } as any)
    })
}

const configureStartOnLogin = (startOnLogin: boolean) => {
    app.setLoginItemSettings({
        openAtLogin: startOnLogin,
        openAsHidden: true
    })
}

const setup = async () => {
    /**
     * Adds a restrictive default CSP for all fetch directives to all HTTP responses of the web server.
     * About default-src: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/default-src
     * Electron reference: https://electronjs.org/docs/tutorial/security#6-define-a-content-security-policy
     */
    if (session.defaultSession) {
        const developmentHosts =
            process.env.NODE_ENV !== 'production' ? ['ws://localhost:2003', 'ws://localhost:2004', 'http://localhost:2003', 'http://localhost:2004'] : []
        const developmentHostsStr = developmentHosts.length ? ` ${developmentHosts.join(' ')}` : ''

        // session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
        //     callback({
        //         responseHeaders: {
        //             ...details.responseHeaders,
        //             'Content-Security-Policy': [`default-src 'self' 'unsafe-inline'; connect-src https://api.github.com${developmentHostsStr}`]
        //         }
        //     })
        // })
    }

    if (process.env.NODE_ENV !== 'production') {
        await installExtensions()
    }

    const settings = getUserSettings()

    mainWindow = createMainWindow()

    mainWindow.on('closed', () => {
        app.quit()
    })

    searchWindow = createSearchWindow(false)

    setGlobalSearchWindowShortcut(settings.searchShortcut, undefined)
    setTray(settings.showTray)
    configureStartOnLogin(settings.startOnLogin)

    listenToIpcEvents()
}

app.on('ready', setup)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (mainWindow === null) {
        mainWindow = createMainWindow()
    }
    if (searchWindow === null) {
        searchWindow = createSearchWindow(false)
    }
})

/**
 * Prevent navigation to every target that lays outside of the Electron application (localhost:2003 and localhost:2004)
 * Reference: https://electronjs.org/docs/tutorial/security#12-disable-or-limit-navigation
 */
app.on('web-contents-created', (event, contents) => {
    contents.on('will-navigate', (navigationEvent, navigationUrl) => {
        const parsedUrl = new URL(navigationUrl)

        if (!parsedUrl.origin.startsWith('http://localhost:200')) {
            navigationEvent.preventDefault()
        }
    })
})

/**
 * Prevents unwanted modules from 'remote' from being used.
 * Reference: https://electronjs.org/docs/tutorial/security#16-filter-the-remote-module
 */
const allowedRemoteModules = new Set(['app'])
app.on('remote-get-builtin', (event, webContents, moduleName) => {
    if (!allowedRemoteModules.has(moduleName)) {
        event.preventDefault()
        console.warn(`Blocked module "${moduleName}"`)
    }
})

const allowedModules = new Set()
const proxiedModules = new Map()
app.on('remote-require', (event, webContents, moduleName) => {
    if (proxiedModules.has(moduleName)) {
        const proxiedModule = proxiedModules.get(moduleName)
        event.returnValue = proxiedModule
        console.warn(`Proxied remote-require of module "${moduleName}" to "${proxiedModule}"`)
    }
    if (!allowedModules.has(moduleName)) {
        event.preventDefault()
        console.warn(`Blocked remote-require of module "${moduleName}"`)
    }
})

const allowedGlobals = new Set()
app.on('remote-get-global', (event, webContents, globalName) => {
    if (!allowedGlobals.has(globalName)) {
        event.preventDefault()
    }
})

app.on('remote-get-current-window', event => {
    event.preventDefault()
})

app.on('remote-get-current-web-contents', event => {
    event.preventDefault()
})

app.on('remote-get-guest-web-contents', event => {
    event.preventDefault()
})

/**
 * Mitigate malicious attempts to open new windows & frames.
 * Reference: https://electronjs.org/docs/tutorial/security#13-disable-or-limit-creation-of-new-windows
 */
app.on('web-contents-created', (event, contents) => {
    contents.on('new-window', (newWindowEvent, navigationUrl) => {
        // In this example, we'll ask the operating system
        // to open this event's url in the default browser.
        newWindowEvent.preventDefault()

        shell.openExternal(navigationUrl)
    })
})
