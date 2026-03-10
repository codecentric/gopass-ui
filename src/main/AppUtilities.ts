import electronSettings from 'electron-settings'
import { DEFAULT_SYSTEM_SETTINGS, DEFAULT_USER_SETTINGS, SystemSettings, UserSettings } from '../shared/settings'

export const installExtensions = async () => {
    // DevTools extensions are now managed through Electron's built-in session API
    // or can be loaded manually if needed
}

export const getSystemSettings = (): SystemSettings => {
    return (electronSettings.getSync('system_settings') as any) || DEFAULT_SYSTEM_SETTINGS
}

export const getUserSettings = (): UserSettings => {
    return (electronSettings.getSync('user_settings') as any) || DEFAULT_USER_SETTINGS
}
