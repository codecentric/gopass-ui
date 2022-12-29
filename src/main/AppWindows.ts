import { BrowserWindow, Menu, app, nativeTheme } from 'electron'
import * as url from 'url'
import * as path from 'path'

export const createMainWindow = (): BrowserWindow => {
    nativeTheme.themeSource = 'light'
    const mainWindow = new BrowserWindow({
        width: 1000,
        height: 600,
        center: true,
        title: 'Gopass UI',
        icon: path.join(__dirname, 'assets', 'icon.png'),
        webPreferences: {
            // TODO!
            // enableRemoteModule: true,
            // worldSafeExecuteJavaScript: false
            nodeIntegration: true,
            contextIsolation: false
        }
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
    }

    return mainWindow
}

export const createSearchWindow = (show: boolean): BrowserWindow => {
    const searchWindow = new BrowserWindow({
        show,
        width: process.env.NODE_ENV !== 'production' ? 1200 : 600,
        height: 600,
        frame: false,
        center: true,
        skipTaskbar: true,
        title: 'Gopass UI Search Window',
        resizable: false,
        webPreferences: {
            // TODO
            // enableRemoteModule: true,
            // worldSafeExecuteJavaScript: false
            nodeIntegration: true,
            contextIsolation: false,
        }
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

    return searchWindow
}

export const hideMainWindow = (mainWindow: BrowserWindow | null) => {
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

export const buildContextMenu = (mainWindow: BrowserWindow | null, searchWindow: BrowserWindow | null) =>
    Menu.buildFromTemplate([
        {
            label: 'Explorer',
            click: () => {
                if (mainWindow) {
                    mainWindow.show()
                } else {
                    mainWindow = createMainWindow()
                }
            }
        },
        {
            label: 'Search',
            click: () => {
                if (searchWindow) {
                    searchWindow.show()
                } else {
                    searchWindow = createSearchWindow(true)
                }
            }
        },
        {
            type: 'separator'
        },
        {
            label: 'Quit',
            click: () => {
                app.quit()
            }
        }
    ])
