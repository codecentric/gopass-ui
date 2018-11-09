import { app, BrowserWindow, globalShortcut, Menu, Tray, ipcMain, Event } from 'electron'
import * as path from 'path'
import * as url from 'url'
import { DEFAULT_SETTINGS, GopassUiHistorySettings } from '../shared/settings'
import * as electronSettings from 'electron-settings'
import GopassExecutor from './GopassExecutor'

let mainWindow: BrowserWindow | null
let searchWindow: BrowserWindow | null
let tray: Tray

const contextMenu = Menu.buildFromTemplate([
    {
        label: 'Open',
        click: () => {
            if (mainWindow) {
                mainWindow.show()
            } else {
                createMainWindow()
            }
        }
    },
    {
        label: 'Search',
        click: () => {
            if (searchWindow) {
                searchWindow.show()
            } else {
                createSearchWindow(true)
            }
        }
    },
    {
        label: 'Quit',
        click: () => {
            app.quit()
        }
    }
])

const installExtensions = async () => {
    const installer = require('electron-devtools-installer')
    const forceDownload = !!process.env.UPGRADE_EXTENSIONS
    const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS']

    return Promise.all(
        extensions.map(name => installer.default(installer[name], forceDownload))
    ).catch(console.log)
}

const hideMainWindow = () => {
    if (mainWindow) {
        if (app.hide) {
            // Linux and MacOS
            app.hide()
        } else {
            // for Windows
            mainWindow.blur()
            mainWindow.hide()
        }
    }
}

const setGlobalShortcut = (shortcut: string) => {
    globalShortcut.unregisterAll()
    globalShortcut.register(shortcut, () => {
        if (searchWindow) {
            if (searchWindow.isFocused()) {
                searchWindow.hide()
            } else {
                searchWindow.show()
            }
        } else {
            createSearchWindow(true)
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
            tray.setContextMenu(contextMenu)
        }
    } else {
        if (tray && !tray.isDestroyed()) {
            tray.destroy()
        }
    }
}

const createSearchWindow = (show = false) => {
    searchWindow = new BrowserWindow({
        width: process.env.NODE_ENV !== 'production' ? 1200 : 600,
        height: 600,
        center: true,
        skipTaskbar: true,
        show,
        resizable: false
    })

    searchWindow.setMenu(null)

    if (process.env.NODE_ENV !== 'production') {
        searchWindow.loadURL('http://localhost:2004')

        searchWindow.webContents.openDevTools()
    } else {
        searchWindow.loadURL(
            url.format({
                pathname: path.join(__dirname, 'search', 'index.html'),
                protocol: 'file:',
                slashes: true
            })
        )
    }

    searchWindow.on('closed', () => {
        searchWindow = null
    })
}

const createMainWindow = () => {
    mainWindow = new BrowserWindow({
        width: 1000,
        height: 600,
        title: 'Gopass UI',
        icon: path.join(__dirname, 'assets', 'icon.png')
    })

    if (process.env.NODE_ENV !== 'production') {
        mainWindow.loadURL('http://localhost:2003')

        mainWindow.webContents.openDevTools()
    } else {
        mainWindow.loadURL(
            url.format({
                pathname: path.join(__dirname, 'explorer', 'index.html'),
                protocol: 'file:',
                slashes: true
            })
        )

        mainWindow.webContents.openDevTools()
    }

    mainWindow.on('closed', () => {
        mainWindow = null
    })
}

const getSettings = (): GopassUiHistorySettings => {
    return electronSettings.get('settings') as any || DEFAULT_SETTINGS
}

const listenEvents = () => {
    ipcMain.on('gopass', GopassExecutor.handleEvent)

    ipcMain.on('hideSearchWindow', () => {
        if (searchWindow) {
            searchWindow.hide()
        }
    })

    ipcMain.on('getSettings', (event: Event) => {
        event.returnValue = getSettings()
    })

    ipcMain.on('setSettings', (_: Event, value: GopassUiHistorySettings) => {
        setGlobalShortcut(value.searchShortcut)
        updateTray(value.showTray)
        updateStartOnLoginConfiguration(value.startOnLogin)

        electronSettings.set('settings', value as any)
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

    const settings = getSettings()

    createMainWindow()
    createSearchWindow()

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
        createMainWindow()
    }
    if (searchWindow === null) {
        createSearchWindow()
    }
})
