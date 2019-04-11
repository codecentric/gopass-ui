import { ipcRenderer } from 'electron'

import { SystemSettings, UserSettings } from '../shared/settings'

export default class Settings {
    public static getUserSettings(): UserSettings {
        return ipcRenderer.sendSync('getUserSettings')
    }

    public static setUserSettings(settings: Partial<UserSettings>) {
        const currentSettings = ipcRenderer.sendSync('getUserSettings')

        ipcRenderer.send('setUserSettings', { ...currentSettings, ...settings })
    }

    public static getSystemSettings(): SystemSettings {
        return ipcRenderer.sendSync('getSystemSettings')
    }

    public static setSystemSettings(settings: Partial<SystemSettings>) {
        const currentSettings = ipcRenderer.sendSync('getSystemSettings')

        ipcRenderer.send('setSystemSettings', { ...currentSettings, ...settings })
    }
}
