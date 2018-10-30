import { app, BrowserWindow, globalShortcut, Menu, Tray } from 'electron'
import * as path from 'path'
import * as url from 'url'

let mainWindow: BrowserWindow | null
let searchWindow: BrowserWindow | null
let tray: Tray

const contextMenu = Menu.buildFromTemplate([
    {
        label: 'Open',
        click: () => {
            if (mainWindow) {
                mainWindow.show()
            }
        }
    },
    {
        label: 'SearchApplication',
        click: () => {
            if (searchWindow) {
                searchWindow.show()
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

const setGlobalShortcut = () => {
    globalShortcut.register('CmdOrCtrl+Shift+p', () => {
        if (searchWindow) {
            if (searchWindow.isFocused()) {
                searchWindow.hide()
            } else {
                searchWindow.show()
            }
        }
    })
}

const setTray = () => {
    if (process.platform === 'darwin') {
        tray = new Tray(path.join(__dirname, 'assets', 'icon-mac@2x.png'))
    } else if (process.platform === 'linux') {
        tray = new Tray(path.join(__dirname, 'assets', 'icon@2x.png'))
    } else {
        tray = new Tray(path.join(__dirname, 'assets', 'icon.png'))
    }

    tray.setToolTip('gopass ui!')
    tray.setContextMenu(contextMenu)
}

const createSearchWindow = () => {
    searchWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        center: true,
        skipTaskbar: true,
        show: false,
        resizable: false
    })

    searchWindow.setMenu(null)

    if (process.env.NODE_ENV !== 'production') {
        searchWindow.loadURL('http://localhost:2004')

        searchWindow.webContents.openDevTools()
    } else {
        searchWindow.loadURL(
            url.format({
                pathname: path.join(__dirname, 'search.html'),
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
        width: 800,
        height: 600,
        title: 'gopass ui',
        icon: path.join(__dirname, 'assets', 'icon.png')
    })

    if (process.env.NODE_ENV !== 'production') {
        mainWindow.loadURL('http://localhost:2003')

        mainWindow.webContents.openDevTools()
    } else {
        mainWindow.loadURL(
            url.format({
                pathname: path.join(__dirname, 'index.html'),
                protocol: 'file:',
                slashes: true
            })
        )
    }

    mainWindow.on('closed', () => {
        mainWindow = null
    })
}

const setup = async () => {
    if (process.env.NODE_ENV !== 'production') {
        await installExtensions()
    }

    createMainWindow()
    createSearchWindow()

    setGlobalShortcut()
    setTray()
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
