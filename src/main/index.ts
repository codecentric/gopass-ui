import { app, BrowserWindow, Event, globalShortcut, ipcMain, Menu, Tray } from 'electron'
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

const setGlobalShortcut = (shortcut: string) => {
    globalShortcut.unregister(shortcut)
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

const updateTray = (showTray: boolean) => {
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

const listenEvents = () => {
    ipcMain.on('gopass', GopassExecutor.handleEvent)

    ipcMain.on('getUserSettings', (event: Event) => {
        event.returnValue = getUserSettings()
    })

    ipcMain.on('hideSearchWindow', () => {
        if (searchWindow) {
            searchWindow.hide()
        }
    })

    ipcMain.on('getSystemSettings', (event: Event) => {
        event.returnValue = getSystemSettings()
    })

    ipcMain.on('setUserSettings', (_: Event, data: UserSettings) => {
        setGlobalShortcut(data.searchShortcut)
        updateTray(data.showTray)
        updateStartOnLoginConfiguration(data.startOnLogin)

        electronSettings.set('user_settings', data as any)
    })

    ipcMain.on('setSystemSettings', (_: Event, data: SystemSettings) => {
        electronSettings.set('system_settings', data as any)
    })
}

const updateStartOnLoginConfiguration = (startOnLogin: boolean) => {
    app.setLoginItemSettings({
        openAtLogin: startOnLogin,
        openAsHidden: true
    })
}

const setup = async () => {
    if (process.env.NODE_ENV !== 'production') {
        await installExtensions()
    }

    const settings = getUserSettings()

    mainWindow = createMainWindow()
    searchWindow = createSearchWindow(false)

    setGlobalShortcut(settings.searchShortcut)
    updateTray(settings.showTray)
    updateStartOnLoginConfiguration(settings.startOnLogin)

    listenEvents()
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
