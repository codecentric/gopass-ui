export interface UserSettings {
    searchShortcut: string
    theme: 'dark' | 'light'
    showTray: boolean
    startOnLogin: boolean
}

export interface SystemSettings {
    environmentTestSuccessful: boolean
}

export const DEFAULT_USER_SETTINGS: UserSettings = {
    searchShortcut: 'CmdOrCtrl+Shift+p',
    theme: 'light',
    showTray: true,
    startOnLogin: true
}

export const DEFAULT_SYSTEM_SETTINGS: SystemSettings = {
    environmentTestSuccessful: false
}
