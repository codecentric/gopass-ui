import { app, BrowserWindow, globalShortcut, Menu, Tray } from 'electron'
import * as path from 'path'
import * as url from 'url'

let mainWindow: BrowserWindow | null
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
        label: 'Search',
        click: () => {
            // OPEN SEARCH WINDOW
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

const hideWindow = () => {
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
        if (mainWindow) {
            if (mainWindow.isVisible()) {
                hideWindow()
            } else {
                mainWindow.show()
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

const createWindow = async () => {
    if (process.env.NODE_ENV !== 'production') {
        await installExtensions()
    }

    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        title: 'gopass ui',
        icon: path.join(__dirname, 'assets', 'icon.png')
    })

    setGlobalShortcut()
    setTray()

    if (process.env.NODE_ENV !== 'production') {
        mainWindow.loadURL('http://localhost:2003')
    } else {
        mainWindow.loadURL(
            url.format({
                pathname: path.join(__dirname, 'index.html'),
                protocol: 'file:',
                slashes: true
            })
        )
    }

    if (process.env.NODE_ENV !== 'production') {
        // Open DevTools
        mainWindow.webContents.openDevTools()
    }

    mainWindow.on('closed', () => {
        mainWindow = null
    })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow()
    }
})
