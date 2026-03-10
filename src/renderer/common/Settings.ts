import { ipcRenderer } from 'electron'
import { SystemSettings, UserSettings } from '../../shared/settings'

export class Settings {
    public static getUserSettings(): UserSettings {
        return ipcRenderer.sendSync('getUserSettings')
    }

    public static updateUserSettings(settings: Partial<UserSettings>) {
        ipcRenderer.send('updateUserSettings', settings)
    }

    public static getSystemSettings(): SystemSettings {
        return ipcRenderer.sendSync('getSystemSettings')
    }

    public static updateSystemSettings(settings: Partial<SystemSettings>) {
        ipcRenderer.send('updateSystemSettings', settings)
    }
}
