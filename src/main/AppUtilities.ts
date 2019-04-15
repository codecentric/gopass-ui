import * as electronSettings from 'electron-settings'
import { DEFAULT_SYSTEM_SETTINGS, DEFAULT_USER_SETTINGS, SystemSettings, UserSettings } from '../shared/settings'
import { Menu } from 'electron'

export const installExtensions = async () => {
    const installer = require('electron-devtools-installer')
    const forceDownload = !!process.env.UPGRADE_EXTENSIONS
    const extensions = ['REACT_DEVELOPER_TOOLS']

    return Promise.all(extensions.map(name => installer.default(installer[name], forceDownload))).catch(console.info)
}

export const getSystemSettings = (): SystemSettings => {
    return (electronSettings.get('system_settings') as any) || DEFAULT_SYSTEM_SETTINGS
}

export const getUserSettings = (): UserSettings => {
    return (electronSettings.get('user_settings') as any) || DEFAULT_USER_SETTINGS
}
